import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { createSuiClient } from "@shinami/clients";

export async function getSuiClient(): Promise<SuiClient> {
  try {
    return process.env.NEXT_PUBLIC_SUI_NETWORK === "mainnet"
      ? createSuiClient(process.env.NODE_ACCESS_KEY_MAIN!)
      : createSuiClient(process.env.NODE_ACCESS_KEY_TEST!);
  } catch (e) {
    console.error("Error getting SuiClient:", e);
    if (process.env.NEXT_PUBLIC_SUI_NETWORK === "mainnet") {
      try {
        const apiAccessKey = process.env.NEXT_PUBLIC_BLOCK_EDEN_KEY;
        const blockEdenUrl = ` https://api.blockeden.xyz/sui/${apiAccessKey}`;
        return new SuiClient({ url: blockEdenUrl });
      } catch (e) {
        console.error("Error getting SuiClient from BlockEden:", e);
        return new SuiClient({ url: getFullnodeUrl("mainnet") });
      }
    }
    return new SuiClient({
      url: getFullnodeUrl("testnet"),
    });
  }
}
