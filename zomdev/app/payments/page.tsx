"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCheckoutSession } from "../actions/stripe/checkout-session";
import RedirectComponent from "@/components/RedirectComponent";

export default function Payments() {
  const sessionId = useSearchParams().get("session_id");
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const router = useRouter();
  useEffect(() => {
    getCheckoutSession(sessionId).then((data) => {
      setStatus(data?.status as any);
      setCustomerEmail(data?.customer_email as any);
    });
  }, []);

  if (status === "open") {
    return router.push("/");
  }

  if (status === "complete") {
    return (
      <section id="success">
        <RedirectComponent
          mainText="Success!"
          subText={`Your payment has been processed successfully. A receipt has been sent to ${customerEmail}.`}
          buttonText="View Bounties"
        />
      </section>
    );
  }

  return (
    <section id="loading">
      <p>Processing your payment...</p>
    </section>
  );
}
