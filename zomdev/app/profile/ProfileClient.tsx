"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DeleteAccount from "@/components/DeleteAccountComponent";
import { updateProfile } from "../actions/forms/updateProfile";
import { useFormState, useFormStatus } from "react-dom";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { joinWaitlist } from "../actions/forms/joinWaitlist";
import { Button } from "@/components/ui/button";

export default function ProfileClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  const initialState = {
    error: { profile: null },
    message: null,
  };

  const [state, formAction] = useFormState(updateProfile, initialState);

  const { toast } = useToast();
  useEffect(() => {
    toast({
      title: state?.error?.profile ? "Error" : "Success",
      description: state?.message,
    });
  }, [state, toast]);
  return (
    <div>
      <Navbar />
      <div className="space-y-6 px-20 mb-10 mt-40 min-h-screen">
        {/* <header className="space-y-2 py-5">
            <div className="flex items-center space-x-3">
              <img
                alt="Avatar"
                className="rounded-full"
                height="96"
                src="/placeholder.svg"
                style={{
                  aspectRatio: "96/96",
                  objectFit: "cover",
                }}
                width="96"
              />
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">Meadow Richardson</h1>
                <Button size="sm">Change photo</Button>
              </div>
            </div>
          </header> */}
        <header className="text-4xl font-bold px-2">Profile</header>
        <form className="space-y-8" action={formAction}>
          {children}
          <div className="p-6">
            <Button
              type="submit"
              className="hover:cursor-pointer"
              disabled={pending}
            >
              Save
            </Button>
          </div>
        </form>
        <div className="p-6">
          <DeleteAccount />
        </div>
      </div>
      <Footer />
    </div>
  );
}
