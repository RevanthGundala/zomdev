"use server";
import { DynamicFieldInfo } from "@mysten/sui.js/client";
import MAINNET_ADDRESSES from "../../../../mainnet_deployed_addresses.json";
import TESTNET_ADDRESSES from "../../../../testnet_deployed_addresses.json";
import { getSuiClient } from "../helpers/getSuiClient";

const ADDRESSES =
  process.env.NEXT_PUBLIC_SUI_NETWORK === "mainnet"
    ? MAINNET_ADDRESSES
    : TESTNET_ADDRESSES;

export async function getCompanies() {
  const companyObject = await getCompanyObject();
  const companies = await Promise.all(
    companyObject.map(async (company: DynamicFieldInfo) => {
      return await getCompanyData(company);
    })
  );
  return companies;
}

async function getCompanyObject(): Promise<DynamicFieldInfo[]> {
  const { PLATFORM } = ADDRESSES;
  const client = await getSuiClient();
  const companies = await client.getDynamicFields({
    parentId: PLATFORM,
  });
  return companies.data;
}

async function getCompanyData(company: DynamicFieldInfo) {
  const { PLATFORM } = ADDRESSES;
  const client = await getSuiClient();
  const data = await client.getDynamicFieldObject({
    name: company.name,
    parentId: PLATFORM,
  });
  const companyId = (data.data?.content as any).fields.name;
  const parentId = (data.data?.content as any).fields.value.fields.id.id;
  const companyDynamicFields = (await client.getDynamicFields({ parentId }))
    .data;
  // get the companydatav1 obejct as the first field
  // TODO: add specific types to deploy script
  const sortedCompanyDynamicFields = [
    companyDynamicFields.find((field) => field.name.type === "vector<u8>"),
    ...companyDynamicFields.filter((field) => field.name.type !== "vector<u8>"),
  ];
  if (!sortedCompanyDynamicFields)
    throw new Error("No company dynamic fields found");

  const { data: companyDataObject } = await client.getDynamicFieldObject({
    name: sortedCompanyDynamicFields[0]!.name,
    parentId,
  });
  const companyData = (companyDataObject?.content as any).fields.value.fields;
  // get all bounties for the company, will return [] if no bounties
  const bounties = sortedCompanyDynamicFields.slice(1);
  return { companyData, companyId, bounties, parentId };
}
