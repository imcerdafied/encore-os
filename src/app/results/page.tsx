"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { AssessmentResult } from "@/lib/types";
import ResultsView from "@/components/ResultsView";
import Link from "next/link";

function ResultsContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) {
      setError("No assessment ID provided");
      return;
    }

    // Results are passed via sessionStorage from the assess page API call
    const stored = sessionStorage.getItem(`result-${id}`);
    if (stored) {
      setResult(JSON.parse(stored));
      return;
    }

    // Try fetching from Supabase
    fetch(`/api/results?id=${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Results not found");
        return r.json();
      })
      .then(setResult)
      .catch(() => setError("Results not found. They may have expired."));
  }, [searchParams]);

  if (error) {
    return (
      <main className="min-h-screen bg-navy-dark flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl text-cream mb-4">{error}</h2>
          <Link
            href="/assess"
            className="text-gold hover:text-gold-light transition-colors"
          >
            Take the assessment →
          </Link>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-navy-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-navy-light border-t-gold rounded-full animate-spin" />
      </main>
    );
  }

  return <ResultsView result={result} />;
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-navy-dark flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-navy-light border-t-gold rounded-full animate-spin" />
        </main>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
