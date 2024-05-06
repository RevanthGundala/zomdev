"use client";
import { useState, useEffect } from "react";
import { getPriceId } from "@/app/actions/stripe/get-priceId";
import { createCheckoutSession } from "@/app/actions/stripe/checkout-session";
import { unstable_noStore as noStore } from "next/cache";

export function useStripeProduct(id: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    noStore();
    if (!id) return;
    setIsLoading(true);
    getPriceId(id).then((priceId: string) => {
      createCheckoutSession(priceId)
        .then((secret: string) => {
          if (clientSecret !== secret) setClientSecret(secret);
        })
        .catch((error) => {
          console.error(error);
        });
    });
    setIsLoading(false);
  }, []);

  return { isLoading, clientSecret };
}
