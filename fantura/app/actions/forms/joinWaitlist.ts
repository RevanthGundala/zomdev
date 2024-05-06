"use server";
import { createClient } from "@/utils/supabase/server";

export async function joinWaitlist(
  prevState: any,
  formData: FormData,
): Promise<any> {
  const supabase = createClient();
  const email = formData.get("email");
  if (!email) {
    console.error("No email provided");
    return;
  }
  const { error } = await supabase.from("Waitlist").upsert([{ email: email }]);
  if (error) {
    console.error("Error adding to waitlist: ", error);
    return {
      error: {
        email: "There was an error with this email",
      },
      message: "Failed submission",
    };
  } else {
    console.log("Successfully added to waitlist: ", email);
    formData.set("email", "");
    return { error: null, message: `Successfully added ${email}` };
  }
}
