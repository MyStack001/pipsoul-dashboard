"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import type { Trade } from "@/types/trade";

export function useTradesRealtime(pair?: string) {
  const { session } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);

  // initial fetch
  useEffect(() => {
    const fetchTrades = async () => {
      if (!session) return;

      const { data } = await supabase
        .from("trades")
        .select("*")
        .eq("user_id", session.user.id)
        .order("date", { ascending: true });

      setTrades(data || []);
    };

    fetchTrades();
  }, [session]);

  // realtime listener
  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel("trades-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trades",
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          const newRow = payload.new as Trade;

          if (payload.eventType === "INSERT") {
            setTrades((prev) => [...prev, newRow]);
          }

          if (payload.eventType === "DELETE") {
            setTrades((prev) =>
              prev.filter((t) => t.id !== payload.old.id)
            );
          }

          if (payload.eventType === "UPDATE") {
            setTrades((prev) =>
              prev.map((t) =>
                t.id === newRow.id ? newRow : t
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  // optional filter
  const filteredTrades =
    pair && pair !== "ALL"
      ? trades.filter((t) => t.pair === pair)
      : trades;

  return { trades, filteredTrades };
}