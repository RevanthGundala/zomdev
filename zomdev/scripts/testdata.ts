import dotenv from "dotenv";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { fromHEX, SUI_DECIMALS } from "@mysten/sui.js/utils";
import {
  getFullnodeUrl,
  SuiClient,
  SuiObjectChange,
} from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import ADDRESSES from "../deployed_addresses.json";

dotenv.config({ path: ".env.local" });
const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY is not set");

const keypair = Ed25519Keypair.fromSecretKey(fromHEX(PRIVATE_KEY));
const client = new SuiClient({ url: getFullnodeUrl("testnet") });

console.log("Running script...");

const { PACKAGE_ID, PLATFORM } = ADDRESSES;

main();

async function main() {
  // create companies
  const txb = new TransactionBlock();
  await txb.moveCall({
    target: `${PACKAGE_ID}::company::new`,
    arguments: [txb.object(PLATFORM), txb.pure.string("Company 1")],
  });
  await txb.moveCall({
    target: `${PACKAGE_ID}::company::new`,
    arguments: [txb.object(PLATFORM), txb.pure.string("Company 2")],
  });
  await txb.moveCall({
    target: `${PACKAGE_ID}::company::new`,
    arguments: [txb.object(PLATFORM), txb.pure.string("Company 3")],
  });

  const tx = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: txb,
    options: {
      showEvents: true,
    },
  });

  console.dir(tx.events, { depth: null });

  console.log(
    "----------------------------------------------------------------------------------------------------"
  );
  const id1 = (tx as any).events[0].parsedJson.id;
  const id2 = (tx as any).events[1].parsedJson.id;
  const id3 = (tx as any).events[2].parsedJson.id;

  // create bounties
  const txb2 = new TransactionBlock();
  await txb2.moveCall({
    target: `${PACKAGE_ID}::bounty::new`,
    arguments: [
      txb2.object(PLATFORM),
      txb2.pure.id(id1),
      txb2.pure.string("Bounty 1"),
      txb2.pure.string("Description 1"),
      txb2.pure.string("Requirements"),
      txb2.pure.u64(100),
      txb2.pure.string("crated_at"),
      txb2.pure.string("deadline"),
    ],
  });
  await txb2.moveCall({
    target: `${PACKAGE_ID}::bounty::new`,
    arguments: [
      txb2.object(PLATFORM),
      txb2.pure.id(id1),
      txb2.pure.string("Bounty 2"),
      txb2.pure.string("Description 2"),
      txb2.pure.string("Requirements"),
      txb2.pure.u64(100),
      txb2.pure.string("crated_at"),
      txb2.pure.string("deadline"),
    ],
  });
  await txb2.moveCall({
    target: `${PACKAGE_ID}::bounty::new`,
    arguments: [
      txb2.object(PLATFORM),
      txb2.pure.id(id2),
      txb2.pure.string("Bounty 2"),
      txb2.pure.string("Description 2"),
      txb2.pure.string("Requirements"),
      txb2.pure.u64(200),
      txb2.pure.string("crated_at"),
      txb2.pure.string("deadline"),
    ],
  });
  await txb2.moveCall({
    target: `${PACKAGE_ID}::bounty::new`,
    arguments: [
      txb2.object(PLATFORM),
      txb2.pure.id(id3),
      txb2.pure.string("Bounty 3"),
      txb2.pure.string("Description 3"),
      txb2.pure.string("Requirements"),
      txb2.pure.u64(300),
      txb2.pure.string("crated_at"),
      txb2.pure.string("deadline"),
    ],
  });

  const tx2 = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: txb2,
    options: {
      showEvents: true,
    },
  });

  console.log("tx: ", tx2.events);

  console.log(
    "----------------------------------------------------------------------------------------------------"
  );

  const sui =
    parseFloat(
      (await client.getCoins({ owner: keypair.getPublicKey().toSuiAddress() }))
        .data[0].balance
    ) / Math.pow(10, SUI_DECIMALS);
  console.log("Remaining Balance: ", sui + " SUI");
}
