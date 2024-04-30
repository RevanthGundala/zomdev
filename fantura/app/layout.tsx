import { cn } from "../utils/shadcn-ui";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { ZkLoginSessionContextProvider } from "@/utils/contexts/zkLoginSession";
import { ZkLoginStateContextProvider } from "@/utils/contexts/zkLoginState";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Fantura",
  description: "",
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
        <html lang="en" suppressHydrationWarning>
          <head />
          <body
            className={cn(
              "min-h-screen bg-background font-sans antialiased",
              fontSans.variable,
            )}
          >
            {children}
          </body>
        </html>
      </ZkLoginSessionContextProvider>
    </ZkLoginStateContextProvider>
  );
}
