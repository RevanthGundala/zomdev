"use server";
import ADDRESSES from "../../../deployed_addresses.json";
import { executeZkLoginTxb } from "./helpers/txb";
import { buildGaslessTransactionBytes } from "@shinami/clients";
import { getSuiClient } from "./helpers/getSuiClient";

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
    const tx = await executeZkLoginTxb(
      gaslessPayloadBase64,
      client,
      state,
      session
    );
    console.log("Tx: ", tx);
    return { data: tx, error: null };
  } catch (error) {
    console.error("Error creating bounty:", error);
    return { data: null, error: "Error creating bounty" };
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
