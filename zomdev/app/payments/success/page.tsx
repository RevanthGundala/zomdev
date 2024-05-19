"use client";
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
