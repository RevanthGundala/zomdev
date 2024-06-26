import Link from "next/link";
import React from "react";

type BackButtonProps = {
  path: string;
};

export default function BackButton({ path }: BackButtonProps) {
  return (
    <Link
      href={path}
      className="rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>{" "}
      Home
    </Link>
  );
}
