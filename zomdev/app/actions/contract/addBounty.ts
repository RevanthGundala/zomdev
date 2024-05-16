"use server";
import ADDRESSES from "../../../deployed_addresses.json";
import { executeZkLoginTxb } from "./helpers/txb";
import { buildGaslessTransactionBytes } from "@shinami/clients";
import { getSuiClient } from "./helpers/getSuiClient";

export async function addBounty(
  state: string,
  session: string,
  companyName: string,
  title: string,
  description: string,
  requirements: string,
  reward: number,
  createdAt: string,
  deadline: string | undefined
) {
  try {
    if (!deadline) return { data: null, error: "Deadline not set" };
    const { PACKAGE_ID, PLATFORM } = ADDRESSES;
    const client = await getSuiClient();
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
    const event = tx.events ? tx.events[0] : null;
    const data = event ? (event as any).parsedJson.id : null;
    return { data, error: null };
  } catch (error) {
    console.error("Error creating bounty:", error);
    return { data: null, error: "Error creating bounty" };
  }
}
