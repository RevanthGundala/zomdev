"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import { UserAuthForm } from "../../components/ui/user-auth-form";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { generateRandomness } from "@mysten/zklogin";
import BackButton from "@/components/ui/back-button";
import { logIn } from "../actions/auth/logIn";
import { useZkLoginState } from "@/utils/contexts/zkLoginState";

export default function Login() {
  const { setZkLoginState } = useZkLoginState();
  async function signIn() {
    const client = new SuiClient({ url: getFullnodeUrl("testnet") });
    const { epoch } = await client.getLatestSuiSystemState();
    const maxEpoch = Number(epoch) + 2;
    const ephemeralKey = new Ed25519Keypair();
    const jwtRandomness = generateRandomness();
    const encodedState = JSON.stringify({
      maxEpoch,
      ephemeralKey,
      jwtRandomness,
    });
    setZkLoginState(encodedState);
    await logIn(encodedState);
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
