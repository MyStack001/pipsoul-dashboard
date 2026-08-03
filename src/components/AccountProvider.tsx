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