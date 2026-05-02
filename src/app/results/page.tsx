"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import { AssessmentResult } from "@/lib/types";
import ResultsView from "@/components/ResultsView";
import Link from "next/link";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);

  const getToken = useCallback(() => {
    return result?.shareToken || searchParams.get("token") || "";
  }, [result, searchParams]);

  // Verify payment on mount if session_id or mock_paid present
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const mockPaid = searchParams.get("mock_paid");
    const token = searchParams.get("token");

    if (sessionId || mockPaid) {
      const params = new URLSearchParams();
      if (sessionId) params.set("session_id", sessionId);
      if (mockPaid) params.set("mock_paid", mockPaid);
      if (token) params.set("token", token);

      fetch(`/api/verify-payment?${params}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.paid && token) {
            setIsPaid(true);
            return fetch(`/api/results?token=${token}`);
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
  }, [searchParams]);

  // Load results
  useEffect(() => {
    const id = searchParams.get("id");
    const token = searchParams.get("token");

    if (!id && !token) {
      setError("No assessment ID provided");
      return;
    }

    // Try sessionStorage first (from assess page)
    if (id) {
      const stored = sessionStorage.getItem(`result-${id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        const storedCount = parsed.recommendations?.length || 0;
        const expectedCount = parsed.totalRecommendations || storedCount;
        if (storedCount >= expectedCount) {
          setResult(parsed);
          setIsPaid(Boolean(parsed.paid));
          return;
        }
      }
    }

    // Fetch from API
    const param = token ? `token=${token}` : `id=${id}`;
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
  }, [searchParams]);

  const handleUnlock = async () => {
    const token = getToken();
    if (!token) return;

    setUnlockLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();

      if (data.mockMode) {
        router.push(data.url);
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        setUnlockLoading(false);
        window.alert(data.error || "Checkout is not available yet.");
      }
    } catch {
      setUnlockLoading(false);
    }
  };

  if (error) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black text-text mb-4">{error}</h2>
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
