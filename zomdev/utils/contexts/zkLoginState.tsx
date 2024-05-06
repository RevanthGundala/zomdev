"use client";

import React, { createContext, useContext } from "react";
import { useSessionStorage } from "usehooks-ts";

type ZkLoginStateContextProviderProps = {
  children: React.ReactNode;
};

type ZkLoginStateContext = {
  zkLoginState: string;
  setZkLoginState: (zkLoginState: string) => void;
  removeZkLoginState: () => void;
};

export const ZkLoginStateContext = createContext<ZkLoginStateContext | null>(
  null,
);

export function ZkLoginStateContextProvider({
  children,
}: ZkLoginStateContextProviderProps) {
  const [zkLoginState, setZkLoginState, removeZkLoginState] = useSessionStorage(
    "zkLoginState",
    "{}",
  );

  return (
    <ZkLoginStateContext.Provider
      value={{ zkLoginState, setZkLoginState, removeZkLoginState }}
    >
      {children}
    </ZkLoginStateContext.Provider>
  );
}

export function useZkLoginState() {
  const context = useContext(ZkLoginStateContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionContextProvider");
  }
  return context;
}
