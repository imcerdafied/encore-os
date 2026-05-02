"use client";

import { useState } from "react";
import { Recommendation, AssessmentResult } from "@/lib/types";
import Link from "next/link";

const archetypeLabel: Record<string, string> = {
  "safe-move": "Safe move",
  adventurous: "Adventurous",
  "sleeper-pick": "Sleeper pick",
  wildcard: "Wildcard",
};

function AiScoreGauge({ score }: { score: number }) {
  const bounded = Math.max(0, Math.min(10, score));

  return (
    <div className="flex items-center gap-3">
      <div className="grid flex-1 grid-cols-10 gap-1">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full ${
              i < bounded ? "bg-teal" : "bg-border"
            }`}
          />
        ))}
      </div>
      <span className="font-mono text-sm text-text">{bounded}/10</span>
    </div>
  );
}

function RecommendationCard({
  rec,
  index,
}: {
  rec: Recommendation;
  index: number;
}) {
  const [showTradeoffs, setShowTradeoffs] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = `${rec.flag} ${rec.city}, ${rec.country} - ${rec.headline}\n${rec.costComparison}\nAI Resilience: ${rec.aiResilienceScore}/10\n\nFound with Encore OS`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article
      className="animate-slide-up overflow-hidden rounded-[8px] border border-border bg-surface shadow-soft"
      style={{ animationDelay: `${index * 120}ms`, animationFillMode: "both" }}
    >
      <div className="border-b border-border p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase text-accent">
              {archetypeLabel[rec.archetype] || rec.archetype}
            </p>
            <h3 className="mt-3 text-3xl font-black text-text">{rec.city}</h3>
            <p className="mt-1 text-sm text-text-secondary">
              {rec.flag} {rec.country}
            </p>
          </div>
          <button
            onClick={handleShare}
            className="rounded-[8px] border border-border px-3 py-2 text-xs font-semibold text-text-secondary transition hover:border-text hover:text-text"
          >
            {copied ? "Copied" : "Share"}
          </button>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <div>
          <p className="text-sm italic text-text-secondary">
            {rec.descriptor}
          </p>
          <p className="mt-3 inline-flex rounded-[8px] bg-bg-subtle px-3 py-2 font-mono text-sm text-text">
            {rec.costComparison}
          </p>
        </div>

        <p className="text-lg leading-8 text-text">{rec.headline}</p>

        <div className="rounded-[8px] border border-border bg-bg p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs uppercase text-text-secondary">
              AI economy resilience
            </span>
          </div>
          <AiScoreGauge score={rec.aiResilienceScore} />
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            {rec.aiResilienceReason}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-black text-text">Why this fits</h4>
          <ul className="mt-3 space-y-3">
            {rec.reasons.map((reason, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm leading-6 text-text-secondary"
              >
                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-teal" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => setShowTradeoffs(!showTradeoffs)}
            className="rounded-[8px] border border-border px-4 py-3 text-left text-sm font-semibold text-text transition hover:border-accent hover:bg-[#fff3df]"
          >
            {showTradeoffs ? "Hide tradeoffs" : "Honest tradeoffs"}
          </button>
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="rounded-[8px] border border-border px-4 py-3 text-left text-sm font-semibold text-text transition hover:border-teal hover:bg-bg-subtle"
          >
            {showSteps ? "Hide next steps" : "Practical next steps"}
          </button>
        </div>

        {showTradeoffs && (
          <ul className="animate-fade-in space-y-2 rounded-[8px] border border-border bg-bg p-4">
            {rec.tradeoffs.map((tradeoff, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm leading-6 text-text-secondary"
              >
                <span className="text-accent">-</span>
                {tradeoff}
              </li>
            ))}
          </ul>
        )}

        {showSteps && (
          <ol className="animate-fade-in space-y-2 rounded-[8px] border border-border bg-bg p-4">
            {rec.nextSteps.map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm leading-6 text-text-secondary"
              >
                <span className="font-mono text-xs text-teal">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        )}
      </div>
    </article>
  );
}

export default function ResultsView({
  result,
}: {
  result: AssessmentResult;
  isPaid: boolean;
  onUnlock: () => void;
  unlockLoading: boolean;
}) {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const totalRecommendations =
    result.totalRecommendations || result.recommendations.length;
  const visibleRecommendations = result.recommendations;

  const handleEmailCapture = async () => {
    if (!email.includes("@")) return;
    setEmailLoading(true);
    try {
      await fetch("/api/email-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, assessmentId: result.id }),
      });
      setEmailSent(true);
    } catch {
      // Keep the results page usable even if email capture fails.
    }
    setEmailLoading(false);
  };

  return (
    <main className="min-h-screen bg-bg text-text">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-mono text-sm text-text">
          encore-os
        </Link>
        <div className="flex items-center gap-3">
          <span className="rounded-[8px] bg-teal px-3 py-1 font-mono text-xs text-white">
            free beta
          </span>
          <Link
            href="/assess"
            className="rounded-[8px] border border-border px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-text hover:text-text"
          >
            Reassess
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <header className="mb-10 rounded-[8px] bg-night p-8 text-white shadow-soft md:p-10">
          <p className="font-mono text-xs uppercase text-gold">
            your relocation report
          </p>
          <div className="mt-5 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h1 className="text-4xl font-black md:text-6xl">
                Your next four chapters.
              </h1>
              <p className="mt-4 max-w-2xl leading-7 text-white/68">
                Limited beta access is active, so the full recommendation set is
                free right now. Compare all four paths before you decide what to
                investigate next.
              </p>
            </div>
            <div className="rounded-[8px] border border-white/14 bg-white/8 p-4">
              <p className="font-mono text-xs text-white/54">report depth</p>
              <p className="mt-2 text-3xl font-black">
                {visibleRecommendations.length}/{totalRecommendations}
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {visibleRecommendations.map((rec, i) => (
            <RecommendationCard key={`${rec.city}-${i}`} rec={rec} index={i} />
          ))}
        </div>

        <section className="mx-auto mt-16 max-w-xl rounded-[8px] border border-border bg-surface p-6 text-center shadow-soft">
          {!emailSent ? (
            <>
              <h3 className="text-2xl font-black text-text">
                Save your results
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                Get your report link and future city updates.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 flex-1 rounded-[8px] border border-border bg-white px-4 text-[16px] text-text placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
                <button
                  onClick={handleEmailCapture}
                  disabled={emailLoading || !email.includes("@")}
                  className="h-12 rounded-[8px] bg-text px-6 text-sm font-bold text-white transition hover:bg-night disabled:opacity-50"
                >
                  {emailLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </>
          ) : (
            <div>
              <p className="font-bold text-text">Results saved.</p>
              <p className="mt-1 text-sm text-text-secondary">
                We will keep you updated as opportunities evolve.
              </p>
            </div>
          )}
        </section>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-6 text-text-secondary">
          These recommendations are AI-generated from your inputs. Do your own
          research before making major life decisions. Encore OS provides
          guidance, not guarantees.
        </p>
      </div>
    </main>
  );
}
