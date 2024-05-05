/**
 * v0 by Vercel.
 * @see https://v0.dev/t/uEZUBeMCHDI
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { joinWaitlist } from "./actions/email/joinWaitlist";

export default function Home() {
  return (
    <div className="dark:bg-gray-950 bg-gray-100 w-full min-h-screen flex flex-col">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Hire Top Talent with Our Developer Bounty Platform
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Discover and hire skilled developers by hosting challenges on
                  our innovative bounty platform. Derisk your hires, attract top
                  talent, and build your dream team.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2" action={joinWaitlist}>
                  <Input
                    id="email"
                    name="email"
                    className="max-w-lg flex-1"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit">Join Waitlist</Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Be the first to know when we launch.
                  <Link className="underline underline-offset-2" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
            <img
              alt="Hero"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              height="550"
              src="/placeholder.svg"
              width="550"
            />
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-950 text-gray-50">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
            <div className="grid gap-1">
              <h3 className="text-lg font-bold">Derisk your hires</h3>
              <p className="text-sm text-gray-400">
                See if candidates can work directly in your codebase by fixing
                bugs and adding different features before you hire them.
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
