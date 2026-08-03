"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthProvider";
import { toast } from "sonner";

export type TradingAccount = {
  id: string;
  user_id: string;
  name: string;
  broker: string | null;
  type: string | null;
};

type AccountContextType = {
  accounts: TradingAccount[];
  currentAccount: TradingAccount | null;
  setCurrentAccount: (account: TradingAccount) => void;
  refreshAccounts: () => Promise<void>;
  addAccount: (name: string) => Promise<TradingAccount | null>;
};

const AccountContext = createContext<AccountContextType | undefined>(
  undefined
);

export function AccountProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { session } = useAuth();

  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [currentAccount, setCurrentAccount] =
    useState<TradingAccount | null>(null);

  async function refreshAccounts() {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at");

    if (error) {
      console.error(error);
      return;
    }

    setAccounts(data ?? []);

    if (!currentAccount && data?.length) {
      setCurrentAccount(data[0]);
    }
  }

async function addAccount(name: string) {
  if (!session?.user) return null;
  const trimmedName = name.trim();

  const existing = accounts.find(
    (account) =>
      account.name.toLowerCase() === trimmedName.toLowerCase()
  );

  if (existing) {
    toast.error("Account already exists", {
  description: "Choose a different account name.",
});

return null;
  }

  const { data, error } = await supabase
    .from("accounts")
    .insert({
      user_id: session.user.id,
      name: trimmedName,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  await refreshAccounts();

  setCurrentAccount(data);

  return data;
}

  useEffect(() => {
    refreshAccounts();
  }, [session]);

  return (
    <AccountContext.Provider
      value={{
        accounts,
        currentAccount,
        setCurrentAccount,
        refreshAccounts,
        addAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error(
      "useAccount must be used inside AccountProvider"
    );
  }

  return context;
}