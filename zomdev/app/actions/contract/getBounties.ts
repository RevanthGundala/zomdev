"use server";

import {
  DynamicFieldInfo,
  SuiClient,
  getFullnodeUrl,
} from "@mysten/sui.js/client";
import { Bounty, BountyInfo } from "@/utils/types/bounty";
import ADDRESSES from "../../../deployed_addresses.json";
import { getProfile } from "../auth/getProfile";

export async function getBounties(companyName?: string) {
  if (!companyName) {
    return await getBountiesForUser();
  }
  const { PLATFORM } = ADDRESSES;
  const client = new SuiClient({ url: getFullnodeUrl("testnet") });

  const object = await client.getObject({
    id: PLATFORM,
    options: { showContent: true },
  });

  console.log("object", object.data?.content as any);

  const companies = await client.getDynamicFields({
    parentId: PLATFORM,
  });

  console.log("companies", companies.data);

  const company = await client.getDynamicFields({
    parentId: companies.data[0].objectId,
  });

  console.log("company", company.data);
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

// get submissions for a bounty and check if the user has submitted
async function getBountiesForUser() {
  const { data, error } = await getProfile();
  if (error) {
    return { data: null, error };
  }

  // const bounties = [];
  // const user_bounties = bounties.map((bounty) =>
  //   bounty.submissions.includes(data?.address)
  // );
  return { data: null, error: null };
}
