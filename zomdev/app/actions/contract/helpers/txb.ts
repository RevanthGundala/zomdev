"use server";
import {
  SuiClient,
  SuiTransactionBlockResponse,
  SuiTransactionBlockResponseOptions,
} from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getZkLoginSignature } from "@mysten/zklogin";
import { SerializedSignature } from "@mysten/sui.js/cryptography";
import { GasStationClient, SponsoredTransaction } from "@shinami/clients";
import { deserializeZkLoginSession, deserializeZkLoginState } from "./serde";
import { getSuiClient } from "./getSuiClient";

// export async function newZkLoginTxb(
//   session: string
// ): Promise<TransactionBlock> {
//   try {
//     const { zkLoginUserAddress } = await deserializeZkLoginSession(session);
//     const txb = new TransactionBlock();
//     txb.setSender(zkLoginUserAddress);
//     return txb;
//   } catch (e) {
//     console.log("Error: ", e);
//     throw new Error("Failed to create new zkLoginTxb");
//   }
// }

export async function executeZkLoginTxb(
  gaslessPayloadBase64: string,
  client: SuiClient,
  state: string,
  session: string,
  options?: SuiTransactionBlockResponseOptions | null | undefined
): Promise<SuiTransactionBlockResponse> {
  try {
    const { zkLoginUserAddress, inputs } = await deserializeZkLoginSession(
      session
    );
    const { maxEpoch, ephemeralKey } = await deserializeZkLoginState(state);

    const gasStationClient = new GasStationClient(process.env.GAS_ACCESS_KEY!);
    const sponsoredResponse = await gasStationClient.sponsorTransactionBlock(
      gaslessPayloadBase64,
      zkLoginUserAddress
    );

    const sponsoredStatus =
      await gasStationClient.getSponsoredTransactionBlockStatus(
        sponsoredResponse.txDigest
      );

    if (sponsoredStatus !== "IN_FLIGHT") {
      // TODO: Refund the gas station
      console.log("Sponsored Tx failed - refund the gas station");
    }

    const { signature: userSignature } = await TransactionBlock.from(
      sponsoredResponse.txBytes
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
  } catch (e) {
    console.log("Error: ", e);
    throw new Error("Failed to execute zkLoginTxb");
  }
}

export async function buildSponsoredTxb(
  gaslessPayloadBase64: string,
  client: SuiClient,
  address: string
) {
  try {
    const gasStationClient = new GasStationClient(process.env.GAS_ACCESS_KEY!);
    const sponsoredResponse = await gasStationClient.sponsorTransactionBlock(
      gaslessPayloadBase64,
      address
    );

    const sponsoredStatus =
      await gasStationClient.getSponsoredTransactionBlockStatus(
        sponsoredResponse.txDigest
      );

    if (sponsoredStatus !== "IN_FLIGHT") {
      // TODO: Refund the gas station
      console.log("Sponsored Tx failed - refund the gas station");
    }

    const txBytes = TransactionBlock.from(
      sponsoredResponse.txBytes
    ).serialize();

    return { txBytes, sponsoredResponse };
  } catch (e) {
    console.log("Error: ", e);
    throw new Error("Failed to build sponsoredTxb");
  }
}

export async function executeSponsoredTxb(
  signature: SerializedSignature,
  sponsoredResponse: SponsoredTransaction
) {
  try {
    console.log("Sponsored Response: ", signature);
    const client = await getSuiClient();
    const tx = await client.executeTransactionBlock({
      transactionBlock: sponsoredResponse.txBytes,
      signature: [sponsoredResponse.signature, signature],
      requestType: "WaitForLocalExecution",
    });
    return tx;
  } catch (e) {
    console.log("Error: ", e);
    throw new Error("Failed to execute sponsoredTxb");
  }
}

async function getSponsoredResponse() {}
