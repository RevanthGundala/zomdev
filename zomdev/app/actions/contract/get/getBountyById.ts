"use server";
import { getBounties } from "./getBounties";
import { BountyInfo } from "@/utils/types/bounty";

export async function getBountyById(id: string | null) {
  if (!id) return { data: null, error: "id not set" };
  const { data } = await getBounties();
  return {
    data: data.find((bountyInfo: BountyInfo) => bountyInfo.bounty.id === id),
    error: null,
  };
}
