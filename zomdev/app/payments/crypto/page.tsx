"use client";

import {
  ConnectButton,
  useCurrentAccount,
  useCurrentWallet,
  useSignTransactionBlock,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import useCheckout from "@/utils/hooks/useCheckout";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { selectWinnerCrypto } from "@/app/actions/contract/calls/bounty";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { executeSponsoredTxb } from "@/app/actions/contract/helpers/txb";
import { SUI_TYPE, USDC_TYPE } from "@/utils/constants";
import { useZkLoginState } from "@/utils/contexts/zkLoginState";
import { useZkLoginSession } from "@/utils/contexts/zkLoginSession";
import { TransactionBlock } from "@mysten/sui.js/transactions";

export default function Payments() {
  const usdcType =
    process.env.NEXT_PUBLIC_SUI_NETWORK === "mainnet" ? USDC_TYPE : SUI_TYPE;
  const { zkLoginState } = useZkLoginState();
  const { zkLoginSession } = useZkLoginSession();
  const { connectionStatus, currentWallet } = useCurrentWallet();
  const account = useCurrentAccount();
  const { mutate: signTransactionBlock } = useSignTransactionBlock();
  const { data: balance } = useSuiClientQuery(
    "getBalance",
    { owner: account?.address ?? "", coinType: usdcType },
    {
      gcTime: 10000,
    }
  );
  const router = useRouter();

  const { isLoading, companyId, bountyId, winner, reward, removeCheckout } =
    useCheckout();

  useEffect(() => {
    if (isLoading) return;
    console.log("checkout", companyId, bountyId, winner, reward);
    // if (!companyId || !bountyId || !winner || !reward)
    //   router.push("/error?message=Invalid%20checkout%20data");
  }, [account?.address, isLoading, companyId, bountyId, winner, reward]);

  async function pay() {
    try {
      const { data, error } = await selectWinnerCrypto(
        zkLoginState,
        zkLoginSession,
        account?.address,
        companyId,
        bountyId,
        winner,
        reward
      );
      if (error) throw new Error(error);
      const { txBytes, sponsoredResponse } = data!;
      signTransactionBlock(
        {
          transactionBlock: TransactionBlock.from(txBytes),
          chain: `sui:${process.env.NEXT_PUBLIC_SUI_NETWORK}`,
        },
        {
          onSuccess: (result) => {
            console.log("signed transaction block", result);
            executeSponsoredTxb(result.signature, sponsoredResponse)
              .then((tx: any) => console.log(tx))
              .catch((e: any) => console.error(e))
              .finally(() => {
                removeCheckout();
                router.push("/payments/success");
              });
          },
          onError: (error) => {
            console.error("error signing transaction block", error);
            throw new Error();
          },
        }
      );
    } catch (error) {
      console.error("Error paying with crypto:", error);
      router.push(`/error?message=${encodeURIComponent(error as string)}`);
    }
  }
  return (
    <>
      <Navbar />
      <div className="px-20 mb-10 mt-40 min-h-screen">
        <div className="flex flex-col items-center space-y-8">
          <h1 className="text-4xl font-semibold">Pay with Crypto</h1>
          <div className="text-center my-4">
            {connectionStatus !== "connected" ? (
              <ConnectButton>Connect Sui Wallet</ConnectButton>
            ) : (
              <>
                <img src={currentWallet.icon} className="mx-auto" />{" "}
                <p className="text-xl">{currentWallet.name}</p>
              </>
            )}
          </div>
          <div className="flex justify-center items-center space-x-2">
            <Input
              placeholder={reward?.toString()}
              disabled
              className="w-1/2"
            />
            <p>USDC</p>
          </div>
          <Button
            onClick={pay}
            disabled={connectionStatus !== "connected"}
            className="bg-green-500 disabled:opacity-70 my-4"
          >
            {!isLoading
              ? connectionStatus !== "connected"
                ? "Connect a Wallet"
                : balance &&
                  reward &&
                  parseFloat(balance?.totalBalance) < reward
                ? `Insufficient Balance. Required: ${reward} USDC`
                : `Pay to ${winner}`
              : "Loading..."}
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}
