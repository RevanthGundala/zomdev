import React from "react";
import Link from "next/link";
import RedirectComponent from "@/components/RedirectComponent";

export default function SignUpSuccess() {
  return (
    <RedirectComponent
      mainText="Success!"
      subText="You have successfully signed up for Zomdev."
      buttonText="View Bounties"
    />
  );
}
