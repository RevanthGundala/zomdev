"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Provider, User } from "@supabase/supabase-js";

type Account = {
  provider: Provider;
  scopes: string;
  img: string;
  connected: boolean;
  supported: boolean;
};

export default function ConnectedAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([
    {
      provider: "discord",
      scopes: "openid",
      img: "./google.png",
      connected: false,
      supported: true,
    },
    {
      provider: "twitter",
      scopes: "tweet.read users.read follows.read offline.access",
      img: "./google.png",
      connected: false,
      supported: false,
    },
    {
      provider: "twitch",
      scopes: "openid",
      img: "./google.png",
      connected: false,
      supported: false,
    },
    {
      provider: "facebook",
      scopes: "openid",
      img: "./google.png",
      connected: false,
      supported: false,
    },
    {
      provider: "spotify",
      scopes: "openid",
      img: "./google.png",
      connected: false,
      supported: false,
    },
  ]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchUser() {
      const { data, error: identityError } =
        await supabase.auth.getUserIdentities();
      if (identityError) {
        console.error("Error getting identities: ", identityError);
        return;
      }

      // Map through accounts to create a new array with updated connection statuses
      const updatedAccounts = accounts.map((account) => ({
        ...account,
        connected:
          data?.identities.some(
            (identity) => identity.provider === account.provider
          ) || false,
      }));

      setAccounts(updatedAccounts); // Use the setter function to update the state
    }

    fetchUser();
  }, []);

  async function connect(provider: Provider, scopes: string) {
    console.log("Connecting: ", provider);
    const { data, error } = await supabase.auth.linkIdentity({
      provider: provider,
      options: {
        scopes: scopes,
        // TODO: Supabase bug: State parameter not working as intended
        // queryParams: {
        //   state: "profile",
        // },
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) {
      console.error("Error signing in: ", error);
    }
    console.log("data: ", data);
  }

  async function disconnect(provider: Provider) {
    console.log("Disconnecting: ", provider);
    // Check if they are actually connected
    const { data, error: identityError } =
      await supabase.auth.getUserIdentities();
    if (identityError) {
      console.error("Error getting identities: ", identityError);
      return;
    }

    // find the identity
    const identityToDisconnect = data?.identities.find(
      (identity) => identity.provider === provider
    );
    if (!identityToDisconnect) {
      console.error("Identity not found");
      return;
    }

    // unlink the identity
    const { error } = await supabase.auth.unlinkIdentity(identityToDisconnect);
    if (error) {
      console.error("Error signing out: ", error);
    }

    // Update state
    const updatedAccounts = accounts.map((account) => ({
      ...account,
      connected: account.connected && account.provider !== provider,
    }));

    setAccounts(updatedAccounts);
  }

  function AccountDisplay({ account }: { account: Account }) {
    const { provider, scopes, img, connected, supported } = account;

    return (
      <div className="flex items-center border-b border-gray-200 px-2 py-2">
        <div className="flex flex-1 space-x-4">
          <img src={img} alt={provider} className="h-6 w-6 rounded-full" />
          <span>
            {provider.charAt(0).toUpperCase() + provider.substring(1)}
          </span>
        </div>
        <div>
          {connected ? (
            <button
              className="rounded-lg min-w-fit px-4 border-2 py-1 border-red-200 hover:border-red-400 hover:bg-red-200"
              onClick={() => disconnect(provider)}
            >
              Disconnect
            </button>
          ) : (
            <button
              className="rounded-lg min-w-fit px-4 border-2 py-1 border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={() => connect(provider, scopes)}
              disabled={!supported}
            >
              {supported ? "Connect" : "Coming Soon"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-40 space-y-6">
      <h1 className="text-2xl ">Connected Accounts</h1>
      <div className="flex flex-col border-l border-r border-b rounded-lg w-1/4 h-1/2 shadow-md">
        <div className="bg-gray-200 rounded-t-lg border-b border-gray-200 py-2 px-4">
          Search
        </div>
        {accounts.map((account, i) => (
          <AccountDisplay key={i} account={account} />
        ))}
      </div>
    </div>
  );
}
