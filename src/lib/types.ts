export interface AssessmentData {
  // Step 1: Where you are now
  currentCity: string;
  currentCountry: string;
  currency: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRange: string;
  workSituation: string;

  // Step 2: Life situation
  household: string;
  kidAges: string;
  agingParents: boolean;
  healthConsiderations: boolean;
  healthDetails: string;

  // Step 3: Priorities
  priorities: Record<string, number>;

  // Step 4: Openness to change
  geographicRange: string;
  urbanPreference: string;
  timeline: string;
  citizenships: string;
  taxResidency: string;
  languages: string;
  biggestFear: string;

  // Step 5: Work and opportunity
  currentJob: string;
  aiWorryLevel: number;
  aiOutlook: string;
}

export const defaultAssessment: AssessmentData = {
  currentCity: "",
  currentCountry: "",
  currency: "USD",
  monthlyIncome: 10000,
  monthlyExpenses: 5000,
  savingsRange: "",
  workSituation: "",
  household: "",
  kidAges: "",
  agingParents: false,
  healthConsiderations: false,
  healthDetails: "",
  priorities: {},
  geographicRange: "",
  urbanPreference: "",
  timeline: "",
  citizenships: "",
  taxResidency: "",
  languages: "",
  biggestFear: "",
  currentJob: "",
  aiWorryLevel: 3,
  aiOutlook: "",
};

export interface Recommendation {
  city: string;
  country: string;
  flag: string;
  descriptor: string;
  headline: string;
  costComparison: string;
  costPercent: number;
  reasons: string[];
  tradeoffs: string[];
  aiResilienceScore: number;
  aiResilienceReason: string;
  nextSteps: string[];
  archetype: string;
}

export interface AssessmentResult {
  id: string;
  shareToken: string;
  inputs: AssessmentData;
  recommendations: Recommendation[];
  totalRecommendations?: number;
  paid?: boolean;
  createdAt: string;
}
