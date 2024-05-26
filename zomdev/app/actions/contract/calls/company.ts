"use server";
import { executeZkLoginTxb } from "../helpers/txb";
import { buildGaslessTransactionBytes } from "@shinami/clients";
import { getSuiClient } from "../helpers/getSuiClient";

const NETWORK = process.env.NEXT_PUBLIC_SUI_NETWORK;
const ADDRESSES = require(`../../../../${NETWORK}_deployed_addresses.json`);

export async function addCompany(state: string, session: string, name: string) {
  try {
    const { PACKAGE_ID, PLATFORM } = ADDRESSES;
    const client = await getSuiClient();
    const gaslessPayloadBase64 = await buildGaslessTransactionBytes({
      sui: client,
      build: async (txb) => {
        txb.moveCall({
          target: `${PACKAGE_ID}::company::new`,
          arguments: [txb.object(PLATFORM), txb.pure.string(name)],
        });
      },
    });
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
    console.log("Tx: ", tx);
    const event = tx.events ? tx.events[0] : null;
    const data = event ? (event as any).parsedJson.id : null;
    return { data, error: null };
  } catch (error) {
    console.error("Error creating company:", error);
    return { data: null, error: "Error creating company" };
  }
}

// await txb.moveCall({
//   target: `${PACKAGE_ID}::company::new`,
//   arguments: [txb.object(PLATFORM), txb.pure.string(name)],
// });
// const { inputs } = await deserializeZkLoginSession(session);
// const { maxEpoch, ephemeralKey } = await deserializeZkLoginState(state);
// const { bytes, signature: userSignature } = await txb.sign({
//   client,
//   signer: ephemeralKey, // This must be the same ephemeral key pair used in the ZKP request
// });

// const zkLoginSignature: SerializedSignature = getZkLoginSignature({
//   inputs,
//   maxEpoch,
//   userSignature,
// });
// const tx = await client.executeTransactionBlock({
//   transactionBlock: bytes,
//   signature: zkLoginSignature,
//   requestType: "WaitForLocalExecution",
// });
