"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCheckoutSession } from "../actions/stripe/checkout-session";

export default function Payments() {
  // const sessionId = useSearchParams().get("session_id");
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const router = useRouter();
  // useEffect(() => {
  //   getCheckoutSession(sessionId).then((data) => {
  //     setStatus(data?.status as any);
  //     setCustomerEmail(data?.customer_email as any);
  //   });
  // }, []);

  // if (status === "open") {
  //   return router.push("/");
  // }

  // if (status === "complete") {
  //   return (
  //     <section id="success">
  //       <p>
  //         We appreciate your business! A confirmation email will be sent to{" "}
  //         {customerEmail}. If you have any questions, please email{" "}
  //         <a href="mailto:orders@example.com">orders@example.com</a>.
  //       </p>
  //     </section>
  //   );
  // }

  return (
    <section id="loading">
      <p>Processing your payment...</p>
    </section>
  );
}
