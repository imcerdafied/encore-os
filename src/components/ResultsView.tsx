"use client";

import { useState } from "react";
import { Recommendation, AssessmentResult } from "@/lib/types";
import Link from "next/link";

function AiScoreGauge({ score }: { score: number }) {
  const color =
    score >= 7 ? "text-green-400" : score >= 4 ? "text-yellow-400" : "text-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-4 rounded-sm ${
              i < score ? (score >= 7 ? "bg-green-400" : score >= 4 ? "bg-yellow-400" : "bg-red-400") : "bg-navy-light"
            }`}
          />
        ))}
      </div>
      <span className={`text-sm font-medium ${color}`}>{score}/10</span>
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
      className="bg-navy border border-navy-light rounded-2xl overflow-hidden animate-slide-up"
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: "both" }}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-medium px-3 py-1 bg-gold/10 text-gold rounded-full">
            {archetypeLabel[rec.archetype] || rec.archetype}
          </span>
          <button
            onClick={handleShare}
            className="text-xs text-slate hover:text-cream transition-colors"
          >
            {copied ? "Copied!" : "Share"}
          </button>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{rec.flag}</span>
          <div>
            <h3 className="font-display text-2xl text-cream">{rec.city}</h3>
            <p className="text-slate text-sm">{rec.country}</p>
          </div>
        </div>

        <p className="text-slate text-sm italic mb-4">{rec.descriptor}</p>

        {/* Cost badge */}
        <div
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            rec.costPercent <= 0
              ? "bg-green-900/30 text-green-400"
              : "bg-red-900/30 text-red-400"
          }`}
        >
          {rec.costComparison}
        </div>
      </div>

      {/* Headline */}
      <div className="px-6 pb-4">
        <p className="text-cream leading-relaxed">{rec.headline}</p>
      </div>

      {/* AI Resilience */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate uppercase tracking-wider">
            AI Economy Resilience
          </span>
        </div>
        <AiScoreGauge score={rec.aiResilienceScore} />
        <p className="text-slate text-xs mt-1">{rec.aiResilienceReason}</p>
      </div>

      {/* Reasons */}
      <div className="px-6 pb-4">
        <h4 className="text-sm font-medium text-gold mb-3">
          Why this fits you
        </h4>
        <ul className="space-y-2">
          {rec.reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-cream/80">
              <span className="text-gold mt-0.5 flex-shrink-0">+</span>
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Tradeoffs (collapsible) */}
      <div className="px-6 pb-2">
        <button
          onClick={() => setShowTradeoffs(!showTradeoffs)}
          className="text-sm text-slate hover:text-cream transition-colors flex items-center gap-1"
        >
          <span className={`transition-transform ${showTradeoffs ? "rotate-90" : ""}`}>
            ›
          </span>
          Honest tradeoffs
        </button>
        {showTradeoffs && (
          <ul className="mt-3 space-y-2 animate-fade-in">
            {rec.tradeoffs.map((t, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-cream/60"
              >
                <span className="text-red-400/70 mt-0.5 flex-shrink-0">-</span>
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Next steps (collapsible) */}
      <div className="px-6 pb-6">
        <button
          onClick={() => setShowSteps(!showSteps)}
          className="text-sm text-slate hover:text-cream transition-colors flex items-center gap-1"
        >
          <span className={`transition-transform ${showSteps ? "rotate-90" : ""}`}>
            ›
          </span>
          Practical next steps
        </button>
        {showSteps && (
          <ol className="mt-3 space-y-2 animate-fade-in">
            {rec.nextSteps.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-cream/70"
              >
                <span className="text-gold/70 mt-0.5 flex-shrink-0 font-medium">
                  {i + 1}.
                </span>
                {s}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export default function ResultsView({ result }: { result: AssessmentResult }) {
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
    <main className="min-h-screen bg-navy-dark">
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <Link href="/" className="font-display text-xl font-bold text-cream">
          Encore<span className="text-gold">OS</span>
        </Link>
        <Link
          href="/assess"
          className="text-sm text-gold hover:text-gold-light transition-colors"
        >
          Retake Assessment
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-cream mb-3">
            Your next chapter
          </h1>
          <p className="text-slate">
            4 personalized recommendations based on your life situation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {result.recommendations.map((rec, i) => (
            <RecommendationCard key={i} rec={rec} index={i} />
          ))}
        </div>

        {/* Email capture */}
        <div className="mt-16 max-w-lg mx-auto text-center">
          {!emailSent ? (
            <>
              <h3 className="font-display text-xl text-cream mb-2">
                Save your results
              </h3>
              <p className="text-slate text-sm mb-4">
                Get updates as the world changes — new cities, new
                opportunities.
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-navy-light border border-navy-light rounded-lg px-4 py-3 text-cream placeholder:text-slate/50 focus:outline-none focus:border-gold transition-colors"
                />
                <button
                  onClick={handleEmailCapture}
                  disabled={emailLoading || !email.includes("@")}
                  className="px-6 py-3 bg-gold text-navy-dark font-medium rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50"
                >
                  {emailLoading ? "..." : "Save"}
                </button>
              </div>
            </>
          ) : (
            <div className="bg-navy/50 border border-gold/20 rounded-xl p-6">
              <p className="text-gold font-medium">Results saved!</p>
              <p className="text-slate text-sm mt-1">
                We&apos;ll keep you updated as opportunities evolve.
              </p>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <p className="text-center text-slate/50 text-xs mt-12 max-w-lg mx-auto">
          These recommendations are AI-generated based on your inputs. Do your
          own research before making major life decisions. Encore OS provides
          guidance, not guarantees.
        </p>
      </div>
    </main>
  );
}
