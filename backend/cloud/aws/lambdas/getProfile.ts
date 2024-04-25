import * as aws from "@pulumi/aws";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ZkWalletClient } from "@shinami/clients";
import { ZkProverClient } from "@shinami/clients";
import { getZkLoginSignature } from "@mysten/zklogin";

type PartialZkLoginSignature = Omit<
  Parameters<typeof getZkLoginSignature>["0"]["inputs"],
  "addressSeed"
>;

export const getProfile = new aws.lambda.CallbackFunction("getProfile", {
  callback: async (event: APIGatewayProxyEventV2) => {
    console.log("Event: ", event);
    //     const { code, state: encodedState } = event.queryStringParameters || {};
    //     if (!code || !encodedState) {
    //       return {
    //         statusCode: 400,
    //         body: "Code and/or State not Found",
    //       };
    //     }

    //     const state = JSON.parse(decodeURIComponent(encodedState));
    //     const walletAccessKey = process.env.SHINAMI_WALLET_ACCESS_KEY!;
    //     const zkw = new ZkWalletClient(walletAccessKey);
    //     const jwt = await handleGoogleAuth(code);
    //     if (!jwt) {
    //       return {
    //         statusCode: 400,
    //         body: "Failed to get JWT",
    //       };
    //     }
    //     const { salt, address: zkLoginAddress } =
    //       await zkw.getOrCreateZkLoginWallet(jwt);

    //     const zkp = new ZkProverClient(walletAccessKey);

    //     const { maxEpoch, ephemeralPublicKey, jwtRandomness } = state;

    //     const signature = await zkp.createZkLoginProof(
    //       jwt,
    //       maxEpoch,
    //       ephemeralPublicKey,
    //       jwtRandomness,
    //       salt
    //     );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://fantura.vercel.app",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
      }),
    };
  },
  runtime: "nodejs18.x",
});

// // TODO: Restrict code type
// async function handleGoogleAuth(code: any): Promise<string | null> {
//   const clientId = process.env.GOOGLE_CLIENT_ID;
//   const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
//   const redirectUri = process.env.GOOGLE_REDIRECT_URI;

//   const data = {
//     grant_type: "authorization_code",
//     clientId,
//     clientSecret,
//     redirectUri,
//     code,
//   };

//   try {
//     const response = await fetch("https://oauth2.googleapis.com/token", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });
//     const googleClaims = await response.json();
//     return googleClaims.id_token;
//   } catch (e) {
//     console.error(e);
//     return null;
//   }
// }
