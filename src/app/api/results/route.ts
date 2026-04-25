import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

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

    return NextResponse.json({
      id: data.id,
      shareToken: data.share_token,
      inputs: data.inputs_json,
      recommendations: data.results_json,
      createdAt: data.created_at,
    });
  } catch {
    return NextResponse.json({ error: "Results not found" }, { status: 404 });
  }
}
