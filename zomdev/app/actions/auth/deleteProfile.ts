"use server";
import { createClient } from "@/utils/supabase/server";
import { getProfile } from "./getProfile";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function deleteProfile() {
  const supabase = createClient();
  const { data: userData, error: userError } = await getProfile();
  if (userError) return { data: null, error: "Error getting user auth data" };
  const { data, error } = await supabase
    .from("Users")
    .delete()
    .eq("id", userData?.id)
    .single();
  if (error) return { data: null, error: "Error deleting user" };
  cookies()
    .getAll()
    .forEach((cookie) => {
      cookies().delete(cookie.name);
    });
  redirect("/delete-profile");
}
