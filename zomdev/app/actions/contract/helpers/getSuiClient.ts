import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";

// TODO: Add shinami node as first choice
export async function getSuiClient(): Promise<SuiClient> {
  return new SuiClient({
    url: getFullnodeUrl(
      process.env.NEXT_PUBLIC_SUI_NETWORK === "mainnet" ? "mainnet" : "testnet"
    ),
  });
}
