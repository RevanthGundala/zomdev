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
import {
  GasStationClient,
  buildGaslessTransactionBytes,
} from "@shinami/clients";

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
  const txb = new TransactionBlock();
  txb.setSender(zkLoginUserAddress);
  return txb;
}

export async function executeZkLoginTxb(
  gaslessPayloadBase64: string,
  client: SuiClient,
  state: string,
  session: string,
  options?: SuiTransactionBlockResponseOptions | null | undefined,
): Promise<SuiTransactionBlockResponse> {
  const { inputs, zkLoginUserAddress } = await deserializeSession(session);
  const { maxEpoch, ephemeralKey } = await deserializeState(state);
  const gasStationClient = new GasStationClient(
    process.env.NEXT_PUBLIC_GAS_ACCESS_KEY!,
  );
  const sponsoredResponse = await gasStationClient.sponsorTransactionBlock(
    gaslessPayloadBase64,
    zkLoginUserAddress,
  );

  const sponsoredStatus =
    await gasStationClient.getSponsoredTransactionBlockStatus(
      sponsoredResponse.txDigest,
    );

  if (sponsoredStatus !== "IN_FLIGHT") {
    // TODO: Refund the gas station
    console.log("Spnsored Tx failed");
  }

  const { signature: userSignature } = await TransactionBlock.from(
    sponsoredResponse.txBytes,
  ).sign({
    signer: ephemeralKey,
  });
  const zkLoginSignature: SerializedSignature = getZkLoginSignature({
    inputs,
    maxEpoch,
    userSignature,
  });
  const tx = await client.executeTransactionBlock({
    transactionBlock: sponsoredResponse.txBytes,
    signature: [sponsoredResponse.signature, zkLoginSignature],
    options: options,
    requestType: "WaitForLocalExecution",
  });
  return tx;
}
