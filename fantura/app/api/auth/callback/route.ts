import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  // TODO: Uncomment when supabase fixes bug
  // const location = requestUrl.searchParams.get("state");
  const location = "profile";
  console.log("Location: ", location);
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient();
    const res = await supabase.auth.exchangeCodeForSession(code);
    console.log("Res: ", res);
  } else {
    console.log("Code not found in request");
  }

  // URL to redirect to after sign up process completes
  console.log("Redirecting to /", location);
  return NextResponse.redirect(`${origin}/${location}`);
}
