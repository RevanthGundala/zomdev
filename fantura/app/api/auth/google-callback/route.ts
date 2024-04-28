// TODO: Move to callback and encode in State object when Supabase fixes bug
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const location = "";
  const origin = requestUrl.origin;

  if (code) {
    const clientId =
      "641538649125-s3phe3ct5t940moj2mg4svf0n4b1bre4.apps.googleusercontent.com";
    const clientSecret = "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";
    const redirectUri = `http://localhost:3000/api/auth/google-callback`;

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
      const { id_token } = await response.json();
      cookies().set({
        name: "jwt",
        value: id_token,
        httpOnly: true,
        path: "/",
        secure: true,
      });
      // URL to redirect to after sign up process completes
      return NextResponse.redirect(`http://localhost:3000`);
    } catch (e) {
      console.log("error: ", e);
    }
  } else {
    console.log("Code not found in request");
  }
}
