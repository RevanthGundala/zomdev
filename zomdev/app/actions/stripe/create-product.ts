"use server";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createProduct(id: string, title: string, amount: number) {
  try {
    const product = await stripe.products.create({
      id: id,
      name: title,
      default_price_data: {
        unit_amount: amount,
        currency: "usd",
      },
      expand: ["default_price"],
    });
  } catch (e) {
    console.log("Error: ", e);
    return "Failed to create product";
  }
}
