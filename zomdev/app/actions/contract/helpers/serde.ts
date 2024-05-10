"use server";
import {
  Ed25519Keypair,
  Ed25519KeypairData,
} from "@mysten/sui.js/keypairs/ed25519";

interface ZkLoginState {
  maxEpoch: number;
  ephemeralKey: any;
  jwtRandomness: string;
}

interface ZkLoginSession {
  zkLoginUserAddress: string;
  inputs: any;
}

export async function deserializeZkLoginState(
  zkLoginState: string
): Promise<ZkLoginState> {
  try {
    const decodedZkLoginState = JSON.parse(zkLoginState) as ZkLoginState;
    let { maxEpoch, ephemeralKey, jwtRandomness } = decodedZkLoginState;
    ephemeralKey = new Ed25519Keypair({
      publicKey: new Uint8Array(Object.values(ephemeralKey.keypair.publicKey)),
      secretKey: new Uint8Array(Object.values(ephemeralKey.keypair.secretKey)),
    } as Ed25519KeypairData);

    return { maxEpoch, ephemeralKey, jwtRandomness };
  } catch (e) {
    console.log("Error: ", e);
    throw new Error("Failed to deserialize zkLoginState");
  }
}

export async function deserializeZkLoginSession(
  zkLoginSession: string
): Promise<ZkLoginSession> {
  try {
    const decodedZkLoginSession = JSON.parse(zkLoginSession) as ZkLoginSession;
    const { zkLoginUserAddress, inputs } = decodedZkLoginSession;
    return { zkLoginUserAddress, inputs };
  } catch (e) {
    console.log("Error: ", e);
    throw new Error("Failed to deserialize zkLoginSession");
  }
}
