"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AssessmentData, defaultAssessment } from "@/lib/types";
import { identify, track } from "@/lib/analytics";
import { getAssessmentAnalyticsProperties } from "@/lib/analytics-events";
import BrandLockup from "@/components/BrandLockup";

const PRIORITIES = [
  "Cost of living",
  "Safety & stability",
  "Weather & climate",
  "Healthcare quality",
  "Outdoor lifestyle / nature",
  "Culture, arts, food scene",
  "Community & social life",
  "School quality",
  "Expat/English-speaking community",
  "Political stability",
  "Distance from current home/family",
];

const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "MXN",
  "BRL",
  "COP",
  "ARS",
  "CLP",
  "PEN",
  "UYU",
];

const SAVINGS_RANGES = [
  "Less than 6 months of expenses",
  "6 to 18 months of expenses",
  "18 months to 3 years of expenses",
  "3+ years of expenses",
  "Financially independent",
];

const WORK_SITUATIONS = [
  "Fully remote",
  "Hybrid (tied to location)",
  "In-person",
  "Business owner",
  "Retired / semi-retired",
  "Unemployed / transitioning",
];

const HOUSEHOLDS = [
  "Solo",
  "Partner (no kids)",
  "Partner + young kids",
  "Partner + adult kids",
  "Single parent",
  "Empty nester",
  "Retired couple",
];

const GEO_RANGES = [
  "Same country only",
  "Latin America",
  "Europe",
  "North America",
  "Americas",
  "Europe + Latin America",
  "Asia/Pacific",
  "Anywhere",
];

const URBAN_PREFS = ["Major city", "Mid-size city", "Small town", "Rural / nature"];

const TIMELINES = [
  "Exploring ideas",
  "Seriously considering (1-2 years)",
  "Actively planning (next 6 months)",
];

const MONEY_MAX = 200000;

const STEP_NAMES: Record<number, string> = {
  1: "where_you_are_now",
  2: "life_situation",
  3: "priorities",
  4: "openness_to_change",
  5: "work_and_opportunity",
};

function formatMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${value.toLocaleString()}`;
  }
}

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-12 rounded-[8px] border px-4 py-3 text-left text-sm font-medium transition-all ${
        selected
          ? "border-accent bg-accent text-white shadow-soft"
          : "border-border bg-surface text-text hover:border-accent hover:bg-[#fff3df]"
      }`}
    >
      {label}
    </button>
  );
}

export default function AssessPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<AssessmentData>(defaultAssessment);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const viewedSteps = useRef<Set<number>>(new Set());

  const update = (fields: Partial<AssessmentData>) =>
    setData((prev) => ({ ...prev, ...fields }));

  const updatePriority = (key: string, value: number) =>
    setData((prev) => ({
      ...prev,
      priorities: { ...prev.priorities, [key]: value },
    }));

  const canNext = () => {
    switch (step) {
      case 1:
        return (
          data.currentCity &&
          data.currentCountry &&
          data.savingsRange &&
          data.workSituation
        );
      case 2:
        return data.household;
      case 3:
        return Object.keys(data.priorities).length >= 3;
      case 4:
        return data.geographicRange && data.urbanPreference && data.timeline;
      case 5:
        return true;
      default:
        return false;
    }
  };

  useEffect(() => {
    if (viewedSteps.current.has(step)) return;
    viewedSteps.current.add(step);

    track("assessment_step_viewed", {
      step,
      step_name: STEP_NAMES[step],
    });
  }, [step]);

  const goBack = () => {
    track("assessment_back_clicked", {
      step,
      step_name: STEP_NAMES[step],
    });
    setStep((s) => Math.max(1, s - 1));
  };

  const goNext = () => {
    track("assessment_step_completed", {
      step,
      step_name: STEP_NAMES[step],
      ...getAssessmentAnalyticsProperties(data),
    });
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    track("assessment_submitted", getAssessmentAnalyticsProperties(data));

    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Something went wrong");
      }
      const result = await res.json();
      identify(result.id, getAssessmentAnalyticsProperties(data));
      track("assessment_generated", {
        assessment_id: result.id,
        visible_recommendations: result.recommendations?.length || 0,
        total_recommendations: result.totalRecommendations || 0,
        paid: Boolean(result.paid),
      });
      sessionStorage.setItem(`result-${result.id}`, JSON.stringify(result));
      router.push(`/results?id=${result.id}`);
    } catch (err) {
      track("assessment_generation_failed", {
        error_name: err instanceof Error ? err.name : "unknown",
      });
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  const progressWidth = `${(step / 5) * 100}%`;
  const readyForNext = Boolean(canNext());
  const keepMobileNavSticky = step > 1 || readyForNext;

  if (loading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg">
        <div className="absolute inset-0 bg-[url('/images/encore-hero-map.png')] bg-cover bg-center opacity-18" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(251,247,239,0.95)_0%,rgba(255,243,223,0.86)_48%,rgba(234,247,244,0.9)_100%)]" />
        <div className="relative mx-auto max-w-md px-6 text-center">
          <div className="mx-auto mb-8 h-12 w-12 animate-spin rounded-full border-2 border-border border-t-accent" />
          <h2 className="text-2xl font-black text-text mb-3">
            Mapping what could be next
          </h2>
          <p className="text-text-secondary text-sm mb-8">
            Looking for places that fit the life you are building.
          </p>
          <div className="w-full bg-bg-subtle h-1 overflow-hidden rounded-full">
            <div className="h-full bg-[linear-gradient(90deg,var(--accent),var(--gold),var(--teal))] loading-bar" />
          </div>
          <div className="mt-8 text-text-secondary text-xs">
            <p className="animate-pulse">
              Weighing cost, care, work, and everyday rhythm.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-bg">
      <div className="pointer-events-none absolute inset-0 bg-[url('/images/encore-hero-map.png')] bg-cover bg-top opacity-14" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(251,247,239,0.98)_0%,rgba(251,247,239,0.92)_48%,rgba(234,247,244,0.72)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(201,162,79,0.18)_0%,rgba(201,162,79,0)_30%)]" />
      {/* Progress bar */}
      <div className="relative h-1 bg-border">
        <div
          className="h-full bg-[linear-gradient(90deg,var(--accent),var(--gold),var(--teal))] transition-all duration-500"
          style={{ width: progressWidth }}
        />
      </div>

      <nav className="relative mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <BrandLockup />
        <span className="rounded-[8px] bg-surface px-3 py-1 font-mono text-xs text-text-secondary">
          Step {step} of 5
        </span>
      </nav>

      <div className="relative mx-auto max-w-3xl px-5 py-6 sm:px-6 sm:py-8">
        {/* Step 1: Where you are now */}
        {step === 1 && (
          <div className="animate-fade-in">
            <p className="font-mono text-xs text-text-secondary mb-6">
              &bull; encore-os / assess
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-text mb-2">
              Where you are now
            </h2>
            <p className="text-text-secondary mb-10">
              Tell us where life starts today so we can imagine better-fit
              possibilities from there.
            </p>

            <div className="space-y-8">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-3 block font-mono text-xs uppercase text-text-secondary">
                    Current city
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mexico City"
                    value={data.currentCity}
                    onChange={(e) => update({ currentCity: e.target.value })}
                    className="h-12 w-full rounded-[8px] border border-border bg-surface px-4 py-3 text-[16px] text-text placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>

                <div>
                  <label className="mb-3 block font-mono text-xs uppercase text-text-secondary">
                    Current country
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mexico"
                    value={data.currentCountry}
                    onChange={(e) =>
                      update({ currentCountry: e.target.value })
                    }
                    className="h-12 w-full rounded-[8px] border border-border bg-surface px-4 py-3 text-[16px] text-text placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-3 block font-mono text-xs uppercase text-text-secondary">
                  Primary currency
                </label>
                <select
                  value={data.currency}
                  onChange={(e) => update({ currency: e.target.value })}
                  className="h-12 w-full rounded-[8px] border border-border bg-surface px-4 text-[16px] text-text focus:outline-none focus:ring-2 focus:ring-accent/30"
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
                  Monthly take-home income
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-text-secondary">
                      Per month
                    </span>
                    <span className="font-mono text-sm text-text">
                      {formatMoney(data.monthlyIncome, data.currency)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={MONEY_MAX}
                    step={1000}
                    value={data.monthlyIncome}
                    onChange={(e) =>
                      update({ monthlyIncome: Number(e.target.value) })
                    }
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
                  Monthly total expenses, including housing
                </label>
                <p className="mb-3 text-sm text-text-secondary">
                  Include rent or mortgage, childcare, debt, travel, recurring
                  bills, and normal monthly spend.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-text-secondary">
                      Per month
                    </span>
                    <span className="font-mono text-sm text-text">
                      {formatMoney(data.monthlyExpenses, data.currency)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={MONEY_MAX}
                    step={500}
                    value={data.monthlyExpenses}
                    onChange={(e) =>
                      update({ monthlyExpenses: Number(e.target.value) })
                    }
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
                  Net worth / savings range
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {SAVINGS_RANGES.map((r) => (
                    <OptionButton
                      key={r}
                      label={r}
                      selected={data.savingsRange === r}
                      onClick={() => update({ savingsRange: r })}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
                  Work situation
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {WORK_SITUATIONS.map((w) => (
                    <OptionButton
                      key={w}
                      label={w}
                      selected={data.workSituation === w}
                      onClick={() => update({ workSituation: w })}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Life situation */}
        {step === 2 && (
          <div className="animate-fade-in">
            <p className="font-mono text-xs text-text-secondary mb-6">
              &bull; encore-os / assess
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-text mb-2">
              Life situation
            </h2>
            <p className="text-text-secondary mb-10">
              Your household shapes what matters in a location.
            </p>

            <div className="space-y-8">
              <div>
                <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
                  Household
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {HOUSEHOLDS.map((h) => (
                    <OptionButton
                      key={h}
                      label={h}
                      selected={data.household === h}
                      onClick={() => update({ household: h })}
                    />
                  ))}
                </div>
              </div>

              {(data.household === "Partner + young kids" ||
                data.household === "Single parent") && (
                <div>
                  <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
                    Young children&apos;s ages
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4, 7, 12"
                    value={data.kidAges}
                    onChange={(e) => update({ kidAges: e.target.value })}
                    className="w-full rounded-[8px] border border-border bg-surface px-4 py-3 h-12 text-text placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent/30 text-[16px]"
                  />
                </div>
              )}

              <div className="flex items-center justify-between border border-border p-4">
                <label className="text-sm text-text">
                  Aging parents to consider?
                </label>
                <button
                  type="button"
                  onClick={() =>
                    update({ agingParents: !data.agingParents })
                  }
                  className={`w-12 h-6 transition-colors ${
                    data.agingParents ? "bg-accent" : "bg-border"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white transition-transform ${
                      data.agingParents
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between border border-border p-4">
                <label className="text-sm text-text">
                  Health considerations that affect location?
                </label>
                <button
                  type="button"
                  onClick={() =>
                    update({
                      healthConsiderations: !data.healthConsiderations,
                    })
                  }
                  className={`w-12 h-6 transition-colors ${
                    data.healthConsiderations ? "bg-accent" : "bg-border"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white transition-transform ${
                      data.healthConsiderations
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {data.healthConsiderations && (
                <div>
                  <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
                    Health details (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. need access to specialist care, climate-sensitive condition"
                    value={data.healthDetails}
                    onChange={(e) =>
                      update({ healthDetails: e.target.value })
                    }
                    className="w-full rounded-[8px] border border-border bg-surface px-4 py-3 h-12 text-text placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent/30 text-[16px]"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Priorities */}
        {step === 3 && (
          <div className="animate-fade-in">
            <p className="font-mono text-xs text-text-secondary mb-6">
              &bull; encore-os / assess
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-text mb-2">
              What matters most
            </h2>
            <p className="text-text-secondary mb-10">
              Give weight to the things that would make a new place feel like
              a real upgrade. Select at least 3.
            </p>

            <div className="space-y-3">
              {PRIORITIES.map((p) => (
                <div
                  key={p}
                  className="flex flex-col gap-3 border border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <span className="text-sm text-text flex-1">{p}</span>
                  <div className="grid grid-cols-5 gap-2 sm:flex sm:gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => updatePriority(p, n)}
                        className={`h-11 w-full text-xs font-medium transition-all sm:h-8 sm:w-8 ${
                          data.priorities[p] === n
                            ? "bg-accent text-white"
                            : data.priorities[p] && data.priorities[p] >= n
                            ? "bg-accent/10 text-text"
                            : "bg-bg-subtle text-text-secondary hover:bg-border"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="font-mono text-text-secondary text-xs mt-4">
              {Object.keys(data.priorities).length} of 3 minimum selected
            </p>
          </div>
        )}

        {/* Step 4: Openness to change */}
        {step === 4 && (
          <div className="animate-fade-in">
            <p className="font-mono text-xs text-text-secondary mb-6">
              &bull; encore-os / assess
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-text mb-2">
              Openness to change
            </h2>
            <p className="text-text-secondary mb-10">
              How far are you willing to go, literally and figuratively?
            </p>

            <div className="space-y-8">
              <div>
                <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
                  Geographic range
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {GEO_RANGES.map((g) => (
                    <OptionButton
                      key={g}
                      label={g}
                      selected={data.geographicRange === g}
                      onClick={() => update({ geographicRange: g })}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
                  Citizenship / passports
                </label>
                <input
                  type="text"
                  placeholder="e.g. US, Mexico, Italy"
                  value={data.citizenships}
                  onChange={(e) => update({ citizenships: e.target.value })}
                  className="w-full rounded-[8px] border border-border bg-surface px-4 py-3 h-12 text-text placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent/30 text-[16px]"
                />
                <p className="mt-2 text-xs leading-5 text-text-secondary">
                  This helps us think about visas, residency, and realistic
                  move paths.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
                    Tax residency
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. United States, Spain"
                    value={data.taxResidency}
                    onChange={(e) => update({ taxResidency: e.target.value })}
                    className="w-full rounded-[8px] border border-border bg-surface px-4 py-3 h-12 text-text placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent/30 text-[16px]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
                    Languages
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. English, Spanish, Portuguese"
                    value={data.languages}
                    onChange={(e) => update({ languages: e.target.value })}
                    className="w-full rounded-[8px] border border-border bg-surface px-4 py-3 h-12 text-text placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent/30 text-[16px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
                  Urban preference
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {URBAN_PREFS.map((u) => (
                    <OptionButton
                      key={u}
                      label={u}
                      selected={data.urbanPreference === u}
                      onClick={() => update({ urbanPreference: u })}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
                  Timeline
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {TIMELINES.map((t) => (
                    <OptionButton
                      key={t}
                      label={t}
                      selected={data.timeline === t}
                      onClick={() => update({ timeline: t })}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
                  Biggest fear about moving (optional)
                </label>
                <textarea
                  placeholder="e.g. leaving my support network, kids changing schools..."
                  value={data.biggestFear}
                  onChange={(e) => update({ biggestFear: e.target.value })}
                  rows={3}
                  className="w-full rounded-[8px] border border-border bg-surface px-4 py-3 text-text placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none text-[16px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Work and opportunity */}
        {step === 5 && (
          <div className="animate-fade-in">
            <p className="font-mono text-xs text-text-secondary mb-6">
              &bull; encore-os / assess
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-text mb-2">
              Work and opportunity
            </h2>
            <p className="text-text-secondary mb-10">
              Optional but powerful. This helps us spot places where your work
              life has room to expand.
            </p>

            <div className="space-y-8">
              <div>
                <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
                  Current job / field
                </label>
                <input
                  type="text"
                  placeholder="e.g. Marketing manager, Software engineer, Nurse"
                  value={data.currentJob}
                  onChange={(e) => update({ currentJob: e.target.value })}
                  className="w-full rounded-[8px] border border-border bg-surface px-4 py-3 h-12 text-text placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent/30 text-[16px]"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
                  How much do you want to protect income from automation or
                  market change?
                </label>
                <div className="grid gap-2 sm:flex sm:items-center sm:gap-4">
                  <span className="text-xs text-text-secondary">Not at all</span>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={data.aiWorryLevel}
                    onChange={(e) =>
                      update({ aiWorryLevel: Number(e.target.value) })
                    }
                    className="w-full sm:flex-1"
                  />
                  <span className="text-xs text-text-secondary">Very worried</span>
                </div>
                <div className="text-center font-mono text-sm text-text mt-1">
                  {data.aiWorryLevel} / 5
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
                  What are you looking for?
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <OptionButton
                    label="A place to weather uncertainty, with stability and lower cost"
                    selected={data.aiOutlook === "weather"}
                    onClick={() => update({ aiOutlook: "weather" })}
                  />
                  <OptionButton
                    label="A place to position for opportunity, with growth and innovation"
                    selected={data.aiOutlook === "opportunity"}
                    onClick={() => update({ aiOutlook: "opportunity" })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        {error && (
          <div className="mt-6 p-4 border border-red-300 bg-red-50 text-red-800 text-sm">
            {error}
          </div>
        )}

        <div
          className={`mt-12 flex items-center justify-between border-t border-border ${
            keepMobileNavSticky
              ? "sticky bottom-0 z-20 -mx-5 bg-bg/95 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur sm:-mx-6 sm:px-6 md:static md:mx-0 md:bg-transparent md:px-0 md:pb-0 md:pt-6 md:backdrop-blur-none"
              : "pt-6"
          }`}
        >
          <button
            type="button"
            onClick={goBack}
            className={`text-sm text-text-secondary hover:text-text transition-colors ${
              step === 1 ? "invisible" : ""
            }`}
          >
            Previous
          </button>

          {step < 5 ? (
            <button
              type="button"
              disabled={!readyForNext}
              onClick={goNext}
              className={`rounded-[8px] px-6 py-3 text-sm font-medium transition-all ${
                readyForNext
                  ? "bg-accent text-white shadow-soft hover:bg-accent-dark"
                  : "bg-border text-text-secondary cursor-not-allowed"
              }`}
            >
              Next step
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-[8px] bg-accent px-8 py-3 text-sm font-bold text-white shadow-soft transition-all hover:bg-accent-dark"
            >
              Show my paths
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
