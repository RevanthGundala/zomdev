"use sever";
import { newZkLoginTxb, executeZkLoginTxb } from "../helpers/txb";
import ADDRESSES from "../../../../deployed_addresses.json";
import { buildGaslessTransactionBytes } from "@shinami/clients";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";

export async function createBounty(
  state: string,
  session: string,
  company: string,
  title: string,
  description: string,
  requirements: string,
  reward: number,
  createdAt: string,
  deadline: string | null | undefined
) {
  if (!deadline) return { data: null, error: "Deadline is required" };
  try {
    const { PACKAGE_ID, THE_BUILD_WORK } = ADDRESSES;
    const txb = await newZkLoginTxb(session);
    const client = new SuiClient({ url: getFullnodeUrl("testnet") });
    const gaslessPayloadBase64 = await buildGaslessTransactionBytes({
      sui: client,
      build: async () => {
        txb.moveCall({
          target: `${PACKAGE_ID}::core::createBounty`,
          arguments: [
            txb.object(THE_BUILD_WORK),
            txb.pure.string(company),
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

    const tx = await executeZkLoginTxb(
      gaslessPayloadBase64,
      client,
      state,
      session
    );
    console.log("Tx: ", tx);
    return { data: tx, error: null };
  } catch (error) {
    console.error("Error creating bounty:", error);
    return { data: null, error: "Error creating bounty" };
  }
}
