import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ error: "Missing assessment token" }, { status: 400 });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  // Mock mode: no Stripe key configured
  if (!stripeSecretKey) {
    return NextResponse.json({
      mockMode: true,
      url: `/results?mock_paid=true&token=${token}`,
    });
  }

  const stripe = new Stripe(stripeSecretKey);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Encore Pro — Full Relocation Analysis",
            description:
              "All 4 personalized recommendations, deep-dive city reports, and unlimited reassessments.",
          },
          unit_amount: 2900,
        },
        quantity: 1,
      },
    ],
    success_url: `${req.nextUrl.origin}/results?session_id={CHECKOUT_SESSION_ID}&token=${token}`,
    cancel_url: `${req.nextUrl.origin}/results?token=${token}`,
    metadata: { assessment_token: token },
  });

  return NextResponse.json({ url: session.url });
}
