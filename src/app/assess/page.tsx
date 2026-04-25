"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AssessmentData, defaultAssessment } from "@/lib/types";
import Link from "next/link";

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

const SAVINGS_RANGES = [
  "Less than $50k",
  "$50k – $150k",
  "$150k – $500k",
  "$500k – $1M",
  "$1M+",
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
  "Partner + kids",
  "Single parent",
  "Empty nester",
  "Retired couple",
];

const GEO_RANGES = [
  "US only",
  "US + Canada/Mexico",
  "Americas",
  "Europe open",
  "Asia/Pacific open",
  "Anywhere",
];

const URBAN_PREFS = ["Major city", "Mid-size city", "Small town", "Rural / nature"];

const TIMELINES = [
  "Exploring ideas",
  "Seriously considering (1-2 years)",
  "Actively planning (next 6 months)",
];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              i + 1 === current
                ? "bg-gold text-navy-dark"
                : i + 1 < current
                ? "bg-gold/30 text-gold"
                : "bg-navy-light text-slate"
            }`}
          >
            {i + 1 < current ? "✓" : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`w-8 h-0.5 ${
                i + 1 < current ? "bg-gold/30" : "bg-navy-light"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
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
      className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all text-left ${
        selected
          ? "bg-gold/10 border-gold text-gold"
          : "bg-navy-light/50 border-navy-light text-cream hover:border-slate"
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
        return data.currentCity && data.savingsRange && data.workSituation;
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

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
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
      sessionStorage.setItem(`result-${result.id}`, JSON.stringify(result));
      router.push(`/results?id=${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-navy-dark flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 border-4 border-navy-light border-t-gold rounded-full animate-spin mx-auto mb-8" />
          <h2 className="font-display text-2xl text-cream mb-3">
            Finding your next chapter
          </h2>
          <p className="text-slate text-sm mb-8">
            Analyzing 847 factors for your situation...
          </p>
          <div className="w-full bg-navy-light rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-gold rounded-full loading-bar" />
          </div>
          <div className="mt-8 space-y-3 text-slate text-xs">
            <p className="animate-pulse">Evaluating cost of living data...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-navy-dark">
      <nav className="flex items-center justify-between px-6 py-5 max-w-3xl mx-auto">
        <Link href="/" className="font-display text-xl font-bold text-cream">
          Encore<span className="text-gold">OS</span>
        </Link>
        <span className="text-sm text-slate">
          Step {step} of 5
        </span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <StepIndicator current={step} total={5} />

        {/* Step 1: Where you are now */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="font-display text-3xl text-cream mb-2">
              Where you are now
            </h2>
            <p className="text-slate mb-8">
              Tell us about your current situation so we can find somewhere
              better.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-cream mb-2">
                  Current city / country
                </label>
                <input
                  type="text"
                  placeholder="e.g. Austin, TX or London, UK"
                  value={data.currentCity}
                  onChange={(e) => update({ currentCity: e.target.value })}
                  className="w-full bg-navy-light border border-navy-light rounded-lg px-4 py-3 text-cream placeholder:text-slate/50 focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-cream mb-2">
                  Monthly take-home income (USD)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={1000}
                    max={30000}
                    step={500}
                    value={data.monthlyIncome}
                    onChange={(e) =>
                      update({ monthlyIncome: Number(e.target.value) })
                    }
                    className="flex-1"
                  />
                  <span className="text-gold font-medium w-24 text-right">
                    ${data.monthlyIncome.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-cream mb-2">
                  Monthly expenses / rent (USD)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={500}
                    max={20000}
                    step={500}
                    value={data.monthlyExpenses}
                    onChange={(e) =>
                      update({ monthlyExpenses: Number(e.target.value) })
                    }
                    className="flex-1"
                  />
                  <span className="text-gold font-medium w-24 text-right">
                    ${data.monthlyExpenses.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-cream mb-3">
                  Net worth / savings range
                </label>
                <div className="grid grid-cols-2 gap-3">
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
                <label className="block text-sm text-cream mb-3">
                  Work situation
                </label>
                <div className="grid grid-cols-2 gap-3">
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
            <h2 className="font-display text-3xl text-cream mb-2">
              Life situation
            </h2>
            <p className="text-slate mb-8">
              Your household shapes what matters in a location.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-cream mb-3">
                  Household
                </label>
                <div className="grid grid-cols-2 gap-3">
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

              {(data.household === "Partner + kids" ||
                data.household === "Single parent") && (
                <div>
                  <label className="block text-sm text-cream mb-2">
                    Children&apos;s ages
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4, 7, 12"
                    value={data.kidAges}
                    onChange={(e) => update({ kidAges: e.target.value })}
                    className="w-full bg-navy-light border border-navy-light rounded-lg px-4 py-3 text-cream placeholder:text-slate/50 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              )}

              <div className="flex items-center justify-between bg-navy-light/50 rounded-lg p-4">
                <label className="text-sm text-cream">
                  Aging parents to consider?
                </label>
                <button
                  type="button"
                  onClick={() =>
                    update({ agingParents: !data.agingParents })
                  }
                  className={`w-12 h-6 rounded-full transition-colors ${
                    data.agingParents ? "bg-gold" : "bg-navy-light"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-cream rounded-full transition-transform ${
                      data.agingParents
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between bg-navy-light/50 rounded-lg p-4">
                <label className="text-sm text-cream">
                  Health considerations that affect location?
                </label>
                <button
                  type="button"
                  onClick={() =>
                    update({
                      healthConsiderations: !data.healthConsiderations,
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-colors ${
                    data.healthConsiderations ? "bg-gold" : "bg-navy-light"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-cream rounded-full transition-transform ${
                      data.healthConsiderations
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {data.healthConsiderations && (
                <div>
                  <label className="block text-sm text-cream mb-2">
                    Health details (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. need access to specialist care, climate-sensitive condition"
                    value={data.healthDetails}
                    onChange={(e) =>
                      update({ healthDetails: e.target.value })
                    }
                    className="w-full bg-navy-light border border-navy-light rounded-lg px-4 py-3 text-cream placeholder:text-slate/50 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Priorities */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="font-display text-3xl text-cream mb-2">
              What matters most
            </h2>
            <p className="text-slate mb-8">
              Rate each factor from 1 (not important) to 5 (essential). Select
              at least 3.
            </p>

            <div className="space-y-4">
              {PRIORITIES.map((p) => (
                <div
                  key={p}
                  className="bg-navy-light/50 rounded-lg p-4 flex items-center justify-between gap-4"
                >
                  <span className="text-sm text-cream flex-1">{p}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => updatePriority(p, n)}
                        className={`w-8 h-8 rounded text-xs font-medium transition-all ${
                          data.priorities[p] === n
                            ? "bg-gold text-navy-dark"
                            : data.priorities[p] && data.priorities[p] >= n
                            ? "bg-gold/20 text-gold"
                            : "bg-navy-light text-slate hover:text-cream"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-slate text-xs mt-4">
              {Object.keys(data.priorities).length} of 3 minimum selected
            </p>
          </div>
        )}

        {/* Step 4: Openness to change */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h2 className="font-display text-3xl text-cream mb-2">
              Openness to change
            </h2>
            <p className="text-slate mb-8">
              How far are you willing to go — literally and figuratively?
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-cream mb-3">
                  Geographic range
                </label>
                <div className="grid grid-cols-2 gap-3">
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
                <label className="block text-sm text-cream mb-3">
                  Urban preference
                </label>
                <div className="grid grid-cols-2 gap-3">
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
                <label className="block text-sm text-cream mb-3">
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
                <label className="block text-sm text-cream mb-2">
                  Biggest fear about moving (optional)
                </label>
                <textarea
                  placeholder="e.g. leaving my support network, kids changing schools..."
                  value={data.biggestFear}
                  onChange={(e) => update({ biggestFear: e.target.value })}
                  rows={3}
                  className="w-full bg-navy-light border border-navy-light rounded-lg px-4 py-3 text-cream placeholder:text-slate/50 focus:outline-none focus:border-gold transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: AI angle */}
        {step === 5 && (
          <div className="animate-fade-in">
            <h2 className="font-display text-3xl text-cream mb-2">
              The AI angle
            </h2>
            <p className="text-slate mb-8">
              Optional but powerful — helps us factor in economic resilience.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-cream mb-2">
                  Current job / field
                </label>
                <input
                  type="text"
                  placeholder="e.g. Marketing manager, Software engineer, Nurse"
                  value={data.currentJob}
                  onChange={(e) => update({ currentJob: e.target.value })}
                  className="w-full bg-navy-light border border-navy-light rounded-lg px-4 py-3 text-cream placeholder:text-slate/50 focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-cream mb-3">
                  How worried are you about AI affecting your income?
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate">Not at all</span>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={data.aiWorryLevel}
                    onChange={(e) =>
                      update({ aiWorryLevel: Number(e.target.value) })
                    }
                    className="flex-1"
                  />
                  <span className="text-xs text-slate">Very worried</span>
                </div>
                <div className="text-center text-gold text-sm mt-1">
                  {data.aiWorryLevel} / 5
                </div>
              </div>

              <div>
                <label className="block text-sm text-cream mb-3">
                  What are you looking for?
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <OptionButton
                    label="A place to weather uncertainty — stability and low cost"
                    selected={data.aiOutlook === "weather"}
                    onClick={() => update({ aiOutlook: "weather" })}
                  />
                  <OptionButton
                    label="A place to position for opportunity — growth and innovation"
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
          <div className="mt-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mt-10 pt-6 border-t border-navy-light">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className={`text-sm text-slate hover:text-cream transition-colors ${
              step === 1 ? "invisible" : ""
            }`}
          >
            ← Back
          </button>

          {step < 5 ? (
            <button
              type="button"
              disabled={!canNext()}
              onClick={() => setStep((s) => s + 1)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                canNext()
                  ? "bg-gold text-navy-dark hover:bg-gold-light"
                  : "bg-navy-light text-slate cursor-not-allowed"
              }`}
            >
              Continue →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-8 py-3 rounded-lg text-sm font-medium bg-gold text-navy-dark hover:bg-gold-light transition-all"
            >
              Find My Next Chapter →
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
