"use server";
import { ZkWalletClient, ZkProverClient } from "@shinami/clients";
import { getZkLoginSignature, genAddressSeed } from "@mysten/zklogin";
import { JwtPayload, jwtDecode } from "jwt-decode";
import {
  Ed25519Keypair,
  Ed25519KeypairData,
} from "@mysten/sui.js/keypairs/ed25519";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

type PartialZkLoginSignature = Omit<
  Parameters<typeof getZkLoginSignature>["0"]["inputs"],
  "addressSeed"
>;

interface State {
  maxEpoch: number;
  ephemeralKey: any;
  jwtRandomness: string;
}

// TODO: change return type
export async function getZkp(state: State): Promise<any> {
  // const supabase = createClient();
  // const { data, error } = await supabase.auth.getSession();
  // if (error) {
  //   return {
  //     data: null,
  //     error: "Internal Server Error: Could not get session",
  //   };
  // }
  // const jwt = data.session?.access_token;
  const jwt = cookies().get("jwt")?.value;
  if (!jwt) {
    return {
      data: null,
      error: "Internal Server Error: Could not get JWT",
    };
  }

  // TODO:
  const walletAccessKey = "1cb2a0622c007218a6c9550f25d07fa6";

  const zkw = new ZkWalletClient(walletAccessKey);
  const zkp = new ZkProverClient(walletAccessKey);

  const { maxEpoch, ephemeralKey, jwtRandomness } = state;

  const keyPair = new Ed25519Keypair({
    publicKey: new Uint8Array(Object.values(ephemeralKey.keypair.publicKey)),
    secretKey: new Uint8Array(Object.values(ephemeralKey.keypair.secretKey)),
  } as Ed25519KeypairData);

  const ephemeralPublicKey = keyPair.getPublicKey();

  let userSalt, zkLoginUserAddress;
  try {
    const { salt, address } = await zkw.getOrCreateZkLoginWallet(jwt);
    (userSalt = salt), (zkLoginUserAddress = address);
  } catch (e) {
    return {
      data: null,
      error: "Internal Server Error: Could not get or create ZkLoginWallet",
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
    return {
      data: null,
      error: "Internal Server Error: Could not create ZkLoginProof",
    };
  }
  const partialZkLoginSignature = proof as PartialZkLoginSignature;
  const decodedJwt = jwtDecode<JwtPayload>(jwt);
  let { sub, aud } = decodedJwt;
  if (!sub || !aud) {
    return {
      data: null,
      error: "Invalid JWT",
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
