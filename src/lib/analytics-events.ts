import type { AssessmentData, AssessmentResult, Recommendation } from "@/lib/types";

export type AnalyticsValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | number[];

export type AnalyticsProperties = Record<string, AnalyticsValue>;

function moneyBand(value?: number) {
  if (!value || value <= 0) return "unknown";
  if (value < 2500) return "under_2_5k";
  if (value < 5000) return "2_5k_to_5k";
  if (value < 10000) return "5k_to_10k";
  if (value < 20000) return "10k_to_20k";
  if (value < 50000) return "20k_to_50k";
  if (value < 100000) return "50k_to_100k";
  return "100k_plus";
}

function listCount(value?: string) {
  if (!value) return 0;
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean).length;
}

export function cleanAnalyticsProperties(properties: AnalyticsProperties = {}) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined)
  );
}

export function getAssessmentAnalyticsProperties(
  data: Partial<AssessmentData>
): AnalyticsProperties {
  const priorities = data.priorities || {};
  const highPriorities = Object.entries(priorities)
    .filter(([, score]) => score >= 4)
    .map(([priority]) => priority);

  return cleanAnalyticsProperties({
    current_country: data.currentCountry || "unknown",
    currency: data.currency || "unknown",
    household: data.household || "unknown",
    work_situation: data.workSituation || "unknown",
    geographic_range: data.geographicRange || "unknown",
    urban_preference: data.urbanPreference || "unknown",
    timeline: data.timeline || "unknown",
    savings_range: data.savingsRange || "unknown",
    monthly_income_band: moneyBand(data.monthlyIncome),
    monthly_expenses_band: moneyBand(data.monthlyExpenses),
    priorities_count: Object.keys(priorities).length,
    high_priorities: highPriorities,
    career_protection_level: data.aiWorryLevel || 0,
    opportunity_posture: data.aiOutlook || "unknown",
    has_aging_parents: Boolean(data.agingParents),
    has_health_considerations: Boolean(data.healthConsiderations),
    has_citizenships: Boolean(data.citizenships),
    has_tax_residency: Boolean(data.taxResidency),
    language_count: listCount(data.languages),
  });
}

export function getResultAnalyticsProperties(
  result: AssessmentResult,
  paid: boolean
): AnalyticsProperties {
  const recommendations = result.recommendations || [];

  return cleanAnalyticsProperties({
    assessment_id: result.id,
    paid,
    recommendations_count: recommendations.length,
    total_recommendations:
      result.totalRecommendations || recommendations.length || 0,
    recommendation_countries: Array.from(
      new Set(recommendations.map((rec) => rec.country).filter(Boolean))
    ),
    recommendation_archetypes: recommendations
      .map((rec) => rec.archetype)
      .filter(Boolean),
  });
}

export function getRecommendationAnalyticsProperties(
  recommendation: Recommendation,
  index: number
): AnalyticsProperties {
  return cleanAnalyticsProperties({
    recommendation_rank: index + 1,
    recommendation_country: recommendation.country,
    recommendation_archetype: recommendation.archetype,
    career_resilience_score: recommendation.aiResilienceScore,
  });
}
