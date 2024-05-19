"use server";

// Validate form data server side
import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { addCompany } from "../contract/calls/company";
import { deserializeZkLoginSession } from "../contract/helpers/serde";

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

export async function signUpCompany(
  session: string,
  state: string,
  formData: FormData
) {
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

  // TODO: Set auth email to be foreign relation key
  const supabase = createClient();
  const { data, error: dbError } = await supabase.auth.getUser();
  if (dbError) {
    console.error("Error getting user auth data: ", dbError);
    return;
  }

  const { zkLoginUserAddress } = await deserializeZkLoginSession(session);
  const { data: companyId, error: companyError } = await addCompany(
    state,
    session,
    company
  );
  if (companyError) {
    console.error("Error adding company: ", companyError);
    return;
  }

  const { error } = await supabase.from("Users").insert([
    {
      name: name,
      company: company,
      company_id: companyId,
      email: email,
      auth_email: data.user.email,
      address: zkLoginUserAddress,
    },
  ]);

  if (error) {
    console.error("Error signing up: ", error);
    return;
  } else {
    redirect("/signup/success");
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

export async function signUpUser(
  session: string,
  _state: string,
  formData: FormData
) {
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
  const { data, error: dbError } = await supabase.auth.getUser();
  if (dbError) {
    console.error("Error getting user auth data: ", dbError);
    return;
  }
  const { zkLoginUserAddress } = await deserializeZkLoginSession(session);
  const { error } = await supabase.from("Users").insert([
    {
      name: name,
      email: email,
      auth_email: data.user.email,
      address: zkLoginUserAddress,
    },
  ]);

  if (error) {
    console.error("Error signing up: ", error);
  } else {
    console.log("Sign Up successful!: ", data);
    redirect("/signup/success");
  }
}
