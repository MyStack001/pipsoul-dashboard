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
  renameAccount: (
    id: string,
    name: string
  ) => Promise<void>;
  deleteAccount: (id: string) => Promise<boolean>;
};

const AccountContext =
  createContext<AccountContextType | undefined>(
    undefined
  );

export function AccountProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { session } = useAuth();

  const [accounts, setAccounts] =
    useState<TradingAccount[]>([]);

  const [currentAccount, setCurrentAccountState] =
    useState<TradingAccount | null>(null);

  // =========================
  // ACCOUNT STORAGE KEY
  // =========================

  const getStorageKey = (userId: string) =>
    `pipsoul-current-account-${userId}`;

  // =========================
  // SELECT ACCOUNT
  // =========================

  const setCurrentAccount = (
    account: TradingAccount
  ) => {
    setCurrentAccountState(account);

    if (session?.user?.id) {
      localStorage.setItem(
        getStorageKey(session.user.id),
        account.id
      );
    }
  };

  // =========================
  // LOAD ACCOUNTS
  // =========================

  async function refreshAccounts() {
    if (!session?.user?.id) {
      setAccounts([]);
      setCurrentAccountState(null);
      return;
    }

    const userId = session.user.id;

    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at");

    if (error) {
      console.error(
        "ACCOUNT FETCH ERROR:",
        error.message
      );
      return;
    }

    const loadedAccounts =
      (data ?? []) as TradingAccount[];

    setAccounts(loadedAccounts);

    if (loadedAccounts.length === 0) {
      setCurrentAccountState(null);
      return;
    }

    // =========================
    // RESTORE SAVED ACCOUNT
    // =========================

    const savedAccountId =
      localStorage.getItem(
        getStorageKey(userId)
      );

    const savedAccount = savedAccountId
      ? loadedAccounts.find(
          (account) =>
            account.id === savedAccountId
        )
      : null;

    if (savedAccount) {
      setCurrentAccountState(savedAccount);
      return;
    }

    // =========================
    // DEFAULT TO FIRST ACCOUNT
    // =========================

    setCurrentAccountState(
      loadedAccounts[0]
    );

    localStorage.setItem(
      getStorageKey(userId),
      loadedAccounts[0].id
    );
  }

  // =========================
  // ADD ACCOUNT
  // =========================

  async function addAccount(name: string) {
    if (!session?.user?.id) return null;

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error(
        "Please enter an account name."
      );
      return null;
    }

    const existing = accounts.find(
      (account) =>
        account.name.toLowerCase() ===
        trimmedName.toLowerCase()
    );

    if (existing) {
      toast.error("Account already exists", {
        description:
          "Choose a different account name.",
      });

      return null;
    }

    const { data, error } =
      await supabase
        .from("accounts")
        .insert({
          user_id: session.user.id,
          name: trimmedName,
        })
        .select()
        .single();

    if (error) {
      console.error(
        "ADD ACCOUNT ERROR:",
        error.message
      );

      toast.error(error.message);

      return null;
    }

    await refreshAccounts();

    setCurrentAccount(data);

    return data;
  }

  // =========================
  // RENAME ACCOUNT
  // =========================

  async function renameAccount(
    id: string,
    name: string
  ) {
    if (!session?.user?.id) return;

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error(
        "Account name cannot be empty."
      );
      return;
    }

    const duplicate = accounts.find(
      (account) =>
        account.id !== id &&
        account.name.toLowerCase() ===
          trimmedName.toLowerCase()
    );

    if (duplicate) {
      toast.error("Account already exists", {
        description:
          "Choose a different account name.",
      });
      return;
    }

    const { error } = await supabase
      .from("accounts")
      .update({
        name: trimmedName,
      })
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) {
      console.error(
        "RENAME ACCOUNT ERROR:",
        error.message
      );

      toast.error(error.message);

      return;
    }

    await refreshAccounts();

    if (currentAccount?.id === id) {
      setCurrentAccountState({
        ...currentAccount,
        name: trimmedName,
      });
    }

    toast.success(
      "Account renamed successfully."
    );
  }

  // =========================
  // DELETE ACCOUNT
  // =========================

  async function deleteAccount(
    id: string
  ): Promise<boolean> {
    if (!session?.user?.id) return false;

    // Don't allow deleting the last account
    if (accounts.length <= 1) {
      toast.error(
        "You must have at least one trading account."
      );

      return false;
    }

    // Check for trades
    const { count } = await supabase
      .from("trades")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("account_id", id);

    if ((count ?? 0) > 0) {
      toast.error(
        "This account contains trades. Move or delete them before deleting the account."
      );

      return false;
    }

    const { error } = await supabase
      .from("accounts")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) {
      console.error(
        "DELETE ACCOUNT ERROR:",
        error.message
      );

      toast.error(error.message);

      return false;
    }

    // Remove saved selection
    const storageKey =
      getStorageKey(session.user.id);

    const savedAccountId =
      localStorage.getItem(storageKey);

    if (savedAccountId === id) {
      localStorage.removeItem(storageKey);
    }

    await refreshAccounts();

    // If deleted account was selected,
    // select another remaining account.
    if (currentAccount?.id === id) {
      const remainingAccounts =
        accounts.filter(
          (account) =>
            account.id !== id
        );

      if (remainingAccounts.length > 0) {
        setCurrentAccount(
          remainingAccounts[0]
        );
      } else {
        setCurrentAccountState(null);
      }
    }

    toast.success(
      "Account deleted successfully."
    );

    return true;
  }

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    refreshAccounts();
  }, [session?.user?.id]);

  // =========================
  // CONTEXT
  // =========================

  return (
    <AccountContext.Provider
      value={{
        accounts,
        currentAccount,
        setCurrentAccount,
        refreshAccounts,
        addAccount,
        renameAccount,
        deleteAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

// =========================
// HOOK
// =========================

export function useAccount() {
  const context =
    useContext(AccountContext);

  if (!context) {
    throw new Error(
      "useAccount must be used inside AccountProvider"
    );
  }

  return context;
}