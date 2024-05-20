import RedirectComponent from "@/components/RedirectComponent";
import React from "react";

export default function DeleteAccount() {
  return (
    <RedirectComponent
      mainText="Delete Account"
      subText="You have successfully deleted your account."
      buttonText="View Bounties"
    />
  );
}
