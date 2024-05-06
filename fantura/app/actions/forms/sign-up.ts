"use server";

// Validate form data server side
import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const companySchema = z.object({
  name: z.string({
    invalid_type_error: "Invalid Name",
  }),
  company: z.string({
    invalid_type_error: "Invalid Company Name",
  }),
  // logo: z.string({
  //   invalid_type_error: "Invalid Logo",
  // }),
  email: z.string({
    invalid_type_error: "Invalid Email",
  }),
});

export async function signUpCompany(formData: FormData) {
  const validatedFields = companySchema.safeParse({
    name: formData.get("name"),
    company: formData.get("company"),
    // logo: formData.get("logo"),
    email: formData.get("email"),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, company, email } = validatedFields.data;

  // Add to db
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Users")
    .upsert([{ name: name }, { company: company }, { email: email }]);

  if (error) {
    console.error("Error signing up: ", error);
  } else {
    console.log("Sign Up successful!: ", data);
    redirect("/bounties");
  }
}

const userSchema = z.object({
  name: z.string({
    invalid_type_error: "Invalid Name",
  }),
  // logo: z.string({
  //   invalid_type_error: "Invalid Logo",
  // }),
  email: z.string({
    invalid_type_error: "Invalid Email",
  }),
});

export async function signUpUser(formData: FormData) {
  const validatedFields = userSchema.safeParse({
    name: formData.get("name"),
    // logo: formData.get("logo"),
    email: formData.get("email"),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email } = validatedFields.data;

  // Add to db
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Users")
    .insert([{ name: name }, { email: email }]);

  if (error) {
    console.error("Error signing up: ", error);
  } else {
    console.log("Sign Up successful!: ", data);
    redirect("/bounties");
  }
}
