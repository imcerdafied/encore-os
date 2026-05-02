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
      className={`rounded-[8px] border px-4 py-3 text-left text-sm font-medium transition-all ${
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

  const progressWidth = `${(step / 5) * 100}%`;

  if (loading) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-12 h-12 border-2 border-border border-t-text rounded-full animate-spin mx-auto mb-8" />
          <h2 className="text-2xl font-black text-text mb-3">
            Finding your next chapter
          </h2>
          <p className="text-text-secondary text-sm mb-8">
            Analyzing 847 factors for your situation...
          </p>
          <div className="w-full bg-bg-subtle h-1 overflow-hidden rounded-full">
            <div className="h-full bg-accent loading-bar" />
          </div>
          <div className="mt-8 text-text-secondary text-xs">
            <p className="animate-pulse">Evaluating cost of living data...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg">
      {/* Progress bar */}
      <div className="h-1 bg-border">
        <div
          className="h-full bg-accent transition-all duration-500"
          style={{ width: progressWidth }}
        />
      </div>

      <nav className="flex items-center justify-between px-6 py-5 max-w-3xl mx-auto">
        <Link href="/" className="font-mono text-sm text-text">
          encore-os
        </Link>
        <span className="rounded-[8px] bg-surface px-3 py-1 font-mono text-xs text-text-secondary">
          Step {step} of 5
        </span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
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
              Tell us about your current situation so we can find somewhere
              better.
            </p>

            <div className="space-y-8">
              <div>
                <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
                  Current city / country
                </label>
                <input
                  type="text"
                  placeholder="e.g. Austin, TX or London, UK"
                  value={data.currentCity}
                  onChange={(e) => update({ currentCity: e.target.value })}
                  className="w-full rounded-[8px] border border-border bg-surface px-4 py-3 h-12 text-text placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent/30 text-[16px]"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
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
                  <span className="font-mono text-sm text-text w-24 text-right">
                    ${data.monthlyIncome.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
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
                  <span className="font-mono text-sm text-text w-24 text-right">
                    ${data.monthlyExpenses.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
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
                <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
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
                  <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
                    Children&apos;s ages
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
              Rate each factor from 1 (not important) to 5 (essential). Select
              at least 3.
            </p>

            <div className="space-y-3">
              {PRIORITIES.map((p) => (
                <div
                  key={p}
                  className="border border-border p-4 flex items-center justify-between gap-4"
                >
                  <span className="text-sm text-text flex-1">{p}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => updatePriority(p, n)}
                        className={`w-8 h-8 text-xs font-medium transition-all ${
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
              How far are you willing to go &mdash; literally and figuratively?
            </p>

            <div className="space-y-8">
              <div>
                <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
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
                <label className="block font-mono text-xs text-text-secondary uppercase mb-3">
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

        {/* Step 5: AI angle */}
        {step === 5 && (
          <div className="animate-fade-in">
            <p className="font-mono text-xs text-text-secondary mb-6">
              &bull; encore-os / assess
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-text mb-2">
              The AI angle
            </h2>
            <p className="text-text-secondary mb-10">
              Optional but powerful &mdash; helps us factor in economic resilience.
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
                  How worried are you about AI affecting your income?
                </label>
                <div className="flex items-center gap-4">
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
                    className="flex-1"
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
          <div className="mt-6 p-4 border border-red-300 bg-red-50 text-red-800 text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className={`text-sm text-text-secondary hover:text-text transition-colors ${
              step === 1 ? "invisible" : ""
            }`}
          >
            &larr; Back
          </button>

          {step < 5 ? (
            <button
              type="button"
              disabled={!canNext()}
              onClick={() => setStep((s) => s + 1)}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                canNext()
                  ? "bg-accent text-white hover:bg-night"
                  : "bg-border text-text-secondary cursor-not-allowed"
              }`}
            >
              Continue &rarr;
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-[8px] px-8 py-3 text-sm font-medium bg-accent text-white hover:bg-night transition-all"
            >
              Find My Next Chapter &rarr;
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
