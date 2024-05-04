"use server";

// Validate form data server side
import { z } from "zod";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";

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
  const resend = new Resend(process.env.RESEND_API_KEY!);

  // Send email
  const { data, error } = await resend.emails.send({
    from: `${name} <${email}>`,
    to: [process.env.EMAIL!],
    subject: subject,
    react: message,
  });

  if (error) {
    console.error("Error sending email: ", error);
  } else {
    console.log("Email sent successfully!: ", data);
    formData.set("name", "");
    formData.set("email", "");
    formData.set("subject", "");
    formData.set("message", "");
    revalidatePath("/contact");
  }
}
