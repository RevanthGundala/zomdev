import dotenv from "dotenv";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { fromHEX, SUI_DECIMALS } from "@mysten/sui.js/utils";
import {
  getFullnodeUrl,
  SuiClient,
  SuiExecutionResult,
  SuiObjectChange,
} from "@mysten/sui.js/client";
import path, { dirname } from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { writeFileSync } from "fs";
import { NAME } from "../utils/constants";
import MAINNET_ADDRESSES from "../mainnet_deployed_addresses.json";
import TESTNET_ADDRESSES from "../testnet_deployed_addresses.json";

dotenv.config({ path: ".env.local" });
const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY is not set");

const ADDRESSES =
  process.env.NEXT_PUBLIC_SUI_NETWORK === "mainnet"
    ? MAINNET_ADDRESSES
    : TESTNET_ADDRESSES;

console.log("NETWORK: ", process.env.NEXT_PUBLIC_SUI_NETWORK);

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
  const txb1 = new TransactionBlock();
  txb1.moveCall({
    target: `${PACKAGE_ID}::version::current_version`,
    arguments: [],
  });
  const tx = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: txb1,
    options: {
      showBalanceChanges: true,
      showObjectChanges: true,
      showEffects: true,
      showEvents: true,
      showInput: false,
      showRawInput: false,
    },
  });

  const res = await client.devInspectTransactionBlock({
    sender: keypair.getPublicKey().toSuiAddress(),
    transactionBlock: txb1,
  });

  // console.dir(res, { depth: null });
  let byteArray = new Uint8Array((res.results as any)[0]?.returnValues[0][0]);
  // Creating textDecoder instance
  let decoder = new TextDecoder("utf-8");

  // Using decode method to get string output
  let str = decoder.decode(byteArray);

  // Display the output
  console.log("Version: ", str);

  // const txb = new TransactionBlock();
  // txb.moveCall({
  //   target: `${PACKAGE_ID}::platform::migrate`,
  //   arguments: [txb.object(ADMIN_CAP), txb.object(PLATFORM)],
  // });
  // const { objectChanges } = await client.signAndExecuteTransactionBlock({
  //   signer: keypair,
  //   transactionBlock: txb,
  //   options: {
  //     showBalanceChanges: true,
  //     showObjectChanges: true,
  //     showEffects: true,
  //     showEvents: true,
  //     showInput: false,
  //     showRawInput: false,
  //   },
  // });
  // console.log("Object changes: ", objectChanges);
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
