import dotenv from "dotenv";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { fromHEX, SUI_DECIMALS } from "@mysten/sui.js/utils";
import {
  getFullnodeUrl,
  SuiClient,
  SuiObjectChange,
} from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import ADDRESSES from "../testnet_deployed_addresses.json";
import { createClient } from "@/utils/supabase/client";

dotenv.config({ path: ".env.local" });
const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY is not set");

const keypair = Ed25519Keypair.fromSecretKey(fromHEX(PRIVATE_KEY));
const client = new SuiClient({ url: getFullnodeUrl("testnet") });

console.log("Running script...");

const { ADMIN_CAP, PACKAGE_ID, PLATFORM } = ADDRESSES;

main();

async function main() {
  // get companies from db
  const supabase = createClient();
  const { data: companies } = await supabase
    .from("Users")
    .select("company, company_id")
    .neq("company", null);

  console.log("Companies: ", companies);

  // create companies
  const txb = new TransactionBlock();
  companies?.forEach((company: any) => {
    txb.moveCall({
      target: `${PACKAGE_ID}::company::admin_new`,
      arguments: [
        txb.object(ADMIN_CAP),
        txb.object(PLATFORM),
        txb.pure.string(company.company),
        txb.pure.id(company.company_id),
      ],
    });
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

  const sui =
    parseFloat(
      (await client.getCoins({ owner: keypair.getPublicKey().toSuiAddress() }))
        .data[0].balance
    ) / Math.pow(10, SUI_DECIMALS);
  console.log("Remaining Balance: ", sui + " SUI");
}
