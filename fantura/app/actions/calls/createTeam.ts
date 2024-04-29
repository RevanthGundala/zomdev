"use server";

import { newZkLoginTxb, executeZkLoginTxb } from "../utils";
import PACKAGE_ID from "../../../deployed_objects.json";

export async function createTeam(state: string, session: string) {
  const txb = await newZkLoginTxb(session);
  console.log("Package Id: ", PACKAGE_ID);
  txb.moveCall({
    target: `${PACKAGE_ID.PACKAGE_ID}::fantura::createTeam`,
    arguments: [],
  });
  const tx = await executeZkLoginTxb(txb, state, session);
  console.log("Tx: ", tx);
}
