"use client";

import { useEffect, useRef, useState } from "react";
import { Recommendation, AssessmentResult } from "@/lib/types";
import { identify, track } from "@/lib/analytics";
import {
  getRecommendationAnalyticsProperties,
  getResultAnalyticsProperties,
} from "@/lib/analytics-events";
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
  isPaid,
  onUnlock,
  unlockLoading,
  shareUrl,
}: {
  rec: Recommendation;
  index: number;
  isPaid: boolean;
  onUnlock: (recommendation: Recommendation, index: number) => void;
  unlockLoading: boolean;
  shareUrl: string;
}) {
  const [showTradeoffs, setShowTradeoffs] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "shared" | "copied">(
    "idle"
  );
  const recommendationAnalytics = getRecommendationAnalyticsProperties(
    rec,
    index
  );

  const resetShareState = (state: "shared" | "copied") => {
    setShareState(state);
    setTimeout(() => setShareState("idle"), 2000);
  };

  const handleShare = async () => {
    const text = `${rec.flag} ${rec.city}, ${rec.country}: ${rec.headline}\n${rec.costComparison}\nCareer resilience: ${rec.aiResilienceScore}/10`;
    const shareData = {
      title: `${rec.city}, ${rec.country} on EncoreOS`,
      text,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        track("recommendation_shared", {
          ...recommendationAnalytics,
          share_method: "native",
        });
        resetShareState("shared");
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          track("recommendation_share_cancelled", recommendationAnalytics);
          return;
        }
      }
    }

    await navigator.clipboard.writeText(`${text}\n\n${shareUrl}`);
    track("recommendation_shared", {
      ...recommendationAnalytics,
      share_method: "clipboard",
    });
    resetShareState("copied");
  };

  const handleUnlock = () => {
    track("path_deep_dive_clicked", recommendationAnalytics);
    onUnlock(rec, index);
  };

  const toggleTradeoffs = () => {
    const nextValue = !showTradeoffs;
    setShowTradeoffs(nextValue);
    if (nextValue) {
      track("path_tradeoffs_opened", recommendationAnalytics);
    }
  };

  const toggleNextSteps = () => {
    const nextValue = !showSteps;
    setShowSteps(nextValue);
    if (nextValue) {
      track("path_next_steps_opened", recommendationAnalytics);
    }
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
            {shareState === "shared"
              ? "Shared"
              : shareState === "copied"
              ? "Copied"
              : "Share"}
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
              Career resilience
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

        {isPaid ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={toggleTradeoffs}
              className="rounded-[8px] border border-border px-4 py-3 text-left text-sm font-semibold text-text transition hover:border-accent hover:bg-[#fff3df]"
            >
              {showTradeoffs ? "Hide tradeoffs" : "Honest tradeoffs"}
            </button>
            <button
              onClick={toggleNextSteps}
              className="rounded-[8px] border border-border px-4 py-3 text-left text-sm font-semibold text-text transition hover:border-teal hover:bg-bg-subtle"
            >
              {showSteps ? "Hide next steps" : "Practical next steps"}
            </button>
          </div>
        ) : (
          <button
            onClick={handleUnlock}
            disabled={unlockLoading}
            className="group w-full rounded-[8px] border border-accent/30 bg-[#fff3df] px-4 py-3 text-left text-sm font-bold text-text shadow-soft transition hover:border-accent hover:bg-accent hover:text-white disabled:opacity-60"
          >
            <span className="flex items-center justify-between gap-3">
              <span>
                {unlockLoading
                  ? "Checking availability..."
                  : "Go deeper on this path"}
              </span>
              <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[10px] uppercase text-white transition group-hover:bg-white/90 group-hover:text-accent">
                coming soon
              </span>
            </span>
            <span className="mt-1 block text-xs font-medium text-text-secondary transition group-hover:text-white/80">
              Tradeoffs, next steps, and local starting points.
            </span>
          </button>
        )}

        {isPaid && showTradeoffs && (
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

        {isPaid && showSteps && (
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
  isPaid,
  onUnlock,
  unlockLoading,
  checkoutNotice,
}: {
  result: AssessmentResult;
  isPaid: boolean;
  onUnlock: (recommendation: Recommendation, index: number) => void;
  unlockLoading: boolean;
  checkoutNotice?: string;
}) {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const totalRecommendations =
    result.totalRecommendations || result.recommendations.length;
  const visibleRecommendations = result.recommendations;
  const hasDeepDive = isPaid || Boolean(result.paid);
  const shareUrl =
    typeof window !== "undefined" && result.shareToken
      ? `${window.location.origin}/results?token=${result.shareToken}`
      : typeof window !== "undefined"
      ? window.location.href
      : "";
  const viewed = useRef(false);

  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;

    const properties = getResultAnalyticsProperties(result, hasDeepDive);
    identify(result.id, properties);
    track("results_viewed", properties);
  }, [hasDeepDive, result]);

  const handleEmailCapture = async () => {
    if (!email.includes("@")) return;
    setEmailLoading(true);
    try {
      await fetch("/api/email-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, assessmentId: result.id }),
      });
      track("results_saved", {
        assessment_id: result.id,
      });
      setEmailSent(true);
    } catch {
      track("results_save_failed", {
        assessment_id: result.id,
      });
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
          <span className="rounded-[8px] bg-accent px-3 py-1 font-mono text-xs text-white">
            scenario view
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
        <header className="mb-10 rounded-[8px] border border-accent/20 bg-[linear-gradient(135deg,#fff7e8_0%,#fffaf2_48%,#eaf7f4_100%)] p-8 text-text shadow-soft md:p-10">
          <p className="font-mono text-xs uppercase text-accent">
            your relocation report
          </p>
          <div className="mt-5 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h1 className="text-4xl font-black md:text-6xl">
                Your next chapter starts here.
              </h1>
              <p className="mt-4 max-w-2xl leading-7 text-text-secondary">
                Here are four possible paths from your profile. Browse the map
                for free, then go deeper on a path when you want the tradeoffs
                and next steps.
              </p>
            </div>
            <div className="rounded-[8px] border border-border bg-surface p-4">
              <p className="font-mono text-xs text-text-secondary">
                scenario paths
              </p>
              <p className="mt-2 text-3xl font-black">
                {visibleRecommendations.length}/{totalRecommendations}
              </p>
            </div>
          </div>
        </header>

        {checkoutNotice && (
          <div className="mb-6 rounded-[8px] border border-accent/25 bg-[#fff3df] p-4 text-sm font-semibold leading-6 text-text shadow-soft">
            {checkoutNotice}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {visibleRecommendations.map((rec, i) => (
            <RecommendationCard
              key={`${rec.city}-${i}`}
              rec={rec}
              index={i}
              isPaid={hasDeepDive}
              onUnlock={onUnlock}
              unlockLoading={unlockLoading}
              shareUrl={shareUrl}
            />
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
          These recommendations are generated from your inputs. Do your own
          research before making major life decisions. Encore OS provides
          guidance, not guarantees.
        </p>
      </div>
    </main>
  );
}
