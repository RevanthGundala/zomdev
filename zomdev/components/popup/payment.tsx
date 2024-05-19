"use client";
import { Button } from "@/components/ui/button";
import React, { SetStateAction } from "react";
import { AlertDialogCancel } from "@/components/ui/alert-dialog";
import CashApp from "./CashApp";
import { useRouter } from "next/navigation";

export default function PaymentPopup() {
  const router = useRouter();
  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="space-y-2 text-center">
              <h3 className="text-2xl font-bold">Choose Payment Method</h3>
              <ul className="space-y-4">
                <Button onClick={() => router.push("/payments/crypto")}>
                  Crypto
                </Button>
                {/* <CashApp /> */}
              </ul>
            </div>
            <AlertDialogCancel className="w-full">Back</AlertDialogCancel>
          </div>
        </div>
      </div>
    </div>
  );
}
