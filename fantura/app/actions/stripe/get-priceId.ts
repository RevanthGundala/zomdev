"use server";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function getPriceId(productId: string): Promise<string> {
  try {
    return (await stripe.products.retrieve(productId)).default_price as string;
  } catch (e) {
    console.log("Error: ", e);
    throw new Error("Failed to get product");
  }
}
