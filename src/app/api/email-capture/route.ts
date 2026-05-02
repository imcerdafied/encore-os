import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { captureServerEvent } from "@/lib/posthog-server";

export async function POST(request: NextRequest) {
  try {
    const { email, assessmentId } = await request.json();

    if (!email || !email.includes("@")) {
      await captureServerEvent("email_capture_validation_failed_server", "server");
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

    await captureServerEvent(
      "email_capture_saved_server",
      assessmentId || "server",
      {
        has_assessment_id: Boolean(assessmentId),
      }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save email" }, { status: 500 });
  }
}
