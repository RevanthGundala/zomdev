"use server";

import { newZkLoginTxb, executeZkLoginTxb } from "../utils/txb";
import PACKAGE_ID from "../../../deployed_objects.json";
import { buildGaslessTransactionBytes } from "@shinami/clients";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";

export async function createTeam(state: string, session: string) {
  const txb = await newZkLoginTxb(session);
  const client = new SuiClient({ url: getFullnodeUrl("testnet") });
  const gaslessPayloadBase64 = await buildGaslessTransactionBytes({
    sui: client,
    build: async () => {
      txb.moveCall({
        target: `${PACKAGE_ID.PACKAGE_ID}::fantura::createTeam`,
        arguments: [],
      });
    },
  });

  const tx = await executeZkLoginTxb(
    gaslessPayloadBase64,
    client,
    state,
    session,
  );
  console.log("Tx: ", tx);
}
