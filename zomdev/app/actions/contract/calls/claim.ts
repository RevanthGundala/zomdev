"use server";

import { ADDRESSES, SUI_TYPE, USDC_TYPE } from "@/utils/constants";
import { getSuiClient } from "../helpers/getSuiClient";
import { buildGaslessTransactionBytes } from "@shinami/clients";
import { executeZkLoginTxb } from "../helpers/txb";
import { revalidatePath } from "next/cache";
import { deserializeZkLoginSession } from "../helpers/serde";

export async function claim(
  state: string,
  session: string,
  new_address: string | null | undefined,
  balance: number
) {
  try {
    if (!new_address) return { data: null, error: "New address not set" };
    const { zkLoginUserAddress } = await deserializeZkLoginSession(session);
    const client = await getSuiClient();
    const usdcType =
      process.env.NEXT_PUBLIC_SUI_NETWORK === "mainnet" ? USDC_TYPE : SUI_TYPE;

    let coinError;
    const usdcCoins: string[] = await client
      .getCoins({
        owner: zkLoginUserAddress,
        coinType: usdcType,
      })
      .then((res) => res.data)
      .then((data) => data.map((coin) => coin.coinObjectId))
      .catch((error) => (coinError = error));
    if (!usdcCoins || usdcCoins.length === 0)
      return { data: null, error: coinError ?? "USDC Coins not found" };
    const gaslessPayloadBase64 = await buildGaslessTransactionBytes({
      sui: client,
      build: async (txb) => {
        let destinationCoin = txb.object(usdcCoins[0]);
        if (usdcCoins.length > 1) {
          const restOfCoins = usdcCoins.slice(1);
          const sourceCoins = restOfCoins.map((coin) => txb.object(coin));
          [destinationCoin] = txb.mergeCoins(destinationCoin, sourceCoins);
        }
        const [usdc] = txb.splitCoins(destinationCoin, [balance]);
        txb.transferObjects([usdc], txb.pure.address(new_address));
      },
    });
    console.log("Gasless Payload: ", gaslessPayloadBase64);

    const options = {
      showEvents: true,
    };

    const tx = await executeZkLoginTxb(
      gaslessPayloadBase64,
      client,
      state,
      session,
      options
    );
    console.dir(tx, { depth: null });
    const event = tx.events ? tx.events[0] : null;
    const data = event ? (event as any).parsedJson.id : null;
    revalidatePath("/profile");
    return { data, error: null };
  } catch (error) {
    console.error("Error creating bounty:", error);
    return { data: null, error: "Error creating bounty" };
  }
}
