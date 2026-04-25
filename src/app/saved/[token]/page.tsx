"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AssessmentResult } from "@/lib/types";
import ResultsView from "@/components/ResultsView";
import Link from "next/link";

export default function SavedResultsPage() {
  const params = useParams();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = params.token as string;
    if (!token) return;

    fetch(`/api/results?token=${token}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setResult)
      .catch(() => setError("Results not found"));
  }, [params.token]);

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
