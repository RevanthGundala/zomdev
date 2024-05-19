"use client";
import RedirectComponent from "@/components/RedirectComponent";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Error() {
  const message = useSearchParams().get("message");
  return (
    <RedirectComponent
      mainText="Something went wrong. Please contact us for support."
      subText={message || "An error occurred."}
      buttonText="View Bounties"
    />
  );
}
