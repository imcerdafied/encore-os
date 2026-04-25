import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const token = session.metadata?.assessment_token;

    if (token) {
      const supabase = getServiceClient();
      if (supabase) {
        await supabase
          .from("assessments")
          .update({
            paid: true,
            stripe_session_id: session.id,
            paid_at: new Date().toISOString(),
          })
          .eq("share_token", token);
      }
    }
  }

  return NextResponse.json({ received: true });
}
