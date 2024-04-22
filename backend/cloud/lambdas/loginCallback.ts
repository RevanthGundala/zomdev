import * as aws from "@pulumi/aws";
import { APIGatewayProxyEventV2 } from "aws-lambda";

// A Lambda function to invoke
export const loginCallback = new aws.lambda.CallbackFunction("loginCallback", {
  callback: async (event: APIGatewayProxyEventV2) => {
    const url = "http://localhost:3000/";

    const { code } = event.queryStringParameters || {};
    if (!code) {
      return {
        statusCode: 400,
        body: "Code not Found",
      };
    }
    // TODO: Move to cloud env
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
          "Set-Cookie":
            "testCookie=123; Path=/; SameSite=None; Secure; Domain=localhost; HttpOnly; Max-Age=31536000;",
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
