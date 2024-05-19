"use client";
import React from "react";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui.js/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ZkLoginSessionContextProvider } from "@/utils/contexts/zkLoginSession";
import { ZkLoginStateContextProvider } from "@/utils/contexts/zkLoginState";
import "@mysten/dapp-kit/dist/index.css";

// Config options for the networks you want to connect to
const { networkConfig } =
  process.env.NEXT_PUBLIC_SUI_NETWORK === "mainnet"
    ? createNetworkConfig({
        mainnet: { url: getFullnodeUrl("mainnet") },
      })
    : createNetworkConfig({
        testnet: { url: getFullnodeUrl("testnet") },
      });
const queryClient = new QueryClient();

export default function SuiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig}>
        <WalletProvider
          stashedWallet={{
            name: "Zomdev",
          }}
        >
          <ZkLoginStateContextProvider>
            <ZkLoginSessionContextProvider>
              {children}
            </ZkLoginSessionContextProvider>
          </ZkLoginStateContextProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
