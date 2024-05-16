"use server";

import { DynamicFieldInfo } from "@mysten/sui.js/client";
import { getSuiClient } from "./helpers/getSuiClient";
import { getCompanies } from "./getCompany";
import { error } from "console";

export async function getBounties(companyName?: string) {
  // if (!companyName) {
  //   return await getBountiesForUser();
  // }
  try {
    const companies = await getCompanies();
    const bounties = await Promise.all(
      companies.map(
        async (company: any) =>
          await getBountyData(company.bounties, company.parentId)
      )
    );

    // Remove the 'bounties' and 'parentId' fields from the companies array
    const cleanedCompanies = companies.map(({ companyData, companyId }) => {
      // Destructure to remove completed_payouts and get the rest of the properties
      const { completed_payouts, ...rest } = companyData;

      return {
        companyId,
        companyData: {
          ...rest,
          completedPayouts: completed_payouts,
        },
      };
    });

    // Merge the cleaned companies array with the nested bounties array
    const result = cleanedCompanies.map((company, index) => ({
      ...company,
      bounties: bounties[index].map(({ bountyId, bountyData }) => {
        const { created_at, submissions, ...restBountyData } = bountyData;

        return {
          bountyId,
          bountyData: {
            ...restBountyData,
            createdAt: created_at,
            submissions: submissions.fields.contents,
          },
        };
      }),
    }));

    console.dir(result, { depth: null });
    return { data: result, error: null };
  } catch (error) {
    console.error("Error getting bounties:", error);
    return { data: null, error: "Error getting bounties" };
  }
}

export async function getBountyById(
  bountyId: string | null,
  companyName: string | null
) {
  if (!bountyId || !companyName)
    return { data: null, error: "Bounty/Company not found" };
  const { data: bountyData } = await getBounties();
  const res = bountyData?.find((info) => info.companyData.name === companyName);

  const bounty = res?.bounties.find((bounty) => bounty.bountyId === bountyId);
  const company = { companyId: res?.companyId, companyData: res?.companyData };
  const data = { company, bounty };
  return { data, error: null };
}

async function getBountyData(
  bountyObjects: DynamicFieldInfo[],
  parentId: string
) {
  if (!bountyObjects) return [];
  const bountyData = await Promise.all(
    bountyObjects.map(
      async (bountyObject) => await getSingleBountyData(bountyObject, parentId)
    )
  );
  return bountyData;
}

// export async function getBounty
async function getSingleBountyData(
  bountyObject: DynamicFieldInfo,
  parentId: string
) {
  const client = await getSuiClient();
  const bountyObjectData = await client.getDynamicFieldObject({
    name: bountyObject.name,
    parentId,
  });
  const { name: bountyId, value } = (bountyObjectData.data?.content as any)
    .fields;
  const bountyDataDynamicFields = (
    await client.getDynamicFields({ parentId: value.fields.id.id })
  ).data;
  const bounty = await client.getDynamicFieldObject({
    name: bountyDataDynamicFields[0].name,
    parentId: value.fields.id.id,
  });
  const bountyData = (bounty.data?.content as any).fields.value.fields;
  return { bountyData, bountyId };
}
