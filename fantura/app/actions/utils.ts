"use server";

import {
  SuiClient,
  SuiTransactionBlockResponse,
  SuiTransactionBlockResponseOptions,
  getFullnodeUrl,
} from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import {
  Ed25519Keypair,
  Ed25519KeypairData,
} from "@mysten/sui.js/keypairs/ed25519";
import { getZkLoginSignature } from "@mysten/zklogin";
import { SerializedSignature } from "@mysten/sui.js/cryptography";

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

export async function newZkLoginTxb(
  session: string,
): Promise<TransactionBlock> {
  const { zkLoginUserAddress } = await deserializeSession(session);
  console.log("zkLoginUserAddress: ", zkLoginUserAddress);
  const txb = new TransactionBlock();
  txb.setSender(zkLoginUserAddress);
  return txb;
}

export async function executeZkLoginTxb(
  txb: TransactionBlock,
  state: string,
  session: string,
  options?: SuiTransactionBlockResponseOptions | null | undefined,
): Promise<SuiTransactionBlockResponse> {
  const { inputs } = await deserializeSession(session);
  const { maxEpoch, ephemeralKey } = await deserializeState(state);
  const client = new SuiClient({ url: getFullnodeUrl("testnet") });
  const { bytes, signature: userSignature } = await txb.sign({
    client,
    signer: ephemeralKey,
  });
  const zkLoginSignature: SerializedSignature = getZkLoginSignature({
    inputs,
    maxEpoch,
    userSignature,
  });
  const tx = await client.executeTransactionBlock({
    transactionBlock: bytes,
    signature: zkLoginSignature,
    options: options,
  });
  return tx;
}
