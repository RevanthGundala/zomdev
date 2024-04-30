"use server";

import { generateNonce } from "@mysten/zklogin";
import { redirect } from "next/navigation";
import { deserializeZkLoginState } from "../utils/serde";

export async function logIn(state: string): Promise<void> {
  try {
    const { maxEpoch, ephemeralKey, jwtRandomness } =
      await deserializeZkLoginState(state);
    const ephemeralPublicKey = ephemeralKey.getPublicKey();
    const nonce = generateNonce(ephemeralPublicKey, maxEpoch, jwtRandomness);
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
      response_type: "code",
      scope: "openid",
      nonce: nonce,
    });
    const loginURL = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    redirect(loginURL);
  } catch (e) {
    console.log("Error: ", e);
  }
}
