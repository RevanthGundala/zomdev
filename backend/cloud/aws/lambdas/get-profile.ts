import * as aws from "@pulumi/aws";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ZkWalletClient, ZkProverClient } from "@shinami/clients";
import { getZkLoginSignature, genAddressSeed } from "@mysten/zklogin";
import { JwtPayload, jwtDecode } from "jwt-decode";

type PartialZkLoginSignature = Omit<
  Parameters<typeof getZkLoginSignature>["0"]["inputs"],
  "addressSeed"
>;

export const getProfile = new aws.lambda.CallbackFunction("getProfile", {
  callback: async (event: APIGatewayProxyEventV2) => {
    console.log("Event: ", event);
    // const { Cookie } = event.headers;
    // if (!Cookie)
    //   return {
    //     statusCode: 400,
    //     body: "Cookie not Found",
    //   };
    // const jwt = Cookie.split("=")[1];
    const { code, state: encodedState } = event.queryStringParameters || {};
    if (!code || !encodedState) {
      return {
        statusCode: 400,
        body: "Code and/or State not Found",
      };
    }

    // const state = JSON.parse(decodeURIComponent(encodedState));
    // //const walletAccessKey = process.env.SHINAMI_WALLET_ACCESS_KEY!;
    // // TODO:
    // const walletAccessKey = "1cb2a0622c007218a6c9550f25d07fa6";
    // const zkw = new ZkWalletClient(walletAccessKey);
    // const { salt, address: zkLoginUserAddress } =
    //   await zkw.getOrCreateZkLoginWallet(jwt);

    // const zkp = new ZkProverClient(walletAccessKey);

    // const { maxEpoch, ephemeralPublicKey, jwtRandomness } = state;

    // const { zkProof } = await zkp.createZkLoginProof(
    //   jwt,
    //   maxEpoch,
    //   ephemeralPublicKey,
    //   jwtRandomness,
    //   salt
    // );

    // const partialZkLoginSignature = zkProof as PartialZkLoginSignature;

    // const decodedJwt = jwtDecode<JwtPayload>(jwt);
    // let { sub, aud } = decodedJwt;
    // if (!sub || !aud) {
    //   return {
    //     statusCode: 400,
    //     body: "Sub and/or Aud not found in JWT",
    //   };
    // }

    // if (typeof aud !== "string") {
    //   aud = aud[0];
    // }
    // const addressSeed = genAddressSeed(salt, "sub", sub, aud).toString();

    // const inputs = {
    //   ...partialZkLoginSignature,
    //   addressSeed,
    // };

    // return {
    //   statusCode: 200,
    //   headers: {
    //     "Access-Control-Allow-Origin": "https://fantura.vercel.app",
    //     "Access-Control-Allow-Credentials": true,
    //   },
    //   body: JSON.stringify({
    //     zkLoginUserAddress,
    //     inputs,
    //   }),
    // };
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