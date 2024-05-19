"use client";

import { cn } from "../utils/shadcn-ui";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { ZkLoginSessionContextProvider } from "@/utils/contexts/zkLoginSession";
import { ZkLoginStateContextProvider } from "@/utils/contexts/zkLoginState";
import { Toaster } from "@/components/ui/toaster";
import { CSPostHogProvider } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui.js/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@mysten/dapp-kit/dist/index.css";
import { useZkp } from "@/utils/hooks/useZkp";

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});
const queryClient = new QueryClient();

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// export const metadata: Metadata = {
//   metadataBase: new URL(defaultUrl),
//   title: "Zomdev",
//   description: "Hire Top Talent with Our Developer Bounty Platform",
// };

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
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider
          stashedWallet={{
            name: "Zomdev",
          }}
        >
          <ZkLoginStateContextProvider>
            <ZkLoginSessionContextProvider>
              <html
                lang="en"
                suppressHydrationWarning
                className="overflow-y-auto"
              >
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
            </ZkLoginSessionContextProvider>
          </ZkLoginStateContextProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
