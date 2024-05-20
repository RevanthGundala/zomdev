"use server";

import { DynamicFieldInfo } from "@mysten/sui.js/client";
import { getSuiClient } from "../helpers/getSuiClient";
import { getCompanies } from "./getCompany";
import { Submission } from "@/utils/types/contract";

export async function getBounties() {
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
      bounties: bounties[index].map(({ bountyId, cleanedBountyData }) => {
        const { created_at, ...restBountyData } = cleanedBountyData;

        return {
          bountyId,
          bountyData: {
            ...restBountyData,
            createdAt: created_at,
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
  const res = bountyData?.find(
    (info: any) => info.companyData.name === companyName
  );
  const bounty = res?.bounties.find(
    (bounty: any) => bounty.bountyId === bountyId
  );
  const company = { companyId: res?.companyId, companyData: res?.companyData };
  const data = { company, bounty };
  return { data, error: null };
}

export async function getBountiesForCompany(companyName: string | null) {
  if (!companyName) return { data: null, error: "Company not found" };
  const { data: bountyData } = await getBounties();
  const res = bountyData?.find(
    (info: any) => info.companyData.name === companyName
  );
  const company = { companyId: res?.companyId, companyData: res?.companyData };
  return { data: { company, bounties: res?.bounties }, error: null };
}

export async function getBountiesForUser(address: string | null) {
  if (!address) return { data: null, error: "User not found" };
  const { data: bountyData } = await getBounties();
  const res = bountyData?.find((info: any) =>
    info.bounties.some((bounty: any) =>
      bounty.bountyData.submissions.includes(address)
    )
  );
  const company = { companyId: res?.companyId, companyData: res?.companyData };
  const bounties = res?.bounties.filter((bounty: any) =>
    bounty.bountyData.submissions.includes(address)
  );
  return { data: { company, bounties }, error: null };
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
  const submissionsData = await getSubmissions(bountyData.submissions);
  const cleanedBountyData = { ...bountyData, submissions: submissionsData };
  return { cleanedBountyData, bountyId };
}

async function getSubmissions(submissionsField: any): Promise<Submission[]> {
  const parentId = submissionsField.fields.id.id;
  const client = await getSuiClient();
  const contractSubmissions = await client.getDynamicFields({
    parentId,
  });
  const submissions = await Promise.all(
    contractSubmissions.data.map(
      async (submission: DynamicFieldInfo) =>
        await client.getDynamicFieldObject({
          name: submission.name,
          parentId,
        })
    )
  );
  const fields = submissions.map(
    (submission) => (submission.data?.content as any).fields
  );
  return fields.map((field) => ({
    address: field.name,
    submissionLink: field.value,
  }));
}
