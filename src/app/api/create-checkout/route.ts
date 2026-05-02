import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { captureServerEvent } from "@/lib/posthog-server";

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    await captureServerEvent("checkout_missing_token_server", "server");
    return NextResponse.json({ error: "Missing assessment token" }, { status: 400 });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  await captureServerEvent("checkout_requested_server", token, {
    stripe_configured: Boolean(stripeSecretKey),
  });

  if (!stripeSecretKey) {
    await captureServerEvent("checkout_unavailable_server", token, {
      reason: "missing_stripe_secret",
    });

    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          error:
            "Path deep dives are almost ready. For now, you can browse and share all four scenarios for free.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      mockMode: true,
      url: `/results?mock_paid=true&token=${token}`,
    });
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "EncoreOS Path Deep Dive",
              description:
                "Honest tradeoffs, practical next steps, and starting points for one relocation path.",
            },
            unit_amount: 900,
          },
          quantity: 1,
        },
      ],
      success_url: `${req.nextUrl.origin}/results?session_id={CHECKOUT_SESSION_ID}&token=${token}`,
      cancel_url: `${req.nextUrl.origin}/results?token=${token}`,
      metadata: { assessment_token: token },
    });

    await captureServerEvent("checkout_created_server", token, {
      amount_usd: 9,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    await captureServerEvent("checkout_create_failed_server", token);
    return NextResponse.json(
      { error: "Checkout is not available yet." },
      { status: 500 }
    );
  }
}
