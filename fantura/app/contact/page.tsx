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
import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function sendEmail() {}

  return (
    <div className="w-full max-w-2xl space-y-8 mt-40 mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Please fill in the form below to get in touch.
        </p>
      </div>
      <form className="space-y-4" onSubmit={sendEmail}>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            className="min-h-[100px]"
            id="message"
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
