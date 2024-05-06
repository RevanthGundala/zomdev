/**
 * v0 by Vercel.
 * @see https://v0.dev/t/bVfpF961fDj
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { joinWaitlist } from "./actions/forms/joinWaitlist";
import { useFormStatus, useFormState } from "react-dom";
import { useEffect } from "react";

export default function Home() {
  const { pending } = useFormStatus();
  const initialState = {
    error: { email: null },
    message: null,
  };

  const [state, formAction] = useFormState(joinWaitlist, initialState);

  const { toast } = useToast();
  useEffect(() => {
    toast({
      title: state?.error?.email ? "Error" : "Success",
      description: state?.message,
    });
  }, [state, toast]);

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <section className="w-full max-w-4xl px-4 md:px-6 py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="flex flex-col items-center space-y-6">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter text-gray-900 sm:text-5xl xl:text-6xl/none dark:text-gray-50">
              Hire Top Talent with Our Developer Bounty Platform
            </h1>
            <p className="max-w-[700px] text-gray-600 md:text-xl dark:text-gray-300">
              Discover and hire skilled developers by hosting challenges on our
              innovative bounty platform. Derisk your hires, attract top talent,
              and build your dream team.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <form className="flex space-x-2" action={formAction}>
              <Input
                id="email"
                name="email"
                className="max-w-lg flex-1"
                placeholder="Enter your email"
                type="email"
              />
              <Button type="submit" disabled={pending}>
                Join Waitlist
              </Button>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Be the first to know when we launch.
              <Link className="underline underline-offset-2" href="#">
                Terms & Conditions
              </Link>
            </p>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900 text-gray-50">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Derisk your hires</h3>
              <p className="text-sm text-gray-400">
                Make sure all of the people you hire are instantly able to
                contribute to your company in a positive way.
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Attract Top Talent</h3>
              <p className="text-sm text-gray-400">
                Host bounty challenges and showcase your company to attract
                skilled developers looking for new opportunities.
              </p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Build Your Dream Team</h3>
              <p className="text-sm text-gray-400">
                Evaluate and hire the best candidates based on their performance
                in your bounty challenges.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
