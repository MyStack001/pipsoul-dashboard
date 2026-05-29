"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import type { Trade } from "@/types/trade";

// =========================
// GLOBAL STORE
// =========================
let globalTrades: Trade[] = [];

let subscribers: ((trades: Trade[]) => void)[] = [];
function notify() {
  subscribers.forEach((fn) =>
    fn([...globalTrades])
  );
}
// GLOBAL STATE

// HOOK STARTS HERE

export function useTradesStore() {
  const { session } = useAuth();

  const [trades, setTrades] =
    useState<Trade[]>(globalTrades);

  // =========================
  // REGISTER SUBSCRIBER
  // =========================
  useEffect(() => {
    subscribers.push(setTrades);

    return () => {
      subscribers =
        subscribers.filter(
          (fn) => fn !== setTrades
        );
    };
  }, []);

  // =========================
  // FETCH + REALTIME SYNC
  // =========================
  useEffect(() => {
    if (!session?.user?.id) return;

    const userId = session.user.id;

    const fetchTrades = async () => {
      const { data, error } =
        await supabase
          .from("trades")
          .select("*")
          .eq("user_id", userId)
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

      globalTrades = data || [];

      notify();
    };

    // INITIAL FETCH
    fetchTrades();

    // =========================
    // REALTIME
    // =========================
    const channel = supabase
  .channel(`trades-${userId}`)
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "trades",
      filter: `user_id=eq.${userId}`,
    },
    () => {
      fetchTrades();
    }
  )
  .subscribe();

return () => {
  supabase.removeChannel(channel);
};
  }, [session?.user?.id]);

  return { trades };
}