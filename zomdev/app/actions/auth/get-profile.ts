"use server";

import { createClient } from "@/utils/supabase/server";

export async function getProfile() {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) return { data: null, error: "Error getting user auth data" };

  // TODO: Set auth email to be foreign relation key
  const { data, error } = await supabase
    .from("Users")
    .select("*")
    .eq("auth_email", userData?.user?.email);

  if (error) return { data: null, error: "Error getting user db data" };

  return { data: data, error: null };
}
