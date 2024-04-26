import * as aws from "@pulumi/aws";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ZkWalletClient, ZkProverClient } from "@shinami/clients";
import {
  getZkLoginSignature,
  genAddressSeed,
  generateRandomness,
} from "@mysten/zklogin";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";

type PartialZkLoginSignature = Omit<
  Parameters<typeof getZkLoginSignature>["0"]["inputs"],
  "addressSeed"
>;

export const getProfile = new aws.lambda.CallbackFunction("getProfile", {
  callback: async (event: APIGatewayProxyEventV2) => {
    const { Cookie } = event.headers;
    if (!Cookie)
      return {
        statusCode: 400,
        body: "Cookie not Found",
      };
    const jwt = Cookie.split("=")[1];

    //const walletAccessKey = process.env.SHINAMI_WALLET_ACCESS_KEY!;
    // TODO:
    const walletAccessKey = "1cb2a0622c007218a6c9550f25d07fa6";
    const zkw = new ZkWalletClient(walletAccessKey);
    const { salt, address: zkLoginUserAddress } =
      await zkw.getOrCreateZkLoginWallet(jwt);

    const zkp = new ZkProverClient(walletAccessKey);

    const client = new SuiClient({ url: getFullnodeUrl("testnet") });
    const { epoch } = await client.getLatestSuiSystemState();
    const maxEpoch = Number(epoch) + 2;
    const ephemeralKey = new Ed25519Keypair();
    const jwtRandomness = generateRandomness();

    const { zkProof } = await zkp.createZkLoginProof(
      jwt,
      maxEpoch,
      ephemeralKey.getPublicKey(),
      BigInt(jwtRandomness),
      salt
    );

    const partialZkLoginSignature = zkProof as PartialZkLoginSignature;

    const decodedJwt = jwtDecode<JwtPayload>(jwt);
    let { sub, aud } = decodedJwt;
    if (!sub || !aud) {
      return {
        statusCode: 400,
        body: "Sub and/or Aud not found in JWT",
      };
    }

    if (typeof aud !== "string") {
      aud = aud[0];
    }
    const addressSeed = genAddressSeed(salt, "sub", sub, aud).toString();

    const inputs = {
      ...partialZkLoginSignature,
      addressSeed,
    };

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://fantura.vercel.app",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        zkLoginUserAddress,
        maxEpoch,
        ephemeralKey,
        inputs,
      }),
    };
  },
  runtime: "nodejs18.x",
});
