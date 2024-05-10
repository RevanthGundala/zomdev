"use server";

import {
  DynamicFieldInfo,
  SuiClient,
  getFullnodeUrl,
} from "@mysten/sui.js/client";
import { Bounty, BountyInfo } from "@/utils/types/bounty";
import ADDRESSES from "../../../../deployed_addresses.json";

export async function getBounties(companyName?: string) {
  const { PLATFORM } = ADDRESSES;
  const client = new SuiClient({ url: getFullnodeUrl("testnet") });

  const object = await client.getObject({
    id: PLATFORM,
    options: { showContent: true },
  });

  const companies = await client.getDynamicFields({
    parentId: (object.data?.content as any)?.fields.companies.fields.id
      .id as string,
  });

  const filteredCompanies = companyName
    ? companies?.data.filter(
        (company: any) => company.name.value === companyName
      )
    : companies?.data;

  const bounties: BountyInfo[] = await Promise.all(
    filteredCompanies.map(async (company: any) => {
      // Fetch dynamic fields for the company
      const dynamicFields = await client.getDynamicFields({
        parentId: company.objectId,
      });

      // Fetch each bounty object for the dynamic fields
      const bountiesForCompany = await Promise.all(
        dynamicFields.data.map(async (bountyObject: any) => {
          const bountyData = await client.getObject({
            id: bountyObject.objectId,
            options: { showContent: true },
          });

          return (bountyData.data?.content as any).fields;
        })
      );

      // Flatten the array and map to the desired structure
      return bountiesForCompany.flat().map((bounty: any) => ({
        bounty: {
          id: bounty.id.id,
          title: bounty.title,
          description: bounty.description,
          requirements: bounty.requirements,
          reward: parseFloat(bounty.reward),
          submissions: bounty.submissions,
          createdAt: bounty.created_at,
          deadline: bounty.deadline,
        },
        company: company.name.value as string,
      }));
    })
  ).then((results) => results.flat());

  return { data: bounties, error: null };
}
