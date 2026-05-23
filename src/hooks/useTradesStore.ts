"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import type { Trade } from "@/types/trade";

// GLOBAL STORE
let globalTrades: Trade[] = [];

let initialized = false;

let subscribers: React.Dispatch<
  React.SetStateAction<Trade[]>
>[] = [];

function notify() {
  subscribers.forEach((fn) =>
    fn([...globalTrades])
  );
}

export function useTradesStore() {
  const { session } = useAuth();

  const [trades, setTrades] =
    useState<Trade[]>(globalTrades);

  // ✅ DEBUG TEST
  useEffect(() => {
    console.log(
      "SESSION USER:",
      session?.user
    );

    const testFetch =
      async () => {
        const {
          data,
          error,
        } = await supabase
          .from("trades")
          .select("*");

        console.log(
          "SUPABASE DATA:",
          data
        );

        console.log(
          "SUPABASE ERROR:",
          error
        );
      };

    testFetch();
  }, [session]);

  // REGISTER COMPONENT SUBSCRIBER
  useEffect(() => {
    subscribers.push(setTrades);

    return () => {
      subscribers =
        subscribers.filter(
          (fn) =>
            fn !== setTrades
        );
    };
  }, []);

  // ONLY INITIALIZE ONCE
  useEffect(() => {
    if (!session?.user?.id)
      return;

    if (initialized) return;

    initialized = true;

    const userId =
      session.user.id;

    const fetchTrades =
      async () => {
        const { data } =
          await supabase
            .from("trades")
            .select("*")
            .eq(
              "user_id",
              userId
            );

        globalTrades =
          data || [];

        notify();
      };

    fetchTrades();

    const channel =
      supabase.channel(
        `trades-${userId}`
      );

    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "trades",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        const newRow =
          payload.new as Trade;

        if (
          payload.eventType ===
          "INSERT"
        ) {
          globalTrades = [
            ...globalTrades,
            newRow,
          ];
        }

        if (
          payload.eventType ===
          "DELETE"
        ) {
          globalTrades =
            globalTrades.filter(
              (t) =>
                t.id !==
                payload.old.id
            );
        }

        if (
          payload.eventType ===
          "UPDATE"
        ) {
          globalTrades =
            globalTrades.map(
              (t) =>
                t.id ===
                newRow.id
                  ? newRow
                  : t
            );
        }

        notify();
      }
    );

    channel.subscribe();
  }, [session?.user?.id]);

  return { trades };
}