"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "../../components/ui/user-auth-form";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { redirect, useRouter } from "next/navigation";
import { generateNonce, generateRandomness } from "@mysten/zklogin";
import { useSessionStorage } from "usehooks-ts";
import { createClient } from "@/utils/supabase/client";
import BackButton from "@/components/ui/back-button";

export default function Login() {
  const [state, setState, removeState] = useSessionStorage("state", "{}");
  const router = useRouter();
  async function signIn() {
    const client = new SuiClient({ url: getFullnodeUrl("testnet") });
    const { epoch } = await client.getLatestSuiSystemState();
    const maxEpoch = Number(epoch) + 2;
    const ephemeralKey = new Ed25519Keypair();
    const jwtRandomness = generateRandomness();

    setState(JSON.stringify({ maxEpoch, ephemeralKey, jwtRandomness }));

    const nonce = generateNonce(
      ephemeralKey.getPublicKey(),
      maxEpoch,
      jwtRandomness
    );

    const params = new URLSearchParams({
      client_id:
        "641538649125-s3phe3ct5t940moj2mg4svf0n4b1bre4.apps.googleusercontent.com",
      redirect_uri: "http://localhost:3000/api/auth/google-callback",
      response_type: "code",
      scope: "openid",
      nonce: nonce,
    });
    const loginURL = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    router.push(loginURL);
  }
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/authentication-light.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="/examples/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
      <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden min-h-screen flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <BackButton />
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in with google to create your account
              </p>
            </div>
            <UserAuthForm signIn={signIn} />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
