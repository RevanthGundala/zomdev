import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as apigateway from "@pulumi/aws-apigateway";

import { getProfile, oauthGoogleCallback } from "./aws/lambdas/index";

// A REST API to route requests to HTML content and the Lambda function
const api = new apigateway.RestAPI("api", {
  routes: [
    {
      path: "/oauth2/google-callback",
      method: "GET",
      eventHandler: oauthGoogleCallback,
    },
    {
      path: "/get-profile",
      method: "GET",
      eventHandler: getProfile,
    },
  ],
});

// The URL at which the REST API will be served.
export const url = api.url;
