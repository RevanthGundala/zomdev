import * as aws from "@pulumi/aws";
import { APIGatewayProxyEventV2 } from "aws-lambda";

// A Lambda function to invoke
export const loginCallback = new aws.lambda.CallbackFunction("loginCallback", {
  callback: async (event: APIGatewayProxyEventV2) => {
    const url = "https://fantura.vercel.app";

    const { code } = event.queryStringParameters || {};
    if (!code) {
      return {
        statusCode: 400,
        body: "Code not Found",
      };
    }

    // TODO: Move to cloud environment variables for security
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    const data = {
      grant_type: "authorization_code",
      clientId,
      clientSecret,
      redirectUri,
      code,
    };

    try {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      // Extract JWT from claims
      const { id_token: jwt } = await response.json();
      return {
        statusCode: 302,
        headers: {
          "Set-Cookie": `testCookie=12345; Path=/; Domain=https://gaa876jg49.execute-api.us-west-2.amazonaws.com; SameSite=Lax; HttpOnly; Max-Age=3600;`,
          Location: url,
        },
      };
    } catch (e) {
      console.log("error: ", e);
      return {
        statusCode: 400,
        body: "Internal Server Error: Failed to get JWT",
      };
    }
  },
  runtime: "nodejs18.x",
});
