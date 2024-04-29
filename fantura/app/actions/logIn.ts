"use server";

import { generateNonce } from "@mysten/zklogin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { deserializeState } from "./utils";

export async function logIn(state: string) {
  const { maxEpoch, ephemeralKey, jwtRandomness } =
    await deserializeState(state);
  const ephemeralPublicKey = ephemeralKey.getPublicKey();
  const nonce = generateNonce(ephemeralPublicKey, maxEpoch, jwtRandomness);
  //   cookies().set({
  //     name: "nonce",
  //     value: nonce,
  //     httpOnly: true,
  //     path: "/",
  //     secure: true,
  //   });
  //   console.log("Login in Nonce: ", nonce);
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
    response_type: "code",
    scope: "openid",
    nonce: nonce,
  });
  const loginURL = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  redirect(loginURL);
}
