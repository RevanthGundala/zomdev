"use server";
import { buildSponsoredTxb, executeZkLoginTxb } from "../helpers/txb";
import { buildGaslessTransactionBytes } from "@shinami/clients";
import { getSuiClient } from "../helpers/getSuiClient";
import { createClient } from "@/utils/supabase/server";
import { SuiObjectResponse } from "@mysten/sui.js/client";
import { revalidatePath } from "next/cache";
import { SUI_TYPE, USDC_TYPE } from "@/utils/constants";
import { deserializeZkLoginSession } from "../helpers/serde";

const NETWORK = process.env.NEXT_PUBLIC_SUI_NETWORK;
const ADDRESSES = require(`../../../../${NETWORK}_deployed_addresses.json`);

export async function addBounty(
  state: string,
  session: string,
  companyId: string | null,
  title: string,
  description: string,
  requirements: string,
  reward: number,
  createdAt: string,
  deadline: string | undefined
) {
  try {
    if (!deadline || !companyId)
      return { data: null, error: "Deadline not set/companyId" };
    const { PACKAGE_ID, PLATFORM } = ADDRESSES;
    const client = await getSuiClient();
    console.log("Package ID: ", PACKAGE_ID);
    const gaslessPayloadBase64 = await buildGaslessTransactionBytes({
      sui: client,
      build: async (txb) => {
        txb.moveCall({
          target: `${PACKAGE_ID}::bounty::new`,
          arguments: [
            txb.object(PLATFORM),
            txb.pure.id(companyId),
            txb.pure.string(title),
            txb.pure.string(description),
            txb.pure.string(requirements),
            txb.pure.u64(reward),
            txb.pure.string(createdAt),
            txb.pure.string(deadline),
          ],
        });
      },
    });
    console.log("Gasless Payload: ", gaslessPayloadBase64);

    const options = {
      showEvents: true,
    };

    const tx = await executeZkLoginTxb(
      gaslessPayloadBase64,
      client,
      state,
      session,
      options
    );
    console.dir(tx, { depth: null });
    const event = tx.events ? tx.events[0] : null;
    const data = event ? (event as any).parsedJson.id : null;
    revalidatePath("/bounties");
    return { data, error: null };
  } catch (error) {
    console.error("Error creating bounty:", error);
    return { data: null, error: "Error creating bounty" };
  }
}

export async function submitBounty(
  state: string,
  session: string,
  companyId: string | undefined,
  bountyId: string | undefined,
  submission: string
) {
  if (!companyId || !bountyId) return { data: null, error: "Invalid data" };
  try {
    const { PACKAGE_ID, PLATFORM } = ADDRESSES;
    const client = await getSuiClient();
    const gaslessPayloadBase64 = await buildGaslessTransactionBytes({
      sui: client,
      build: async (txb) => {
        txb.moveCall({
          target: `${PACKAGE_ID}::bounty::submit`,
          arguments: [
            txb.object(PLATFORM),
            txb.pure.id(companyId),
            txb.pure.id(bountyId),
            txb.pure.string(submission),
          ],
        });
      },
    });
    console.log("Gasless Payload: ", gaslessPayloadBase64);

    const tx = await executeZkLoginTxb(
      gaslessPayloadBase64,
      client,
      state,
      session
    );
    console.log("Tx: ", tx);
    return { data: tx, error: null };
  } catch (e) {
    console.error("Error submitting bounty:", e);
    return { data: null, error: "Error submitting bounty" };
  }
}

export async function selectWinnerCrypto(
  state: string,
  session: string,
  sender: string | null | undefined,
  companyId: string | null | undefined,
  bountyId: string | null | undefined,
  winner: string | null | undefined,
  reward: number | null | undefined
) {
  try {
    if (!sender || !companyId || !bountyId || !winner || !reward)
      return { data: null, error: "Invalid parameters" };
    const supabase = createClient();
    const { data: userData, error } = await supabase
      .from("Users")
      .select("*")
      .eq("email", winner.trim())
      .single();
    if (error) return { data: null, error: "Error getting winner from db" };

    const { zkLoginUserAddress } = await deserializeZkLoginSession(session);
    const { PACKAGE_ID, PLATFORM } = ADDRESSES;
    const client = await getSuiClient();

    // get bounty cap from zklogin address
    // const { data: bountyCapData, error: bountyCapError } = await getBountyCap(
    //   bountyId,
    //   zkLoginUserAddress
    // );

    // if (bountyCapError) return { data: null, error: bountyCapError };
    // const bountyCap = bountyCapData?.objectId;

    // const { data: tx, error: transferError } = await transferBountyCap(
    //   state,
    //   session,
    //   bountyCap!,
    //   sender
    // );
    // if (transferError) return { data: null, error: transferError };

    // Use sui for testnet
    const usdcType =
      process.env.NEXT_PUBLIC_SUI_NETWORK === "mainnet" ? USDC_TYPE : SUI_TYPE;

    let coinError;
    const usdcCoins: string[] = await client
      .getCoins({
        owner: sender,
        coinType: usdcType,
      })
      .then((res) => res.data)
      .then((data) => data.map((coin) => coin.coinObjectId))
      .catch((error) => (coinError = error));
    if (!usdcCoins || usdcCoins.length === 0)
      return { data: null, error: coinError ?? "USDC Coins not found" };
    const gaslessPayloadBase64 = await buildGaslessTransactionBytes({
      sui: client,
      build: async (txb) => {
        // get user's usdc coin object for tx
        let destinationCoin = txb.object(usdcCoins[0]);
        if (usdcCoins.length > 1) {
          const restOfCoins = usdcCoins.slice(1);
          const sourceCoins = restOfCoins.map((coin) => txb.object(coin));
          [destinationCoin] = txb.mergeCoins(destinationCoin, sourceCoins);
        }
        const [usdc] = txb.splitCoins(destinationCoin, [reward]);

        txb.moveCall({
          target: `${PACKAGE_ID}::bounty::select_winner_v1`,
          arguments: [
            // txb.object("0xf033a1bfb872352120ff750802a6321ab87b6cfb2861585801502a80a0f01f00"),
            txb.object(PLATFORM),
            txb.pure.id(companyId),
            txb.pure.id(bountyId),
            txb.pure.address(userData.address),
            txb.object(usdc),
          ],
          typeArguments: [usdcType],
        });
      },
    });
    console.log("Gasless Payload: ", gaslessPayloadBase64);
    const { txBytes, sponsoredResponse } = await buildSponsoredTxb(
      gaslessPayloadBase64,
      sender
    );
    return { data: { txBytes, sponsoredResponse }, error: null };
  } catch (error) {
    console.error("Error selecting winner:", error);
    return { data: null, error: "Error selecting winner" };
  }
}

async function transferBountyCap(
  state: string,
  session: string,
  bountyCap: string,
  address: string
) {
  try {
    const client = await getSuiClient();
    const { PACKAGE_ID } = ADDRESSES;
    const gaslessPayloadBase64 = await buildGaslessTransactionBytes({
      sui: client,
      build: async (txb) => {
        txb.moveCall({
          target: `${PACKAGE_ID}::bounty::transfer_bounty_cap`,
          arguments: [txb.object(bountyCap), txb.pure.address(address)],
        });
      },
    });
    console.log("Gasless Payload: ", gaslessPayloadBase64);
    const tx = await executeZkLoginTxb(
      gaslessPayloadBase64,
      client,
      state,
      session
    );
    console.log("Tx: ", tx);
    return { data: tx, error: null };
  } catch (error) {
    console.error("Error transferring bounty cap:", error);
    return { data: null, error: "Error transferring bounty cap" };
  }
}

async function getBountyCap(bountyId: string, address: string) {
  try {
    const client = await getSuiClient();
    const response = (await client.getOwnedObjects({ owner: address })).data;
    console.dir(response, { depth: null });
    // Flatten the array and filter out undefined values
    const allObjects = await Promise.all(
      response
        .filter((obj: SuiObjectResponse) => obj && obj.data)
        .map(
          async (obj: SuiObjectResponse) =>
            await client.getObject({
              id: obj.data?.objectId!,
              options: { showType: true, showContent: true, showOwner: true },
            })
        )
    );
    console.dir(allObjects, { depth: null });
    const data = allObjects
      .map((objData) => objData?.data)
      // TODO: Get type from deployed addresses
      .filter(
        (objData) => objData !== null && objData?.type?.includes("BountyCapV1")
      )
      .find(
        (objData) => (objData?.content as any).fields.bounty_id === bountyId
      );
    if (!data) return { data: null, error: "Bounty cap not found" };
    return { data, error: null };
  } catch (error) {
    console.error("Error getting bounty cap:", error);
    return { data: null, error: "Error getting bounty cap" };
  }
}
