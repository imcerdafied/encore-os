"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import { AssessmentResult, Recommendation } from "@/lib/types";
import { track } from "@/lib/analytics";
import { getRecommendationAnalyticsProperties } from "@/lib/analytics-events";
import ResultsView from "@/components/ResultsView";
import Link from "next/link";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const assessmentId = searchParams.get("id");
  const tokenParam = searchParams.get("token");
  const missingResultsParam = !assessmentId && !tokenParam;
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);

  const getToken = useCallback(() => {
    return result?.shareToken || tokenParam || "";
  }, [result, tokenParam]);

  // Verify payment on mount if session_id or mock_paid present
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const mockPaid = searchParams.get("mock_paid");

    if (sessionId || mockPaid) {
      const params = new URLSearchParams();
      if (sessionId) params.set("session_id", sessionId);
      if (mockPaid) params.set("mock_paid", mockPaid);
      if (tokenParam) params.set("token", tokenParam);

      fetch(`/api/verify-payment?${params}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.paid && tokenParam) {
            setIsPaid(true);
            return fetch(`/api/results?token=${tokenParam}`);
          }
          return null;
        })
        .then((r) => (r?.ok ? r.json() : null))
        .then((data) => {
          if (data) {
            setResult(data);
            setIsPaid(Boolean(data.paid));
          }
        })
        .catch(() => {});
    }
  }, [searchParams, tokenParam]);

  // Load results
  useEffect(() => {
    if (missingResultsParam) {
      return;
    }

    // Try sessionStorage first (from assess page)
    if (assessmentId) {
      const stored = sessionStorage.getItem(`result-${assessmentId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        const storedCount = parsed.recommendations?.length || 0;
        const expectedCount = parsed.totalRecommendations || storedCount;
        if (storedCount >= expectedCount) {
          Promise.resolve().then(() => {
            setResult(parsed);
            setIsPaid(Boolean(parsed.paid));
          });
          return;
        }
      }
    }

    // Fetch from API
    const param = tokenParam ? `token=${tokenParam}` : `id=${assessmentId}`;
    fetch(`/api/results?${param}`)
      .then((r) => {
        if (!r.ok) throw new Error("Results not found");
        return r.json();
      })
      .then((data) => {
        setResult(data);
        setIsPaid(Boolean(data.paid));
      })
      .catch(() => setError("Results not found. They may have expired."));
  }, [assessmentId, missingResultsParam, tokenParam]);

  const handleUnlock = async (rec: Recommendation, index: number) => {
    const token = getToken();
    if (!token) return;

    const recommendationProperties = getRecommendationAnalyticsProperties(
      rec,
      index
    );
    track("checkout_requested", {
      ...recommendationProperties,
      has_token: Boolean(token),
    });
    setUnlockLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();

      if (data.mockMode) {
        track("checkout_mock_redirected", recommendationProperties);
        router.push(data.url);
      } else if (data.url) {
        track("checkout_redirected", recommendationProperties);
        window.location.href = data.url;
      } else {
        setUnlockLoading(false);
        track("checkout_unavailable", {
          ...recommendationProperties,
          status: res.status,
        });
        window.alert(data.error || "Checkout is not available yet.");
      }
    } catch {
      setUnlockLoading(false);
      track("checkout_request_failed", recommendationProperties);
    }
  };

  if (error || missingResultsParam) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black text-text mb-4">
            {error || "No assessment ID provided"}
          </h2>
          <Link
            href="/assess"
            className="text-text-secondary hover:text-text transition-colors"
          >
            Take the assessment
          </Link>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-border border-t-text rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <ResultsView
      result={result}
      isPaid={isPaid}
      onUnlock={handleUnlock}
      unlockLoading={unlockLoading}
    />
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-bg flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-border border-t-text rounded-full animate-spin" />
        </main>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
