"use server";
import ADDRESSES from "../../../deployed_addresses.json";
import { executeZkLoginTxb } from "./helpers/txb";
import { buildGaslessTransactionBytes } from "@shinami/clients";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getZkLoginSignature } from "@mysten/zklogin";
import { SerializedSignature } from "@mysten/sui.js/cryptography";
import {
  deserializeZkLoginSession,
  deserializeZkLoginState,
} from "./helpers/serde";
import { getCompany } from "./getCompany";

export async function createBounty(
  state: string,
  session: string,
  companyName: string,
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
    const client = new SuiClient({ url: getFullnodeUrl("testnet") });
    // txb.moveCall({
    //   target: `${PACKAGE_ID}::bounty::new`,
    //   arguments: [
    //     txb.object(PLATFORM),
    //     txb.pure.string(companyName),
    //     txb.pure.string(title),
    //     txb.pure.string(description),
    //     txb.pure.string(requirements),
    //     txb.pure.u64(reward),
    //     txb.pure.string(createdAt),
    //     txb.pure.string(deadline),
    //   ],
    // });
    // const { inputs } = await deserializeZkLoginSession(session);
    // const { maxEpoch, ephemeralKey } = await deserializeZkLoginState(state);
    // const { bytes, signature: userSignature } = await txb.sign({
    //   client,
    //   signer: ephemeralKey, // This must be the same ephemeral key pair used in the ZKP request
    // });

    // const zkLoginSignature: SerializedSignature = getZkLoginSignature({
    //   inputs,
    //   maxEpoch,
    //   userSignature,
    // });
    // const tx = await client.executeTransactionBlock({
    //   transactionBlock: bytes,
    //   signature: zkLoginSignature,
    //   requestType: "WaitForLocalExecution",
    //   options: {
    //     showEvents: true,
    //   },
    // });
    const gaslessPayloadBase64 = await buildGaslessTransactionBytes({
      sui: client,
      build: async (txb) => {
        txb.moveCall({
          target: `${PACKAGE_ID}::bounty::new`,
          arguments: [
            txb.object(PLATFORM),
            txb.pure.string(companyName),
            txb.pure.string(title),
            txb.pure.string(description),
            txb.pure.string(requirements),
            txb.pure.u64(reward),
            txb.pure.string(createdAt),
            txb.pure.string(deadline),
          ],
        });
      },
    });
    console.log("Gasless Payload: ", gaslessPayloadBase64);

    const tx = await executeZkLoginTxb(
      gaslessPayloadBase64,
      client,
      state,
      session
    );
    console.log("Tx: ", tx);
    // // Ensure `tx.events` is not `null` or `undefined` before accessing `[0]`

    const event = tx.events ? tx.events[0] : null;
    const data = event ? (event as any).parsedJson.id : null;
    return { data, error: null };
  } catch (error) {
    console.error("Error creating bounty:", error);
    return { data: null, error: "Error creating bounty" };
  }
}
