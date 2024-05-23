"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import { UserAuthForm } from "../../components/ui/user-auth-form";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { generateRandomness, generateNonce } from "@mysten/zklogin";
import BackButton from "@/components/ui/back-button";
import { useZkLoginState } from "@/utils/contexts/zkLoginState";
import { useRouter } from "next/navigation";
import { useZkLoginSession } from "@/utils/contexts/zkLoginSession";

export default function Login() {
  const { setZkLoginState, removeZkLoginState } = useZkLoginState();
  const { removeZkLoginSession } = useZkLoginSession();
  const router = useRouter();

  async function signIn() {
    // remove sessions if they exist
    removeZkLoginState();
    removeZkLoginSession();
    const client = new SuiClient({
      url: getFullnodeUrl(
        process.env.NEXT_PUBLIC_SUI_NETWORK === "mainnet"
          ? "mainnet"
          : "testnet"
      ),
    });
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
    const ephemeralPublicKey = ephemeralKey.getPublicKey();
    const nonce = generateNonce(ephemeralPublicKey, maxEpoch, jwtRandomness);
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
      response_type: "code",
      scope: "openid email",
      nonce: nonce,
    });
    const loginURL = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    router.push(loginURL);
  }
  return (
    <>
      <div className="md:hidden"></div>
      <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden min-h-screen flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900"></div>
          <div className="relative z-20 flex items-center text-lg font-medium">
            <BackButton path={"/"} />
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg"></p>
              <footer className="text-sm"></footer>
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
