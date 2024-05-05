"use server";
import { createClient } from "@/utils/supabase/server";
export async function joinWaitlist(formData: FormData) {
  const supabase = createClient();
  const email = formData.get("email");
  if (!email) {
    console.error("No email provided");
    return;
  }
  const { error } = await supabase.from("Waitlist").insert([{ email: email }]);
  if (error) {
    console.error("Error adding to waitlist: ", error);
  }
}
