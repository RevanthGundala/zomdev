"use server";

import {
  Ed25519Keypair,
  Ed25519KeypairData,
} from "@mysten/sui.js/keypairs/ed25519";

interface State {
  maxEpoch: number;
  ephemeralKey: any;
  jwtRandomness: string;
}

interface Session {
  zkLoginUserAddress: string;
  inputs: any;
}

export async function deserializeState(state: string): Promise<State> {
  const decodedState = JSON.parse(state) as State;
  let { maxEpoch, ephemeralKey, jwtRandomness } = decodedState;
  ephemeralKey = new Ed25519Keypair({
    publicKey: new Uint8Array(Object.values(ephemeralKey.keypair.publicKey)),
    secretKey: new Uint8Array(Object.values(ephemeralKey.keypair.secretKey)),
  } as Ed25519KeypairData);

  return { maxEpoch, ephemeralKey, jwtRandomness };
}

export async function deserializeSession(session: string): Promise<Session> {
  const decodedSession = JSON.parse(session) as Session;
  const { zkLoginUserAddress, inputs } = decodedSession;
  return { zkLoginUserAddress, inputs };
}
