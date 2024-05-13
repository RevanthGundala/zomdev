import React from "react";
import Link from "next/link";
import RedirectComponent from "@/components/RedirectComponent";

export default function ContactSuccess() {
  return (
    <RedirectComponent
      mainText="Success!"
      subText="We will get back to you in 24 hours."
      buttonText="View Bounties"
    />
  );
}
