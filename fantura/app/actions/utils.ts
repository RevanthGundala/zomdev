"use server";

import {
  Ed25519Keypair,
  Ed25519KeypairData,
  Ed25519PublicKey,
} from "@mysten/sui.js/keypairs/ed25519";

interface State {
  maxEpoch: number;
  ephemeralKey: any;
  jwtRandomness: string;
}

export async function deserializeState(
  state: string
): Promise<{
  maxEpoch: number;
  ephemeralPublicKey: Ed25519PublicKey;
  jwtRandomness: string;
}> {
  const decodedState = JSON.parse(state) as State;
  const { maxEpoch, ephemeralKey, jwtRandomness } = decodedState;
  const keyPair = new Ed25519Keypair({
    publicKey: new Uint8Array(Object.values(ephemeralKey.keypair.publicKey)),
    secretKey: new Uint8Array(Object.values(ephemeralKey.keypair.secretKey)),
  } as Ed25519KeypairData);

  const ephemeralPublicKey = keyPair.getPublicKey();

  return { maxEpoch, ephemeralPublicKey, jwtRandomness };
}
