"use server";
import { newZkLoginTxb, executeZkLoginTxb } from "../helpers/txb";
import ADDRESSES from "../../../../deployed_addresses.json";
import { buildGaslessTransactionBytes } from "@shinami/clients";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";

export async function getBountiesOwnedBy(
  session: string,
  state: string,
  address: string
): Promise<any> {
  const { PACKAGE_ID, THE_BUILD_WORK } = ADDRESSES;
  const txb = await newZkLoginTxb(session);
  const client = new SuiClient({ url: getFullnodeUrl("testnet") });
  const gaslessPayloadBase64 = await buildGaslessTransactionBytes({
    sui: client,
    build: async () => {
      txb.moveCall({
        target: `${PACKAGE_ID}::core::getBountiesOwnedBy`,
        arguments: [txb.object(THE_BUILD_WORK), txb.pure.string(address)],
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
}
