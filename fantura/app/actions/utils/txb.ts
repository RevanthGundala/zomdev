"use server";

import {
  SuiClient,
  SuiTransactionBlockResponse,
  SuiTransactionBlockResponseOptions,
} from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getZkLoginSignature } from "@mysten/zklogin";
import { SerializedSignature } from "@mysten/sui.js/cryptography";
import { GasStationClient } from "@shinami/clients";

import { deserializeSession, deserializeState } from "./serde";

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
