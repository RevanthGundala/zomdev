"use server";
import { newZkLoginTxb, executeZkLoginTxb } from "../helpers/txb";
import ADDRESSES from "../../../../deployed_addresses.json";
import { buildGaslessTransactionBytes } from "@shinami/clients";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";

export async function getAllBounties() {
  const { THE_BUILD_WORK } = ADDRESSES;
  const client = new SuiClient({ url: getFullnodeUrl("testnet") });
  const objects = client.getObject({ id: THE_BUILD_WORK });
  console.log("objects: ", objects);
}
