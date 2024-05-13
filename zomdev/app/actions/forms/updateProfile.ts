"use server";
import { createClient } from "@/utils/supabase/server";
import { getProfile } from "../auth/getProfile";
import { revalidatePath } from "next/cache";

export async function updateProfile(
  prevState: any,
  formData: FormData
): Promise<any> {
  const { data: user, error: userError } = await getProfile();
  if (userError)
    return {
      error: {
        profile: "There was an error",
      },
      message: "Failed submission",
    };

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

  if (updatedError) {
    console.error("Error updating profile: ", updatedError);
    return {
      error: {
        profile: "There was an error",
      },
      message: "Failed submission",
    };
  } else {
    console.log("Successfully updated profile");
    revalidatePath("/profile");
    return { error: null, message: `Successfully updated profile` };
  }
}
