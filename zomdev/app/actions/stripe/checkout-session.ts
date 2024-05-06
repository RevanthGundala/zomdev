"use server";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(priceId: string): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    return_url: `http://localhost:3000/payments?session_id={CHECKOUT_SESSION_ID}`,
  });

  return session.client_secret ?? "";
}

export async function getCheckoutSession(sessionId: string | null) {
  if (!sessionId) return;
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  return {
    status: session.status,
    customer_email: session.customer_details?.email,
  };
}
