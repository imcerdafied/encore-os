import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { Recommendation } from "@/lib/types";

function cleanText(value: string) {
  return value.replace(/[\u2013\u2014]/g, ", ");
}

function cleanMaybeText(value: unknown) {
  return typeof value === "string" ? cleanText(value) : "";
}

function cleanTextList(value: unknown) {
  return Array.isArray(value) ? value.map((item) => cleanMaybeText(item)) : [];
}

function cleanRecommendations(recommendations: Recommendation[]) {
  return recommendations.map((recommendation) => ({
    ...recommendation,
    city: cleanMaybeText(recommendation.city),
    country: cleanMaybeText(recommendation.country),
    descriptor: cleanMaybeText(recommendation.descriptor),
    headline: cleanMaybeText(recommendation.headline),
    costComparison: cleanMaybeText(recommendation.costComparison),
    reasons: cleanTextList(recommendation.reasons),
    tradeoffs: cleanTextList(recommendation.tradeoffs),
    aiResilienceReason: cleanMaybeText(recommendation.aiResilienceReason),
    nextSteps: cleanTextList(recommendation.nextSteps),
    archetype: cleanMaybeText(recommendation.archetype),
  }));
}

function stripDeepDive(recommendations: Recommendation[]) {
  return recommendations.map((recommendation) => ({
    ...recommendation,
    tradeoffs: [],
    nextSteps: [],
  }));
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const token = request.nextUrl.searchParams.get("token");

  if (!id && !token) {
    return NextResponse.json({ error: "ID or token required" }, { status: 400 });
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    let query = supabase.from("assessments").select("*");

    if (token) {
      query = query.eq("share_token", token);
    } else {
      query = query.eq("id", id);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return NextResponse.json({ error: "Results not found" }, { status: 404 });
    }

    const recommendations = Array.isArray(data.results_json)
      ? cleanRecommendations(data.results_json)
      : [];
    const paid = Boolean(data.paid);

    return NextResponse.json({
      id: data.id,
      shareToken: data.share_token,
      inputs: data.inputs_json,
      recommendations: paid ? recommendations : stripDeepDive(recommendations),
      totalRecommendations: recommendations.length,
      paid,
      createdAt: data.created_at,
    });
  } catch {
    return NextResponse.json({ error: "Results not found" }, { status: 404 });
  }
}
