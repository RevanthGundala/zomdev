"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logOut(): Promise<void> {
  try {
    cookies()
      .getAll()
      .forEach((cookie) => {
        cookies().delete(cookie.name);
      });
    redirect("/");
  } catch (e) {
    console.log("Error: ", e);
  }
}
