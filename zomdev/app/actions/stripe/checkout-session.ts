"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createCheckoutSession(priceId: string) {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${
      process.env.VERCEL_URL ?? "http://localhost:3000"
    }/payments/success`,
    cancel_url: `${
      process.env.VERCEL_URL ?? "http://localhost:3000"
    }/payments/failure`,
    automatic_tax: { enabled: true },
  });
  redirect(session.url!);
}

export async function getCheckoutSession(sessionId: string | null) {
  if (!sessionId) return;
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  return {
    status: session.status,
    customer_email: session.customer_details?.email,
  };
}
