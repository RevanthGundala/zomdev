// TODO: Move to callback and encodes location in State object when Supabase fixes bug
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { jwtDecode } from "jwt-decode";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const location = "";
  const origin = requestUrl.origin;

  if (code) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;

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
      const claims = await response.json();
      const { id_token, access_token } = claims;
      cookies().set({
        name: "jwt",
        value: id_token,
        httpOnly: true,
        path: "/",
        secure: true,
      });

      // Set main session for supabase auth linking
      const supabase = createClient();
      const decodedjwt = jwtDecode(id_token) as any;
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: id_token,
        access_token: access_token,
        nonce: decodedjwt.nonce,
      });
      if (error) {
        console.log("Supabase signInWithIdToken: ", error);
      }
    } catch (e) {
      console.log("error: ", e);
    }

    // URL to redirect to after sign up process completes
  } else {
    console.log("Code not found in request");
  }
  return NextResponse.redirect(`${origin}/${location}`);
}
