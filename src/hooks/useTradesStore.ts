"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { useAccount } from "@/components/AccountProvider";
import type { Trade } from "@/types/trade";

// =========================
// GLOBAL STORE
// =========================

let globalTrades: Trade[] = [];

let subscribers: ((trades: Trade[]) => void)[] = [];

function notify() {
  subscribers.forEach((fn) => {
    fn([...globalTrades]);
  });
}

// =========================
// HOOK
// =========================

export function useTradesStore() {
  const { session } = useAuth();
  const { currentAccount } = useAccount();

  const [trades, setTrades] =
    useState<Trade[]>(globalTrades);

  // =========================
  // REGISTER SUBSCRIBER
  // =========================

  useEffect(() => {
    subscribers.push(setTrades);

    return () => {
      subscribers = subscribers.filter(
        (fn) => fn !== setTrades
      );
    };
  }, []);

  // =========================
  // FETCH + REALTIME SYNC
  // =========================

  useEffect(() => {
    if (!session?.user?.id) return;

    if (!currentAccount?.id) {
      globalTrades = [];
      notify();
      return;
    }

    const userId = session.user.id;
    const accountId = currentAccount.id;

    async function fetchTrades() {
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .eq("user_id", userId)
        .eq("account_id", accountId)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "FETCH ERROR:",
          error.message
        );
        return;
      }

      globalTrades = (data ?? []) as Trade[];

      notify();
    }

    // INITIAL FETCH
    fetchTrades();

    // =========================
    // REALTIME
    // =========================

    const channel = supabase
      .channel(`trades-${userId}-${accountId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trades",
          filter: `account_id=eq.${accountId}`,
        },
        () => {
          fetchTrades();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    session?.user?.id,
    currentAccount?.id,
  ]);

  return {
    trades,
  };
}