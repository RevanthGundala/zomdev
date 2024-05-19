import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { createSuiClient } from "@shinami/clients";

export async function getSuiClient(): Promise<SuiClient> {
  try {
    return createSuiClient(process.env.NODE_ACCESS_KEY!);
  } catch (e) {
    console.error("Error getting SuiClient:", e);
    return new SuiClient({
      url: getFullnodeUrl(
        process.env.NEXT_PUBLIC_SUI_NETWORK === "mainnet"
          ? "mainnet"
          : "testnet"
      ),
    });
  }
}
