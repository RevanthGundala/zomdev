/**
 * v0 by Vercel.
 * @see https://v0.dev/t/DPon35dAkBR
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { NAME } from "@/utils/constants";
import RedirectComponent from "@/components/RedirectComponent";

export default function Logout() {
  return (
    <RedirectComponent
      mainText="Logout"
      subText="You have successfully logged out."
      buttonText="View Bounties"
    />
  );
}
