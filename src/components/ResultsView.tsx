"use client";

import { useState } from "react";
import { Recommendation, AssessmentResult } from "@/lib/types";
import Link from "next/link";

function AiScoreGauge({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-4 ${
              i < score
                ? score >= 7
                  ? "bg-text"
                  : score >= 4
                  ? "bg-text-secondary"
                  : "bg-text-secondary/50"
                : "bg-border"
            }`}
          />
        ))}
      </div>
      <span className="font-mono text-sm text-text">{score}/10</span>
    </div>
  );
}

function RecommendationCard({
  rec,
  index,
  locked,
}: {
  rec: Recommendation;
  index: number;
  locked?: boolean;
}) {
  const [showTradeoffs, setShowTradeoffs] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [copied, setCopied] = useState(false);

  const archetypeLabel: Record<string, string> = {
    "safe-move": "Safe Easy Move",
    adventurous: "Adventurous but Realistic",
    "sleeper-pick": "Surprising Sleeper Pick",
    wildcard: "The Wildcard",
  };

  const handleShare = () => {
    const text = `${rec.flag} ${rec.city}, ${rec.country} — ${rec.headline}\n${rec.costComparison}\nAI Resilience: ${rec.aiResilienceScore}/10\n\nFound with Encore OS`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="border border-border overflow-hidden animate-slide-up relative"
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: "both" }}
    >
      {/* Header — city name always visible */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <span className="font-mono text-xs text-text-secondary">
            {archetypeLabel[rec.archetype] || rec.archetype}
          </span>
          {!locked && (
            <button
              onClick={handleShare}
              className="text-xs text-text-secondary hover:text-text transition-colors"
            >
              {copied ? "Copied!" : "Share"}
            </button>
          )}
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <h3 className="text-2xl font-black text-text">{rec.city}</h3>
        </div>
        <p className="text-text-secondary text-sm">
          {rec.flag} {rec.country}
        </p>
      </div>

      {/* Blurred content for locked cards */}
      {locked ? (
        <div className="relative">
          <div className="px-6 pb-6 filter blur-[6px] select-none pointer-events-none" aria-hidden="true">
            <div className="border-t border-border pt-4">
              <p className="text-text-secondary text-sm italic mb-4">{rec.descriptor}</p>
              <p className="font-mono text-sm text-text mb-4">{rec.costComparison}</p>
              <p className="text-text leading-relaxed">{rec.headline}</p>
              <div className="mt-4">
                <span className="font-mono text-xs text-text-secondary uppercase tracking-wider">AI Economy Resilience</span>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className={`w-2 h-4 ${i < 7 ? "bg-text" : "bg-border"}`} />
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-text mb-2">Why this fits you</h4>
                <div className="h-3 bg-border w-3/4 mb-2" />
                <div className="h-3 bg-border w-2/3 mb-2" />
                <div className="h-3 bg-border w-1/2" />
              </div>
            </div>
          </div>
          {/* Lock overlay */}
          <div className="absolute inset-0 top-0 flex items-center justify-center bg-white/60">
            <div className="text-center">
              <svg className="w-6 h-6 text-text/40 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-text text-sm font-medium">Unlock with Encore Pro &mdash; $29</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Full card content (unlocked) */}
          <div className="border-t border-border mx-6" />

          <div className="px-6 py-4">
            <p className="text-text-secondary text-sm italic mb-4">{rec.descriptor}</p>
            <p className="font-mono text-sm text-text">
              {rec.costComparison}
            </p>
          </div>

          <div className="px-6 pb-4">
            <p className="text-text leading-[1.7]">{rec.headline}</p>
          </div>

          <div className="px-6 pb-4">
            <span className="font-mono text-xs text-text-secondary uppercase tracking-wider">
              AI Economy Resilience
            </span>
            <div className="mt-1">
              <AiScoreGauge score={rec.aiResilienceScore} />
            </div>
            <p className="text-text-secondary text-xs mt-1">{rec.aiResilienceReason}</p>
          </div>

          <div className="px-6 pb-4">
            <h4 className="text-sm font-semibold text-text mb-3">Why this fits you</h4>
            <ul className="space-y-2">
              {rec.reasons.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-text mt-0.5 flex-shrink-0">+</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="px-6 pb-2">
            <button
              onClick={() => setShowTradeoffs(!showTradeoffs)}
              className="text-sm text-text-secondary hover:text-text transition-colors flex items-center gap-1"
            >
              <span className={`transition-transform inline-block ${showTradeoffs ? "rotate-90" : ""}`}>&rsaquo;</span>
              Honest tradeoffs
            </button>
            {showTradeoffs && (
              <ul className="mt-3 space-y-2 animate-fade-in border-t border-border pt-3">
                {rec.tradeoffs.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="text-text/40 mt-0.5 flex-shrink-0">&ndash;</span>
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="px-6 pb-6">
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="text-sm text-text-secondary hover:text-text transition-colors flex items-center gap-1"
            >
              <span className={`transition-transform inline-block ${showSteps ? "rotate-90" : ""}`}>&rsaquo;</span>
              Practical next steps
            </button>
            {showSteps && (
              <ol className="mt-3 space-y-2 animate-fade-in border-t border-border pt-3">
                {rec.nextSteps.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="font-mono text-text mt-0.5 flex-shrink-0 text-xs">{i + 1}.</span>
                    {s}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function UpgradeCTA({ onUnlock, loading }: { onUnlock: () => void; loading: boolean }) {
  return (
    <div className="mt-16 max-w-[680px] mx-auto">
      <div className="border border-text p-8 md:p-12 text-center">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-text mb-3">
          See all 4 recommendations
        </h2>
        <p className="text-text-secondary max-w-lg mx-auto mb-6 leading-[1.7]">
          Your full analysis includes a surprising sleeper pick and a wildcard
          destination personalized to your situation.
        </p>
        <p className="font-mono text-2xl text-text font-bold mb-6">
          $29 one-time &mdash; no subscription
        </p>
        <ul className="text-left max-w-sm mx-auto space-y-3 mb-8">
          <li className="flex items-start gap-2 text-text">
            <span className="text-accent flex-shrink-0">&check;</span>
            All 4 personalized recommendations
          </li>
          <li className="flex items-start gap-2 text-text">
            <span className="text-accent flex-shrink-0">&check;</span>
            Deep-dive city reports with neighborhoods &amp; visa paths
          </li>
          <li className="flex items-start gap-2 text-text">
            <span className="text-accent flex-shrink-0">&check;</span>
            Unlimited reassessments as your life changes
          </li>
        </ul>
        <button
          onClick={onUnlock}
          disabled={loading}
          className="inline-block bg-text text-white font-medium text-sm px-10 py-4 hover:bg-black transition-all disabled:opacity-50"
        >
          {loading ? "Redirecting..." : "Unlock All Recommendations \u2192"}
        </button>
        <p className="text-text-secondary/60 text-xs mt-4">
          Secure payment via Stripe. Instant access.
        </p>
      </div>
    </div>
  );
}

export default function ResultsView({
  result,
  isPaid,
  onUnlock,
  unlockLoading,
}: {
  result: AssessmentResult;
  isPaid: boolean;
  onUnlock: () => void;
  unlockLoading: boolean;
}) {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

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
      // silently fail
    }
    setEmailLoading(false);
  };

  return (
    <main className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto border-b border-border">
        <Link href="/" className="font-mono text-sm text-text tracking-tight">
          encore-os
        </Link>
        <div className="flex items-center gap-4">
          {isPaid && (
            <span className="font-mono text-xs px-2 py-0.5 bg-text text-white">
              pro
            </span>
          )}
          <Link
            href="/assess"
            className="text-sm text-text-secondary hover:text-text transition-colors"
          >
            {isPaid ? "Reassess" : "Retake Assessment"}
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="max-w-[680px] mb-12">
          <p className="font-mono text-xs text-text-secondary tracking-wide mb-6">
            &bull; encore-os / your results
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text mb-3">
            {isPaid ? "Your next four chapters." : "Your next chapter."}
          </h1>
          <p className="text-text-secondary leading-[1.7]">
            {isPaid
              ? "4 personalized recommendations based on your life situation"
              : "Your top recommendation \u2014 unlock all 4 with Encore Pro"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {result.recommendations.map((rec, i) => (
            <RecommendationCard
              key={i}
              rec={rec}
              index={i}
              locked={!isPaid && i > 0}
            />
          ))}
        </div>

        {/* Upgrade CTA for free users */}
        {!isPaid && (
          <UpgradeCTA onUnlock={onUnlock} loading={unlockLoading} />
        )}

        {/* Email capture */}
        <div className="mt-16 max-w-[480px] mx-auto text-center">
          {!emailSent ? (
            <>
              <h3 className="text-xl font-black text-text mb-2">
                Save your results
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                Get updates as the world changes &mdash; new cities, new opportunities.
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 border border-text bg-white px-4 py-3 text-text placeholder:text-text-secondary/40 focus:outline-none focus:ring-1 focus:ring-text text-[16px]"
                />
                <button
                  onClick={handleEmailCapture}
                  disabled={emailLoading || !email.includes("@")}
                  className="px-6 py-3 bg-text text-white font-medium hover:bg-black transition-colors disabled:opacity-50 text-sm"
                >
                  {emailLoading ? "..." : "Save"}
                </button>
              </div>
            </>
          ) : (
            <div className="border border-border p-6">
              <p className="text-text font-medium">Results saved!</p>
              <p className="text-text-secondary text-sm mt-1">
                We&apos;ll keep you updated as opportunities evolve.
              </p>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-text-secondary/50 text-xs mt-12 max-w-lg mx-auto">
          These recommendations are AI-generated based on your inputs. Do your
          own research before making major life decisions. Encore OS provides
          guidance, not guarantees.
        </p>
      </div>
    </main>
  );
}
