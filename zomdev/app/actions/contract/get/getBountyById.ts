"use server";
import { Bounty } from "@/utils/types/bounty";
import { getBounties } from "./getBounties";
import { BountyInfo } from "@/utils/types/bounty";

export async function getBountyById(id: string | null) {
  if (!id) return;
  const { data } = await getBounties();
  return data.find((bountyInfo: BountyInfo) => bountyInfo.bounty.id === id);
}
