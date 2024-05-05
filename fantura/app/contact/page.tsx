/**
 * v0 by Vercel.
 * @see https://v0.dev/t/oYvRX9AiaKF
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { useFormStatus } from "react-dom";
import { contactUs } from "../actions/email/contactUs";
import Footer from "@/components/Footer";

export default function Contact() {
  const { pending } = useFormStatus();
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <div className="w-full max-w-2xl space-y-8 mt-40 mx-auto">
          <Card className="p-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Contact Us</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Please fill in the form below to get in touch.
              </p>
            </div>
            <form className="py-2 space-y-4" action={contactUs}>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Enter your subject"
                  type="subject"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  className="min-h-[100px]"
                  name="message"
                  placeholder="Enter your message"
                  required
                />
              </div>
              <Button className="mt-10" type="submit" disabled={pending}>
                Submit
              </Button>
            </form>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
