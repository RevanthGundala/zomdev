"use client";

import { useZkLoginState } from "../contexts/zkLoginState";
import { useZkLoginSession } from "../contexts/zkLoginSession";
import { useEffect, useState } from "react";
import { getZkp } from "@/app/actions/auth/getZkp";
import { unstable_noStore as noStore } from "next/cache";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { deserializeZkLoginState } from "@/app/actions/contract/helpers/serde";
import { logOut } from "@/app/actions/auth/logOut";
import { getSuiClient } from "@/app/actions/contract/helpers/getSuiClient";
import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";

export function useZkp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { zkLoginState, removeZkLoginState } = useZkLoginState();
  const { zkLoginSession, setZkLoginSession, removeZkLoginSession } =
    useZkLoginSession();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  async function isPassedMaxEpoch(): Promise<boolean> {
    // const client = await getSuiClient();
    const client = new SuiClient({
      url: getFullnodeUrl(
        process.env.NEXT_PUBLIC_SUI_NETWORK === "mainnet"
          ? "mainnet"
          : "testnet"
      ),
    });
    const { epoch } = await client.getLatestSuiSystemState();
    const { maxEpoch } = await deserializeZkLoginState(zkLoginState);
    return parseFloat(epoch) > maxEpoch;
  }

  useEffect(() => {
    const checkEpochAndLogin = async () => {
      try {
        setIsLoading(true);
        if (!isAuthenticated) {
          router.push("/login");
        }
        const hasPassedMaxEpoch = await isPassedMaxEpoch();

        if (hasPassedMaxEpoch) {
          console.log("Max epoch passed, logging out");
          removeZkLoginState();
          removeZkLoginSession();
          await logOut();
          console.log("Logged out");
        } else if (zkLoginSession === "{}" || zkLoginSession === "") {
          console.log("No zkLoginSession found, fetching ZKP");
          const { data, error } = await getZkp(zkLoginState as string);
          if (error) {
            console.log("Error fetching ZKP:", error);
            setError(error);
            return;
          }

          setZkLoginSession(
            JSON.stringify({
              zkLoginUserAddress: data?.zkLoginUserAddress,
              inputs: data?.inputs,
            })
          );
        } else {
          console.log("zkLoginSession already exists");
        }
      } catch (e) {
        console.log("Error in checkEpochAndLogin:", e);
      } finally {
        setIsLoading(false);
        console.log("Finished epoch check and login");
      }
    };

    checkEpochAndLogin();
  }, []);

  return { isLoading, error };
}
