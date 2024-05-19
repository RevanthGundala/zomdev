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

    const sponsoredResponse = await getSponsoredResponse(
      gaslessPayloadBase64,
      zkLoginUserAddress
    );

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
  address: string
) {
  try {
    const sponsoredResponse = await getSponsoredResponse(
      gaslessPayloadBase64,
      address
    );

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

async function getSponsoredResponse(
  gaslessPayloadBase64: string,
  address: string
) {
  const gasStationClient = new GasStationClient(
    process.env.NEXT_PUBLIC_SUI_NETWORK === "mainnet"
      ? process.env.GAS_ACCESS_KEY_MAIN!
      : process.env.GAS_ACCESS_KEY_TEST!
  );
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

  return sponsoredResponse;
}
