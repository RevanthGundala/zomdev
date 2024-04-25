import * as aws from "@pulumi/aws";
import { APIGatewayProxyEventV2 } from "aws-lambda";

// A Lambda function to invoke
export const oauthGoogleCallback = new aws.lambda.CallbackFunction(
  "oauthGoogleCallback",
  {
    callback: async (event: APIGatewayProxyEventV2) => {
      const url = "https://fantura.vercel.app/";

      const { code } = event.queryStringParameters || {};
      if (!code) {
        return {
          statusCode: 400,
          body: "Code not Found",
        };
      }

      // TODO: Pass in env from cloud - process.env is not available
      const clientId =
        "641538649125-s3phe3ct5t940moj2mg4svf0n4b1bre4.apps.googleusercontent.com";
      const clientSecret = "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";
      const redirectUri =
        "https://gaa876jg49.execute-api.us-west-2.amazonaws.com/stage/oauth2/google-callback";

      const body = {
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
          body: JSON.stringify(body),
        });
        // Extract JWT from claims
        const { id_token: jwt } = await response.json();
        // TODO: Specify domain
        return {
          statusCode: 302,
          headers: {
            "Set-Cookie": `jwt=${jwt}; Path=/; SameSite=None; Secure; HttpOnly; Max-Age=3600;`,
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
  }
);
