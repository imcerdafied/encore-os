import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  const token = req.nextUrl.searchParams.get("token");
  const mockPaid = req.nextUrl.searchParams.get("mock_paid");

  // Mock mode
  if (mockPaid === "true") {
    return NextResponse.json({ paid: true });
  }

  if (!sessionId) {
    return NextResponse.json({ paid: false });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    return NextResponse.json({ paid: false });
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Update Supabase
      const supabase = getServiceClient();
      if (supabase && token) {
        await supabase
          .from("assessments")
          .update({
            paid: true,
            stripe_session_id: sessionId,
            paid_at: new Date().toISOString(),
          })
          .eq("share_token", token);
      }
      return NextResponse.json({ paid: true });
    }

    return NextResponse.json({ paid: false });
  } catch {
    return NextResponse.json({ paid: false });
  }
}
