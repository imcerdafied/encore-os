import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import { AssessmentData, Recommendation } from "@/lib/types";
import { getServiceClient } from "@/lib/supabase";

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI is not configured");
  }
  return new OpenAI({ apiKey });
}

function buildPrompt(data: AssessmentData): string {
  const priorityList = Object.entries(data.priorities)
    .sort(([, a], [, b]) => b - a)
    .map(([k, v]) => `${k}: ${v}/5`)
    .join(", ");

  return `You are a world-class relocation advisor with deep knowledge of global cities, cost of living, safety, healthcare, culture, climate, and the economic impacts of AI on different regions and job markets.

Based on the user profile below, recommend exactly 4 relocation destinations. For each location include:
1. City/Region name and country
2. A compelling 2-sentence headline explaining why this fits THIS person specifically
3. Cost of living comparison vs their current city (% more or less expensive)
4. 4-5 specific reasons this fits their situation (bullet points, specific and personal)
5. What they might miss or find challenging (honest tradeoffs, 2-3 points)
6. AI economy resilience score (1-10) with one sentence explanation
7. Practical next steps: visa/residency path if international, best neighborhoods, one key resource

Mix: include options at different boldness levels — one "safe easy move," one "adventurous but realistic," one "surprising sleeper pick," one wildcard if appropriate.

USER PROFILE:
- Current location: ${data.currentCity}
- Monthly income: $${data.monthlyIncome.toLocaleString()}/month
- Monthly expenses: $${data.monthlyExpenses.toLocaleString()}/month
- Savings range: ${data.savingsRange}
- Work situation: ${data.workSituation}
- Household: ${data.household}${data.kidAges ? ` (children ages: ${data.kidAges})` : ""}
- Aging parents: ${data.agingParents ? "Yes" : "No"}
- Health considerations: ${data.healthConsiderations ? `Yes - ${data.healthDetails || "unspecified"}` : "No"}
- Priorities (rated 1-5): ${priorityList}
- Geographic range: ${data.geographicRange}
- Urban preference: ${data.urbanPreference}
- Timeline: ${data.timeline}${data.biggestFear ? `\n- Biggest fear: ${data.biggestFear}` : ""}${data.currentJob ? `\n- Job/field: ${data.currentJob}` : ""}
- AI worry level: ${data.aiWorryLevel}/5
- AI outlook: ${data.aiOutlook === "weather" ? "Looking to weather uncertainty" : data.aiOutlook === "opportunity" ? "Looking to position for opportunity" : "Not specified"}

Return ONLY a valid JSON array with exactly 4 objects, each with these exact keys:
{
  "city": "City Name",
  "country": "Country",
  "flag": "country flag emoji",
  "descriptor": "short atmospheric descriptor, e.g. The underrated gem of Southern Europe",
  "headline": "Two compelling sentences about why this fits THIS person.",
  "costComparison": "X% cheaper/more expensive than [current city]",
  "costPercent": -37,
  "reasons": ["reason 1", "reason 2", "reason 3", "reason 4"],
  "tradeoffs": ["tradeoff 1", "tradeoff 2", "tradeoff 3"],
  "aiResilienceScore": 7,
  "aiResilienceReason": "One sentence about AI economy resilience",
  "nextSteps": ["step 1", "step 2", "step 3"],
  "archetype": "safe-move|adventurous|sleeper-pick|wildcard"
}`;
}

export async function POST(request: NextRequest) {
  try {
    const data: AssessmentData = await request.json();

    if (!data.currentCity || !data.household) {
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
    const recommendations: Recommendation[] = Array.isArray(parsed)
      ? parsed
      : parsed.recommendations || parsed.destinations || Object.values(parsed)[0];

    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      throw new Error("Invalid AI response format");
    }

    const id = uuidv4();
    const shareToken = uuidv4().slice(0, 8);

    // Try to save to Supabase, but don't fail if it's not configured
    const supabase = getServiceClient();
    if (supabase) {
      try {
        await supabase.from("assessments").insert({
          id,
          inputs_json: data,
          results_json: recommendations,
          share_token: shareToken,
          created_at: new Date().toISOString(),
        });
      } catch {
        console.log("Supabase insert failed, results won't be persisted");
      }
    }

    return NextResponse.json({
      id,
      shareToken,
      inputs: data,
      recommendations: recommendations.slice(0, 1),
      totalRecommendations: recommendations.length,
      paid: false,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Assessment error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to generate recommendations";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
