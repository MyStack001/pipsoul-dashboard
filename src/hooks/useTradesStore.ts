"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import type { Trade } from "@/types/trade";

// =========================
// GLOBAL STORE
// =========================
let globalTrades: Trade[] = [];

let subscribers: React.Dispatch<
  React.SetStateAction<Trade[]>
>[] = [];

function notify() {
  subscribers.forEach((fn) =>
    fn([...globalTrades])
  );
}
// GLOBAL STATE
export function refreshTrades(userId: string) {
  const fetchTrades = async () => {
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("REFRESH ERROR:", error.message);
      return;
    }

    globalTrades = data || [];
    notify();
  };

  fetchTrades();
}

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
    const channelName = `trades-${userId}`;

// 🔥 REMOVE OLD CHANNEL FIRST
supabase.removeAllChannels();

const channel =
  supabase.channel(channelName);
    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "trades",
        filter: `user_id=eq.${userId}`,
      },
      () => {
        // 🔥 ALWAYS REFETCH
        fetchTrades();
      }
    );

    channel.subscribe();

    // CLEANUP
    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  return { trades };
}