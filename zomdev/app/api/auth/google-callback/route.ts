import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { jwtDecode } from "jwt-decode";
import { getProfile } from "@/app/actions/auth/getProfile";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const location = "";
  const origin = requestUrl.origin;

  if (code) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;

    const body = {
      grant_type: "authorization_code",
      clientId,
      clientSecret,
      redirectUri,
      code,
    };

    console.log("Body: ", body);

    try {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      // Extract JWT from claims
      console.log("Response: ", response);
      const claims = await response.json();
      console.log("Claims: ", claims);
      const { id_token, access_token } = claims;

      // TODO: Remove cookies and use supabase session instead
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

      const { data, error: profileError } = await getProfile();
      console.log("Data: ", data);
      if (profileError) {
        console.log("Error: ", profileError);
        return NextResponse.redirect(`${origin}/signup`);
      } else if (data?.length === 0 || !data)
        return NextResponse.redirect(`${origin}/signup`);
    } catch (e) {
      console.log("error: ", e);
    }

    // URL to redirect to after sign up process completes
  } else {
    console.log("Code not found in request");
  }
  return NextResponse.redirect(`${origin}/${location}`);
}
