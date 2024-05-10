"use server";
import ADDRESSES from "../../../../deployed_addresses.json";
import { newZkLoginTxb, executeZkLoginTxb } from "../helpers/txb";
import { buildGaslessTransactionBytes } from "@shinami/clients";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getZkLoginSignature } from "@mysten/zklogin";
import { SerializedSignature } from "@mysten/sui.js/cryptography";
import {
  deserializeZkLoginSession,
  deserializeZkLoginState,
} from "../helpers/serde";
import { createClient } from "@/utils/supabase/server";

export async function createBounty(
  state: string,
  session: string,
  company_name: string,
  title: string,
  description: string,
  requirements: string,
  reward: number,
  createdAt: string,
  deadline: string | null | undefined
) {
  if (!deadline) return { data: null, error: "Deadline is required" };
  try {
    const { PACKAGE_ID, PLATFORM } = ADDRESSES;
    const txb = await newZkLoginTxb(session);
    const client = new SuiClient({ url: getFullnodeUrl("testnet") });
    txb.moveCall({
      target: `${PACKAGE_ID}::core::createBounty`,
      arguments: [
        txb.object(PLATFORM),
        txb.pure.string(company_name),
        txb.pure.string(title),
        txb.pure.string(description),
        txb.pure.string(requirements),
        txb.pure.u64(reward),
        txb.pure.string(createdAt),
        txb.pure.string(deadline),
      ],
    });
    const { zkLoginUserAddress, inputs } = await deserializeZkLoginSession(
      session
    );
    const { maxEpoch, ephemeralKey } = await deserializeZkLoginState(state);
    const { bytes, signature: userSignature } = await txb.sign({
      client,
      signer: ephemeralKey, // This must be the same ephemeral key pair used in the ZKP request
    });

    const zkLoginSignature: SerializedSignature = getZkLoginSignature({
      inputs,
      maxEpoch,
      userSignature,
    });
    const tx = await client.executeTransactionBlock({
      transactionBlock: bytes,
      signature: zkLoginSignature,
      requestType: "WaitForLocalExecution",
    });
    // const gaslessPayloadBase64 = await buildGaslessTransactionBytes({
    //   sui: client,
    //   build: async () => {
    //     txb.moveCall({
    //       target: `${PACKAGE_ID}::core::createBounty`,
    //       arguments: [
    //         txb.object(PLATFORM),
    //         txb.pure.string(company_name),
    //         txb.pure.string(title),
    //         txb.pure.string(description),
    //         txb.pure.string(requirements),
    //         txb.pure.u64(reward),
    //         txb.pure.string(createdAt),
    //         txb.pure.string(deadline),
    //       ],
    //     });
    //   },
    // });

    // const tx = await executeZkLoginTxb(
    //   gaslessPayloadBase64,
    //   client,
    //   state,
    //   session
    // );
    console.log("Tx: ", tx);
    return { data: tx, error: null };
  } catch (error) {
    console.error("Error creating bounty:", error);
    return { data: null, error: "Error creating bounty" };
  }
}
