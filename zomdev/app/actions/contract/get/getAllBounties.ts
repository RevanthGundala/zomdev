"use server";
import { Bounty } from "@/utils/types/bounty";
import ADDRESSES from "../../../../deployed_addresses.json";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";

export async function getAllBounties(): Promise<Bounty[]> {
  const { THE_BUILD_WORK } = ADDRESSES;
  const client = new SuiClient({ url: getFullnodeUrl("testnet") });

  try {
    const objects = await client.getObject({
      id: THE_BUILD_WORK,
      options: {
        showContent: true,
      },
    });
    console.log("objects: ", objects);
    if (objects.data?.content?.dataType === "moveObject") {
      return (objects.data.content.fields as any).bounties;
    }
  } catch (error) {
    console.error("Error fetching bounties:", error);
  }
  return [];
}
