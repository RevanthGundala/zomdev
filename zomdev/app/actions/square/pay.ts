"use server";
import { Client, CreatePaymentRequest, Environment } from "square";
import { randomUUID } from "crypto";

export async function squarePay(token: any, amount: number | null) {
  if (!amount) {
    throw new Error("Amount is required.");
  }
  try {
    const { paymentsApi } = new Client({
      accessToken: process.env.SQUARE_ACCESS_TOKEN,
      environment: Environment.Sandbox,
    });
    const body: CreatePaymentRequest = {
      idempotencyKey: randomUUID(),
      sourceId: token.token,
      amountMoney: {
        currency: "USD",
        amount: BigInt(amount * 100),
      },
    };

    const { result } = await paymentsApi.createPayment(body);
    const { payment, errors } = result;
    console.log("res", result);
    return { data: payment, error: errors };
  } catch (error) {
    console.error("Error paying with Square:", error);
    return { data: null, error };
  }
}
