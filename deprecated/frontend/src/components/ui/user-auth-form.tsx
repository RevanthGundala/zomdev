"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { useRouter } from "next/navigation";
import { generateNonce, generateRandomness } from "@mysten/zklogin";
import { useSessionStorage } from "usehooks-ts";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const [maxEpoch, setMaxEpoch, removeMaxEpoch] = useSessionStorage(
    "maxEpoch",
    0
  );
  const [ephemeralKey, setEphemeralKey, removeEphemeralKey] =
    useSessionStorage<Ed25519Keypair>("ephemeralKey", {} as Ed25519Keypair);
  const [jwtRandomness, setJwtRandomness, removeJwtRandomness] =
    useSessionStorage("jwtRandomness", "");

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  // TODO: Implement this function
  function isSignedIn() {
    return false;
  }

  async function handleAuth() {
    setIsLoading(true);
    if (isSignedIn()) return;

    const client = new SuiClient({ url: getFullnodeUrl("testnet") });
    const { epoch } = await client.getLatestSuiSystemState();
    const maxEpoch = Number(epoch) + 2;
    const ephemeralKey = new Ed25519Keypair();
    const randomness = generateRandomness();

    setMaxEpoch(maxEpoch);
    setEphemeralKey(ephemeralKey);
    setJwtRandomness(randomness);

    const nonce = generateNonce(
      ephemeralKey.getPublicKey(),
      maxEpoch,
      randomness
    );

    // TODO: switch to .env
    const params = new URLSearchParams({
      client_id:
        "641538649125-s3phe3ct5t940moj2mg4svf0n4b1bre4.apps.googleusercontent.com",
      redirect_uri:
        "https://gaa876jg49.execute-api.us-west-2.amazonaws.com/stage/oauth2/google-callback",
      response_type: "code",
      scope: "openid",
      nonce: nonce,
    });
    const loginURL = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    // console.log("loginURL", loginURL);
    router.push(loginURL);
    setIsLoading(false);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button disabled={true}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email (Coming Soon)
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={handleAuth}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <img className="mr-2 h-4 w-4" src={"./google.png"} />
        )}{" "}
        Google
      </Button>
    </div>
  );
}
