"use server";
import { createClient } from "@/utils/supabase/server";

export async function getUsers() {
  const supabase = createClient();
  const { data, error } = await supabase.from("Users").select("*");
  if (error) return { data: null, error: "Error getting users" };
  return { data: data, error: null };
}
