"use client";
import {
  SuiClient,
  SuiParsedData,
  getFullnodeUrl,
} from "@mysten/sui.js/client";

export async function getBountyById(id: string | null) {
  if (!id) return;
  const client = new SuiClient({ url: getFullnodeUrl("testnet") });

  try {
    const objects = await client.getObject({
      id,
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
}
