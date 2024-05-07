import React from "react";
import Link from "next/link";

export default function SignUpSuccess() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">Success!</h1>
        <p className="text-gray-500 dark:text-gray-400">
          View our available bounties
        </p>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
          href="/bounties"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
