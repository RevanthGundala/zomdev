"use client";
import RedirectComponent from "@/components/RedirectComponent";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorComponent() {
  const message = useSearchParams().get("message");
  return (
    <RedirectComponent
      mainText="Something went wrong. Please contact us for support."
      subText={message || "An error occurred."}
      buttonText="View Bounties"
    />
  );
}

export default function Error() {
  return (
    <Suspense fallback={null}>
      <ErrorComponent />
    </Suspense>
  );
}
