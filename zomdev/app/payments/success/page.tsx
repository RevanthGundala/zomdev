"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCheckoutSession } from "../../../../testing/zomdev/zomdev/app/actions/stripe/checkout-session";
import RedirectComponent from "@/components/RedirectComponent";

export default function Payments() {
  return (
    <section id="success">
      <RedirectComponent
        mainText="Success!"
        subText={`Your payment has been processed successfully.`}
        buttonText="View Bounties"
      />
    </section>
  );
}
