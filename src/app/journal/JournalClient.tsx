"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Trade } from "@/types/trade";
import { JournalEntry } from "@/types/journal";

export default function JournalClient() {
  const searchParams = useSearchParams();

  const tradeIdParam = searchParams.get("id");
  const tradeId = tradeIdParam ? Number(tradeIdParam) : null;

  const [trade, setTrade] = useState<Trade | null>(null);

  const [journal, setJournal] = useState<JournalEntry>({
    tradeId: tradeId ?? 0,
    reason: "",
    confluence: "",
    stopLoss: "",
    takeProfit: "",
    emotions: "",
    regrets: "",
    management: "",
    images: [],
  });

  useEffect(() => {
    if (!tradeId || isNaN(tradeId)) return;

    const storedTrades = localStorage.getItem("trades");

    if (storedTrades) {
      const parsedTrades: Trade[] = JSON.parse(storedTrades);
      const foundTrade = parsedTrades.find((t) => t.id === tradeId);

      if (foundTrade) setTrade(foundTrade);
    }

    const storedJournals = localStorage.getItem("journals");

    if (storedJournals) {
      const parsed = JSON.parse(storedJournals);

      const existing = parsed.find(
        (j: JournalEntry) => j.tradeId === tradeId
      );

      if (existing) setJournal(existing);
    }
  }, [tradeId]);

  if (!tradeId) {
    return (
      <p className="p-6 text-red-500">
        Invalid trade link. Open from dashboard.
      </p>
    );
  }

  if (!trade) {
    return <p className="p-6">Loading trade...</p>;
  }

  return (
    <div className="p-6 text-black dark:text-white">
      <h1 className="text-2xl font-semibold">Trading Journal</h1>

      <div className="p-4 border rounded-lg mt-4">
        <p><strong>Pair:</strong> {trade.pair}</p>
        <p><strong>Profit:</strong> ${trade.profit}</p>
        <p><strong>Date:</strong> {trade.date}</p>
      </div>
    </div>
  );
}