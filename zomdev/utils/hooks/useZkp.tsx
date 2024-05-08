"use client";

import { useZkLoginState } from "../contexts/zkLoginState";
import { useZkLoginSession } from "../contexts/zkLoginSession";
import { useEffect, useState } from "react";
import { getZkp } from "@/app/actions/auth/getZkp";
import { unstable_noStore as noStore } from "next/cache";

export function useZkp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { zkLoginState } = useZkLoginState();
  const { setZkLoginSession, zkLoginSessionExists } = useZkLoginSession();

  useEffect(() => {
    // TODO: Need to refetch when signature is expired

    noStore();
    if (zkLoginSessionExists) return; // TODO: Add an IsSignedIn function
    setIsLoading(true);
    getZkp(zkLoginState)
      .then((res) => {
        const { data, error } = res;
        if (error) {
          console.log("Error: ", error);
          setError(error);
          return;
        }
        // We know data is not null
        console.log("Data: ", data);

        setZkLoginSession(
          JSON.stringify({
            zkLoginUserAddress: data?.zkLoginUserAddress,
            inputs: data?.inputs,
          })
        );
      })
      .catch((e) => console.log(e));
    setIsLoading(false);
  }, []);

  return { isLoading, error };
}
