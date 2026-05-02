"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { AssessmentResult } from "@/lib/types";
import ResultsView from "@/components/ResultsView";
import Link from "next/link";

export default function SavedResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);

  const token = params.token as string;

  useEffect(() => {
    if (!token) return;

    fetch(`/api/results?token=${token}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setResult(data);
        setIsPaid(Boolean(data.paid));
      })
      .catch(() => setError("Results not found"));
  }, [token]);

  const handleUnlock = useCallback(async () => {
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
      }
    } catch {
      setUnlockLoading(false);
    }
  }, [token, router]);

  if (error) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black text-text mb-4">{error}</h2>
          <Link
            href="/assess"
            className="text-text-secondary hover:text-text transition-colors"
          >
            Take the assessment &rarr;
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
