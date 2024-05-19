import { cn } from "../utils/shadcn-ui";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { CSPostHogProvider } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import SuiProvider from "@/components/SuiProvider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Zomdev",
  description: "Hire Top Talent with Our Developer Bounty Platform",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SuiProvider>
      <html lang="en" suppressHydrationWarning className="overflow-y-auto">
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          {children}
          <Toaster />
          <Analytics />
        </body>
      </html>
    </SuiProvider>
  );
}
