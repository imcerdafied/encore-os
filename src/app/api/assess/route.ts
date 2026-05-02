import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import { AssessmentData, Recommendation } from "@/lib/types";
import { getServiceClient } from "@/lib/supabase";
import { getAssessmentAnalyticsProperties } from "@/lib/analytics-events";
import { captureServerEvent } from "@/lib/posthog-server";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("MISSING_OPENAI_API_KEY");
  }
  return new OpenAI({ apiKey });
}

function buildPrompt(data: AssessmentData): string {
  const currency = data.currency || "USD";
  const currentLocation = [data.currentCity, data.currentCountry]
    .filter(Boolean)
    .join(", ");
  const priorityList = Object.entries(data.priorities)
    .sort(([, a], [, b]) => b - a)
    .map(([k, v]) => `${k}: ${v}/5`)
    .join(", ");
  const costPriority = data.priorities["Cost of living"] || 0;
  const taxPriority = Math.max(
    data.priorities["Cost of living"] || 0,
    data.priorities["Political stability"] || 0
  );

  return `You are a world-class global relocation advisor with deep knowledge of Latin America, Europe, North America, and other international move paths. You understand cost of living, safety, healthcare, education, culture, climate, language fit, taxes, residency routes, digital nomad options, and career resilience.

Based on the user profile below, recommend exactly 4 relocation destinations. For each location include:
1. City/Region name and country
2. A compelling 2-sentence headline explaining why this fits THIS person specifically
3. Cost of living comparison vs their current location (% more or less expensive)
4. 4-5 specific reasons this fits their situation (bullet points, specific and personal)
5. What they might miss or find challenging (honest tradeoffs, 2-3 points)
6. Career resilience score (1-10) with one sentence explanation
7. Practical next steps: visa or residency path if relevant, best neighborhoods, tax or professional-advice prompt where appropriate, one key resource

Mix: include options at different boldness levels: one "safe easy move," one "adventurous but realistic," one "surprising sleeper pick," one wildcard if appropriate.

IMPORTANT GLOBAL RULES:
- Do not assume the user is American unless citizenship, tax residency, or current country says so.
- Use the user's chosen currency (${currency}) when describing income, expenses, savings, and relative affordability. You may use percentages for cross-country comparisons.
- Treat citizenship, passports, tax residency, and languages as major constraints for visa realism, taxation, school access, healthcare, banking, and ease of daily life.
- For Latin America and Europe recommendations, include practical differences across residency, tax, healthcare access, safety by neighborhood, and language friction.
- Avoid legal, tax, or immigration certainty. Phrase these as likely paths to research and suggest local professional advice for high-stakes decisions.
- Do not use em dashes in any response text. Use commas, colons, or short sentences instead.

IMPORTANT COST AND TAX RULES:
- If "Cost of living" is rated 4 or 5, the safe easy move MUST be meaningfully cheaper than the current location, preferably 10%+ cheaper. Do not make the safe move more expensive.
- If the user has high income and high monthly expenses, still optimize for improved after-tax cash flow, not prestige or generic desirability.
- Do not recommend a higher-tax or higher-cost place unless it is explicitly the wildcard and the headline/tradeoffs explain why the upside may justify the higher cost.
- Avoid routing someone from a lower-tax location to a higher-tax location when cost or financial stability are top priorities, unless there is a very specific non-financial need in their profile.
- Cost priority detected: ${costPriority}/5. Tax sensitivity proxy: ${taxPriority}/5.

USER PROFILE:
- Current location: ${currentLocation}
- Currency: ${currency}
- Monthly income: ${currency} ${data.monthlyIncome.toLocaleString()}/month
- Monthly total expenses, including housing: ${currency} ${data.monthlyExpenses.toLocaleString()}/month
- Savings range: ${data.savingsRange}
- Work situation: ${data.workSituation}
- Household: ${data.household}${data.kidAges ? ` (children ages: ${data.kidAges})` : ""}
- Aging parents: ${data.agingParents ? "Yes" : "No"}
- Health considerations: ${data.healthConsiderations ? `Yes - ${data.healthDetails || "unspecified"}` : "No"}
- Priorities (rated 1-5): ${priorityList}
- Geographic range: ${data.geographicRange}
- Urban preference: ${data.urbanPreference}
- Citizenship/passports: ${data.citizenships || "Not provided"}
- Tax residency: ${data.taxResidency || "Not provided"}
- Languages: ${data.languages || "Not provided"}
- Timeline: ${data.timeline}${data.biggestFear ? `\n- Biggest fear: ${data.biggestFear}` : ""}${data.currentJob ? `\n- Job/field: ${data.currentJob}` : ""}
- Income disruption worry level: ${data.aiWorryLevel}/5
- Opportunity outlook: ${data.aiOutlook === "weather" ? "Looking for stability and lower cost" : data.aiOutlook === "opportunity" ? "Looking to position for growth and innovation" : "Not specified"}

Return ONLY a valid JSON object with this exact shape:
{
  "recommendations": [
{
  "city": "City Name",
  "country": "Country",
  "flag": "country flag emoji",
  "descriptor": "short atmospheric descriptor, e.g. The underrated gem of Southern Europe",
  "headline": "Two compelling sentences about why this fits THIS person.",
  "costComparison": "X% cheaper/more expensive than [current location]",
  "costPercent": -37,
  "reasons": ["reason 1", "reason 2", "reason 3", "reason 4"],
  "tradeoffs": ["tradeoff 1", "tradeoff 2", "tradeoff 3"],
  "aiResilienceScore": 7,
  "aiResilienceReason": "One sentence about career and economic resilience",
  "nextSteps": ["step 1", "step 2", "step 3"],
  "archetype": "safe-move|adventurous|sleeper-pick|wildcard"
}
  ]
}`;
}

function isRecommendationLike(value: unknown): value is Recommendation {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<Recommendation>;
  return (
    typeof candidate.city === "string" &&
    typeof candidate.country === "string" &&
    typeof candidate.headline === "string" &&
    Array.isArray(candidate.reasons) &&
    Array.isArray(candidate.tradeoffs) &&
    Array.isArray(candidate.nextSteps)
  );
}

function findRecommendationArray(value: unknown): Recommendation[] | null {
  if (Array.isArray(value)) {
    return value.every(isRecommendationLike) ? value : null;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const objectValue = value as Record<string, unknown>;
  const preferredKeys = [
    "recommendations",
    "destinations",
    "locations",
    "results",
  ];

  for (const key of preferredKeys) {
    const nested = findRecommendationArray(objectValue[key]);
    if (nested) {
      return nested;
    }
  }

  for (const nestedValue of Object.values(objectValue)) {
    const nested = findRecommendationArray(nestedValue);
    if (nested) {
      return nested;
    }
  }

  return null;
}

function cleanText(value: string) {
  return value.replace(/[\u2013\u2014]/g, ", ");
}

function cleanMaybeText(value: unknown) {
  return typeof value === "string" ? cleanText(value) : "";
}

function cleanTextList(value: unknown) {
  return Array.isArray(value) ? value.map((item) => cleanMaybeText(item)) : [];
}

function normalizeRecommendations(recommendations: Recommendation[]) {
  return recommendations.map((recommendation) => ({
    ...recommendation,
    city: cleanMaybeText(recommendation.city),
    country: cleanMaybeText(recommendation.country),
    descriptor: cleanMaybeText(recommendation.descriptor),
    headline: cleanMaybeText(recommendation.headline),
    costComparison: cleanMaybeText(recommendation.costComparison),
    reasons: cleanTextList(recommendation.reasons),
    tradeoffs: cleanTextList(recommendation.tradeoffs),
    aiResilienceReason: cleanMaybeText(recommendation.aiResilienceReason),
    nextSteps: cleanTextList(recommendation.nextSteps),
    archetype: cleanMaybeText(recommendation.archetype),
    costPercent:
      typeof recommendation.costPercent === "number"
        ? recommendation.costPercent
        : Number.parseFloat(String(recommendation.costPercent)) || 999,
    aiResilienceScore:
      typeof recommendation.aiResilienceScore === "number"
        ? recommendation.aiResilienceScore
        : Number.parseFloat(String(recommendation.aiResilienceScore)) || 0,
  }));
}

function prioritizeRecommendations(
  recommendations: Recommendation[],
  data: AssessmentData
) {
  const costPriority = data.priorities["Cost of living"] || 0;
  if (costPriority < 4) {
    return recommendations;
  }

  return [...recommendations].sort((a, b) => {
    const aCost = Number.isFinite(a.costPercent) ? a.costPercent : 999;
    const bCost = Number.isFinite(b.costPercent) ? b.costPercent : 999;
    const aPenalty = aCost > 0 ? 1000 + aCost : aCost;
    const bPenalty = bCost > 0 ? 1000 + bCost : bCost;
    return aPenalty - bPenalty;
  });
}

function stripDeepDive(recommendations: Recommendation[]) {
  return recommendations.map((recommendation) => ({
    ...recommendation,
    tradeoffs: [],
    nextSteps: [],
  }));
}

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(getRateLimitKey(request), {
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      await captureServerEvent("assessment_rate_limited_server", "server", {
        reset_at: new Date(rateLimit.resetAt).toISOString(),
      });

      return NextResponse.json(
        { error: "Too many assessment attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000))
            ),
          },
        }
      );
    }

    const data: AssessmentData = await request.json();

    if (!data.currentCity || !data.currentCountry || !data.household) {
      await captureServerEvent("assessment_validation_failed_server", "server", {
        has_current_city: Boolean(data.currentCity),
        has_current_country: Boolean(data.currentCountry),
        has_household: Boolean(data.household),
      });

      return NextResponse.json(
        { error: "Please complete the assessment" },
        { status: 400 }
      );
    }

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a relocation advisor. Return only valid JSON." },
        { role: "user", content: buildPrompt(data) },
      ],
      temperature: 0.8,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const parsed = JSON.parse(content);
    const recommendations = findRecommendationArray(parsed);

    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      throw new Error("Invalid AI response format");
    }
    const prioritizedRecommendations = prioritizeRecommendations(
      normalizeRecommendations(recommendations),
      data
    );

    const id = uuidv4();
    const shareToken = uuidv4().slice(0, 8);

    // Try to save to Supabase, but don't fail if it's not configured
    const supabase = getServiceClient();
    if (supabase) {
      try {
        await supabase.from("assessments").insert({
          id,
          inputs_json: data,
          results_json: prioritizedRecommendations,
          share_token: shareToken,
          created_at: new Date().toISOString(),
        });
      } catch {
        console.log("Supabase insert failed, results won't be persisted");
      }
    }

    await captureServerEvent("assessment_generated_server", id, {
      ...getAssessmentAnalyticsProperties(data),
      visible_recommendations: prioritizedRecommendations.length,
      total_recommendations: prioritizedRecommendations.length,
      paid: false,
    });

    return NextResponse.json({
      id,
      shareToken,
      inputs: data,
      recommendations: stripDeepDive(prioritizedRecommendations),
      totalRecommendations: prioritizedRecommendations.length,
      paid: false,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Assessment error:", err);
    await captureServerEvent("assessment_generation_failed_server", "server", {
      error_name: err instanceof Error ? err.name : "unknown",
      missing_openai_key:
        err instanceof Error && err.message === "MISSING_OPENAI_API_KEY",
    });

    if (err instanceof Error && err.message === "MISSING_OPENAI_API_KEY") {
      return NextResponse.json(
        {
          error:
            "Encore OS is not connected to OpenAI yet. Add OPENAI_API_KEY in Vercel to generate recommendations.",
        },
        { status: 503 }
      );
    }

    const message =
      err instanceof Error ? err.message : "Failed to generate recommendations";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
