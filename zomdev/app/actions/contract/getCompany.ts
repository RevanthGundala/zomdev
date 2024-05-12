"use server";
import {
  DynamicFieldInfo,
  SuiClient,
  getFullnodeUrl,
} from "@mysten/sui.js/client";
import ADDRESSES from "../../../deployed_addresses.json";

export async function getCompany(companyName: string) {
  try {
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

    const companyObjects = await Promise.all(
      companies.data.map(
        async (company: any) =>
          await client.getDynamicFields({
            parentId: company.objectId,
          })
      )
    ).then((objects) => objects.flatMap((object) => object.data));

    console.log("companyObjects", companyObjects);

    const companyDynamicField = companyObjects.find(
      (company: any) => company.name.value === companyName
    );
    if (!companyDynamicField) {
      throw new Error(`Company ${companyName} not found`);
    }

    const company = companies.data.find(
      (company: DynamicFieldInfo) =>
        company.objectType ===
        companyDynamicField.objectType.substring(
          0,
          companyDynamicField.objectType.length - 6 // get rid of the trailing "datav1"
        )
    );

    if (!company) {
      throw new Error(`Company ${companyName} not found`);
    }

    const parent = await client.getObject({
      id: company.objectId,
      options: { showContent: true, showOwner: true },
    });
    console.log("parent", (parent.data?.owner as any).ObjectOwner);
    return (parent.data?.owner as any).ObjectOwner;
  } catch (error) {
    console.error("Error getting company:", error);
    return null;
  }
}
