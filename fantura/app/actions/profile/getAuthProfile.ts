"use server";
import { cookies } from "next/headers";

export async function getAuthProfile() {
  const jwt = cookies().get("jwt")?.value;

  if (!jwt) {
    return {
      data: null,
      error: "/actions/getProfile Could not get JWT",
    };
  }

  try {
    const { name, email, picture } = await (
      await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${jwt}`,
      )
    ).json();
    return {
      data: { name, email, picture },
      error: null,
    };
  } catch (e) {
    console.log("Error: ", e);
    return {
      data: null,
      error: "/actions/getProfile failed",
    };
  }
}
