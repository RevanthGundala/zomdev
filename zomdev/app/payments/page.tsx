"use client";
import { ConnectKitButton as EvmConnectButton } from "connectkit";
import { useAccount } from "wagmi";
import {
  ConnectButton as SuiConnectButton,
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
import SquarePaymentForm from "@/components/SquarePaymentForm";
import {
  ApplePay,
  CashAppPay,
  CreditCard,
  GooglePay,
} from "react-square-web-payments-sdk";
import BackButton from "@/components/ui/back-button";
import { squarePay } from "../actions/square/pay";
/*
 * v0 by Vercel.
 * @see https://v0.dev/t/Jy5JEGeH6Tm
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

export default function Payments() {
  const usdcType =
    process.env.NEXT_PUBLIC_SUI_NETWORK === "mainnet" ? USDC_TYPE : SUI_TYPE;
  const { zkLoginState } = useZkLoginState();
  const { zkLoginSession } = useZkLoginSession();
  const { connectionStatus } = useCurrentWallet();
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

  async function cardTokenizeResponseReceived(token: any, verifiedBuyer: any) {
    alert("Credit Card Not Supported Yet");
    const { data, error } = await squarePay(token, reward ?? 1);
    if (!data || error?.length) {
      alert("Error paying with Square");
      return;
    }

    console.log("Square payment response", data);
    removeCheckout();
    router.push("/payments/success");
  }

  function createPaymentRequest() {
    return {
      countryCode: "US",
      currencyCode: "USD",
      total: {
        amount: reward?.toString(),
        label: "Total",
      },
    };
  }
  return (
    <SquarePaymentForm
      cardTokenizeResponseReceived={cardTokenizeResponseReceived}
      createPaymentRequest={createPaymentRequest}
    >
      <div className="mt-40 gap-6 w-full max-w-5xl mx-auto py-12 px-4 md:px-6">
        <div className="mt-30 bg-gray-100 dark:bg-gray-800 rounded-lg p-6 flex flex-col gap-4 h-fit ">
          <div className="space-y-4">
            <div className="text-2xl font-semibold text-center">
              Buy with USDC
            </div>
            <div className="text-center">
              {" "}
              <SuiConnectButton connectText="Sui Wallet" />
            </div>

            <h3 className="text-lg font-semibold">Order Summary</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Review your order details.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${reward?.toString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tip</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${reward?.toString()}</span>
            </div>
          </div>
          {connectionStatus === "connected" && (
            <Button className="w-full" onClick={pay}>
              {parseFloat(balance?.totalBalance ?? "1000000000") < (reward ?? 0)
                ? `Insufficient Balance. Required: ${reward} USDC`
                : `Pay with crypto`}
            </Button>
          )}
        </div>
      </div>
    </SquarePaymentForm>
  );
  // return (
  //   <>
  //     <div className="px-20 mb-10 mt-40 min-h-screen">
  //       <div className="flex flex-col items-center space-y-8">
  //         <h1 className="text-4xl font-semibold">Checkout</h1>
  //         <div className="flex flex-col justify-center space-y-4 my-4">
  //           <SquarePaymentForm createPaymentRequest={createPaymentRequest}>
  //             <ul className="space-y-8">
  //               <CashAppPay />
  //               <ApplePay />
  //               <li>
  //                 <GooglePay />
  //               </li>
  //               <li>
  //                 <CreditCard />
  //               </li>
  //             </ul>
  //           </SquarePaymentForm>
  //           {connectionStatus !== "connected" ? (
  //             <ConnectButton>Connect Sui Wallet</ConnectButton>
  //           ) : (
  //             <>
  //               <img src={currentWallet.icon} className="mx-auto" />{" "}
  //               <p className="text-xl">{currentWallet.name}</p>
  //             </>
  //           )}
  //         </div>
  //         <div className="flex justify-center items-center space-x-2">
  //           <Input
  //             placeholder={reward?.toString()}
  //             disabled
  //             className="w-1/2"
  //           />
  //           <p>USDC</p>
  //         </div>
  //         <Button
  //           onClick={pay}
  //           disabled={connectionStatus !== "connected"}
  //           className="bg-green-500 disabled:opacity-70 my-4"
  //         >
  //           {!isLoading
  //             ? connectionStatus !== "connected"
  //               ? "Connect a Wallet"
  //               : balance &&
  //                 reward &&
  //                 parseFloat(balance?.totalBalance) < reward
  //               ? `Insufficient Balance. Required: ${reward} USDC`
  //               : `Pay to ${winner}`
  //             : "Loading..."}
  //         </Button>
  //       </div>
  //     </div>
  //   </>
  // );
}
