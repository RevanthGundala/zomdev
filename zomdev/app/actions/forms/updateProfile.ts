"use server";
import { createClient } from "@/utils/supabase/server";
import { getProfile } from "../auth/getProfile";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const { data: user, error: userError } = await getProfile();
  if (userError) return { data: null, error: "Error getting user data" };

  const email =
    formData.get("email") !== ""
      ? (formData.get("email") as string)
      : user?.email;

  const name =
    formData.get("name") !== "" ? (formData.get("name") as string) : user?.name;
  const company =
    formData.get("company") !== ""
      ? (formData.get("company") as string)
      : user?.company;

  const supabase = createClient();
  const { data: updatedData, error: updatedError } = await supabase
    .from("Users")
    .update({ name, company, email })
    .eq("id", user?.id)
    .select();

  if (updatedError) return { data: null, error: "Error updating user db data" };

  revalidatePath("/profile");
  console.log("Profile updated", updatedData);
  return { data: updatedData, error: null };
}
