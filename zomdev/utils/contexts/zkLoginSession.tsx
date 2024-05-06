"use client";

import React, { createContext, useContext } from "react";
import { useSessionStorage } from "usehooks-ts";

type ZkLoginSessionContextProviderProps = {
  children: React.ReactNode;
};

type ZkLoginSessionContext = {
  zkLoginSession: string;
  setZkLoginSession: (ZkLoginSession: string) => void;
  removeZkLoginSession: () => void;
  zkLoginSessionExists: boolean;
};

export const ZkLoginSessionContext =
  createContext<ZkLoginSessionContext | null>(null);

export function ZkLoginSessionContextProvider({
  children,
}: ZkLoginSessionContextProviderProps) {
  const [zkLoginSession, setZkLoginSession, removeZkLoginSession] =
    useSessionStorage("zkLoginSession", "{}");
  const zkLoginSessionExists = zkLoginSession !== "{}";

  return (
    <ZkLoginSessionContext.Provider
      value={{
        zkLoginSession,
        setZkLoginSession,
        removeZkLoginSession,
        zkLoginSessionExists,
      }}
    >
      {children}
    </ZkLoginSessionContext.Provider>
  );
}

export function useZkLoginSession() {
  const context = useContext(ZkLoginSessionContext);
  if (!context) {
    throw new Error(
      "useZkLoginSession must be used within a ZkLoginSessionContextProvider",
    );
  }
  return context;
}
