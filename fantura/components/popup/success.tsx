/**
 * v0 by Vercel.
 * @see https://v0.dev/t/heecVdCmhPj
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";
import { Button } from "@/components/ui/button";
import React, { SetStateAction } from "react";
import { AlertDialogCancel } from "@/components/ui/alert-dialog";

export default function SuccessPopup() {
  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-green-500 p-3 text-white">
              <CheckIcon className="h-6 w-6" />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-2xl font-bold">Success!</h3>
              <p className="text-gray-500 dark:text-gray-400">
                You will be contacted shortly.
              </p>
            </div>
            <AlertDialogCancel className="w-full">Close</AlertDialogCancel>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
