"use server";
import { ZkWalletClient, ZkProverClient } from "@shinami/clients";
import { getZkLoginSignature, genAddressSeed } from "@mysten/zklogin";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { deserializeState } from "./utils";

type PartialZkLoginSignature = Omit<
  Parameters<typeof getZkLoginSignature>["0"]["inputs"],
  "addressSeed"
>;

// TODO: change return type
export async function getZkp(state: string): Promise<any> {
  const { maxEpoch, ephemeralKey, jwtRandomness } =
    await deserializeState(state);
  const ephemeralPublicKey = ephemeralKey.getPublicKey();
  const jwt = cookies().get("jwt")?.value;
  if (!jwt) {
    return {
      data: null,
      error: "/actions/zkp Could not get JWT",
    };
  }

  const zkw = new ZkWalletClient(process.env.NEXT_PUBLIC_WALLET_ACCESS_KEY!);
  const zkp = new ZkProverClient(process.env.NEXT_PUBLIC_WALLET_ACCESS_KEY!);

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
      userSalt,
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

  if (typeof aud !== "string") {
    aud = aud[0];
  }

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
