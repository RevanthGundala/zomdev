/**
 * v0 by Vercel.
 * @see https://v0.dev/t/tnH9s7effRX
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUpUser } from "@/app/actions/forms/signUp";
import { useFormStatus } from "react-dom";
import { useZkLoginSession } from "@/utils/contexts/zkLoginSession";
import { useZkLoginState } from "@/utils/contexts/zkLoginState";

export default function SignUpUser() {
  const { pending } = useFormStatus();
  const { zkLoginSession } = useZkLoginSession();
  const { zkLoginState } = useZkLoginState();
  const signUpCompanyWithZk = signUpUser.bind(
    null,
    zkLoginSession,
    zkLoginState
  );
  return (
    <section className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Create your personal account to get started with our platform.
          </p>
        </div>
        <form className="grid gap-4" action={signUpCompanyWithZk}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input name="name" id="name" placeholder="John Doe" required />
            </div>
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="logo">Company Logo</Label>
            <Input name="logo" id="logo" required type="file" />
          </div> */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              id="email"
              placeholder="m@example.com"
              required
              type="email"
            />
          </div>
          <Button className="w-full" type="submit" disabled={pending}>
            Sign Up
          </Button>
        </form>
      </div>
    </section>
  );
}
