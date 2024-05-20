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
import ADDRESSES from "../mainnet_deployed_addresses.json";

dotenv.config({ path: ".env.local" });
const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY is not set");

const keypair = Ed25519Keypair.fromSecretKey(fromHEX(PRIVATE_KEY));
const client = new SuiClient({
  url: getFullnodeUrl(
    process.env.NEXT_PUBLC_SUI_NETWORK === "mainnet" ? "mainnet" : "testnet"
  ),
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
console.log("Upgrading contracts...");

const txb = new TransactionBlock();
const { PACKAGE_ID, UPGRADE_CAP, ADMIN_CAP, PUBLISHER, PLATFORM } = ADDRESSES;

main();

// TODO: Implement Upgrade Ticket
async function main() {
  //   await txb.upgrade({
  //     modules,
  //     dependencies,
  //     packageId: PACKAGE_ID,
  //     ticket: UPGRADE_CAP,
  //   });
  await txb.moveCall({
    target: `${PACKAGE_ID}::platform::migrate`,
    arguments: [txb.object(ADMIN_CAP), txb.object(PLATFORM)],
  });
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
  //   const upgradedPackageId = objectChanges?.find((change: SuiObjectChange) =>
  //     change.type === "published" ? change.packageId : null
  //   );
  //   if (!upgradedPackageId) throw new Error("Failed to upgrade package");

  //   const deployed_address = {
  //     PACKAGE_ID: upgradedPackageId,
  //     PUBLISHER: PUBLISHER,
  //     UPGRADE_CAP: UPGRADE_CAP,
  //     ADMIN_CAP: ADMIN_CAP,
  //     PLATFORM: PLATFORM,
  //   };

  //   const deployed_path = path.join(
  //     path_to_scripts,
  //     "../deployed_addresses.json"
  //   );
  //   writeFileSync(deployed_path, JSON.stringify(deployed_address, null, 2));
  //   console.log(
  //     "----------------------------------------------------------------------------------------------------"
  //   );
  //   console.log("Upgraded contracts to: ", deployed_address);
  //   console.log(
  //     "Remaining Balance: ",
  //     parseFloat(
  //       (await client.getCoins({ owner: keypair.getPublicKey().toSuiAddress() }))
  //         .data[0].balance
  //     ) /
  //       Math.pow(10, SUI_DECIMALS) +
  //       " SUI"
  //   );
}
