import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email, assessmentId } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const supabase = getServiceClient();
    if (supabase) {
      try {
        await supabase.from("email_captures").insert({
          email,
          assessment_id: assessmentId,
          created_at: new Date().toISOString(),
        });
      } catch {
        console.log("Supabase email capture insert failed");
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save email" }, { status: 500 });
  }
}
