"use server";

// Validate form data server side
import { z } from "zod";
import emailjs from "@emailjs/nodejs";
import { redirect } from "next/navigation";

const schema = z.object({
  name: z.string({
    invalid_type_error: "Invalid Name",
  }),
  email: z.string({
    invalid_type_error: "Invalid Email",
  }),
  subject: z.string({
    invalid_type_error: "Invalid Subject",
  }),
  message: z.string({
    invalid_type_error: "Invalid Message",
  }),
});

export async function contactUs(formData: FormData) {
  const validatedFields = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, subject, message } = validatedFields.data;
  const templateParams = {
    name: name,
    subject: subject,
    email: email,
    message: message,
  };

  // Send email
  try {
    const res = await emailjs.send(
      process.env.EMAIL_JS_SERVICE_ID!,
      process.env.EMAIL_JS_TEMPLATE_ID!,
      templateParams,
      {
        publicKey: process.env.EMAIL_JS_PUBLIC_KEY!,
        privateKey: process.env.EMAIL_JS_SECRET_KEY!,
      }
    );
    console.log("Email sent", res);
  } catch (error) {
    console.error("Failed to send email", error);
  }
  redirect("/contact/success");
}
