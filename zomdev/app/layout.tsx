import { cn } from "../utils/shadcn-ui";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { ZkLoginSessionContextProvider } from "@/utils/contexts/zkLoginSession";
import { ZkLoginStateContextProvider } from "@/utils/contexts/zkLoginState";
import { Toaster } from "@/components/ui/toaster";

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
    <ZkLoginStateContextProvider>
      <ZkLoginSessionContextProvider>
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
          </body>
        </html>
      </ZkLoginSessionContextProvider>
    </ZkLoginStateContextProvider>
  );
}
