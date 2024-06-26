"use server";
import { ZkWalletClient, ZkProverClient } from "@shinami/clients";
import { getZkLoginSignature, genAddressSeed } from "@mysten/zklogin";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { deserializeZkLoginState } from "../contract/helpers/serde";

type PartialZkLoginSignature = Omit<
  Parameters<typeof getZkLoginSignature>["0"]["inputs"],
  "addressSeed"
>;

type ZkLoginSession = {
  data: {
    zkLoginUserAddress: string;
    inputs: PartialZkLoginSignature;
  } | null;
  error: string | null;
};

export async function getZkp(state: string): Promise<ZkLoginSession> {
  const { maxEpoch, ephemeralKey, jwtRandomness } =
    await deserializeZkLoginState(state);
  const ephemeralPublicKey = ephemeralKey.getPublicKey();
  const jwt = cookies().get("jwt")?.value;
  if (!jwt) {
    return {
      data: null,
      error: "/actions/zkp Could not get JWT",
    };
  }

  const WALLET_ACCESS_KEY =
    process.env.NEXT_PUBLIC_SUI_NETWORK === "mainnet"
      ? process.env.WALLET_ACCESS_KEY_MAIN!
      : process.env.WALLET_ACCESS_KEY_TEST!;

  const zkw = new ZkWalletClient(WALLET_ACCESS_KEY);
  const zkp = new ZkProverClient(WALLET_ACCESS_KEY);

  let userSalt, zkLoginUserAddress;
  try {
    const { salt, address } = await zkw.getOrCreateZkLoginWallet(jwt);
    (userSalt = salt), (zkLoginUserAddress = address);
  } catch (e) {
    return {
      data: null,
      error: "zkw.getOrCreateZkLoginWallet failed",
    };
  }
  let proof;
  try {
    const { zkProof } = await zkp.createZkLoginProof(
      jwt,
      maxEpoch,
      ephemeralPublicKey,
      BigInt(jwtRandomness),
      userSalt
    );
    proof = zkProof;
  } catch (e) {
    console.log("Error: ", e);
    return {
      data: null,
      error: "zkp.createZkLoginProof failed",
    };
  }
  const partialZkLoginSignature = proof as PartialZkLoginSignature;
  const decodedJwt = jwtDecode<JwtPayload>(jwt);
  let { sub, aud } = decodedJwt;
  if (!sub || !aud) {
    return {
      data: null,
      error: "/actions/zkp Invalid JWT",
    };
  }

  if (typeof aud !== "string") aud = aud[0];

  const addressSeed = genAddressSeed(userSalt, "sub", sub, aud).toString();

  const inputs = {
    ...partialZkLoginSignature,
    addressSeed,
  };

  return {
    data: {
      zkLoginUserAddress: zkLoginUserAddress,
      inputs: inputs,
    },
    error: null,
  };
}
