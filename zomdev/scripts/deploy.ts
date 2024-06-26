import dotenv from "dotenv";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { fromHEX, SUI_DECIMALS } from "@mysten/sui.js/utils";
import {
  getFullnodeUrl,
  SuiClient,
  SuiObjectChange,
} from "@mysten/sui.js/client";
import path, { dirname } from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { writeFileSync } from "fs";
import { NAME } from "../utils/constants";

dotenv.config({ path: ".env.local" });
const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY is not set");
const NETWORK = process.env.NEXT_PUBLIC_SUI_NETWORK;
console.log("NETWORK: ", NETWORK);

if (!NETWORK) throw new Error("NEXT_PUBLIC_SUI_NETWORK is not set");

const keypair = Ed25519Keypair.fromSecretKey(fromHEX(PRIVATE_KEY));

const client = new SuiClient({
  url: getFullnodeUrl(NETWORK === "mainnet" ? "mainnet" : "testnet"),
});
const path_to_scripts = dirname(fileURLToPath(import.meta.url));
const path_to_contracts = path.join(
  path_to_scripts,
  `../../contracts/${NAME.toLowerCase()}`
);
console.log("Building contracts...");
const { modules, dependencies } = JSON.parse(
  execSync(
    `sui move build --dump-bytecode-as-base64 --path ${path_to_contracts}`,
    {
      encoding: "utf-8",
    }
  )
);
console.log("Deploying contracts...");

const txb = new TransactionBlock();
const [upgrade_cap] = txb.publish({
  modules,
  dependencies,
});

txb.transferObjects([upgrade_cap], txb.pure.address(keypair.toSuiAddress()));

main();

async function main() {
  const { objectChanges } = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: txb,
    options: {
      showBalanceChanges: true,
      showObjectChanges: true,
      showEffects: true,
      showEvents: true,
      showInput: false,
      showRawInput: false,
    },
  });

  console.log("Object changes: ", objectChanges);

  const packageId = (objectChanges as any)?.find(
    (change: any) => change.type === "published"
  )?.packageId;
  if (!packageId) {
    throw new Error("Could not find packageId");
  }
  let publisher, upgradeCap, adminCap, platform;
  for (const change of objectChanges!) {
    if (change.type === "created") {
      if (change.objectType === `0x2::package::Publisher`)
        publisher = change.objectId;
      else if (change.objectType === `0x2::package::UpgradeCap`)
        upgradeCap = change.objectId;
      else if (change.objectType === `${packageId}::platform::AdminCap`)
        adminCap = change.objectId;
      else if (change.objectType === `${packageId}::platform::Platform`)
        platform = change.objectId;
    }
  }

  const deployed_address = {
    PACKAGE_ID: packageId,
    PUBLISHER: publisher,
    UPGRADE_CAP: upgradeCap,
    ADMIN_CAP: adminCap,
    PLATFORM: platform,
  };

  const deployed_path = path.join(
    path_to_scripts,
    NETWORK === "mainnet"
      ? "../mainnet_deployed_addresses.json"
      : "../testnet_deployed_addresses.json"
  );
  writeFileSync(deployed_path, JSON.stringify(deployed_address, null, 2));
  console.log(
    "----------------------------------------------------------------------------------------------------"
  );
  console.log("Deployed contracts to: ", deployed_address);
  console.log(
    "Remaining Balance: ",
    parseFloat(
      (await client.getCoins({ owner: keypair.getPublicKey().toSuiAddress() }))
        .data[0].balance
    ) /
      Math.pow(10, SUI_DECIMALS) +
      " SUI"
  );
}
