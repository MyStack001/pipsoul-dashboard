"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Trade } from "@/types/trade";
import { JournalEntry } from "@/types/journal";

export default function JournalPage() {
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

    try {
      const storedTrades = localStorage.getItem("trades");

      if (storedTrades) {
        const parsedTrades: Trade[] = JSON.parse(storedTrades);
        const foundTrade = parsedTrades.find((t) => t.id === tradeId);

        if (foundTrade) setTrade(foundTrade);
      }

      const storedJournals = localStorage.getItem("journals");

      if (storedJournals) {
        const parsedJournals = JSON.parse(storedJournals);

        const normalizedJournals: JournalEntry[] = parsedJournals.map(
          (j: any) => ({
            ...j,
            images: j.images ?? (j.image ? [j.image] : []),
          })
        );

        const existingJournal = normalizedJournals.find(
          (j) => j.tradeId === tradeId
        );

        if (existingJournal) setJournal(existingJournal);
      }
    } catch (err) {
      console.error("Journal load error:", err);
    }
  }, [tradeId]);

  const saveJournal = () => {
    if (!tradeId) return;

    const stored = localStorage.getItem("journals");
    const journals: JournalEntry[] = stored ? JSON.parse(stored) : [];

    const index = journals.findIndex((j) => j.tradeId === tradeId);

    if (index !== -1) {
      journals[index] = journal;
    } else {
      journals.push(journal);
    }

    localStorage.setItem("journals", JSON.stringify(journals));
  };

  // ✅ FIXED UX STATES
  if (!tradeId) {
    return (
      <p className="p-6 text-red-500">
        Invalid trade link. Open this page from the dashboard.
      </p>
    );
  }

  if (!trade) {
    return <p className="p-6">Loading trade...</p>;
  }

  return (
    <div className="p-6 space-y-6 text-black dark:text-white">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Trading Journal</h1>
        <p className="text-sm text-gray-500">
          Review and reflect on your trade
        </p>
      </div>

      {/* TRADE INFO */}
      <div className="p-4 rounded-xl bg-white/60 dark:bg-white/5 border space-y-2">
        <p><strong>Pair:</strong> {trade.pair}</p>

        <p>
          <strong>Bias:</strong>{" "}
          <span className={trade.bias === "BUY" ? "text-green-500" : "text-red-500"}>
            {trade.bias}
          </span>
        </p>

        <p><strong>Profit:</strong> ${trade.profit}</p>
        <p><strong>Date:</strong> {trade.date}</p>
      </div>

      {/* INPUTS */}
      <div className="space-y-3">

        <textarea
          value={journal.reason}
          onChange={(e) =>
            setJournal({ ...journal, reason: e.target.value })
          }
          placeholder="Reason for the trade..."
          className="
  w-full h-28 p-3 rounded-lg
  bg-white/70 dark:bg-white/10
  border border-gray-300/70 dark:border-white/10
  text-black dark:text-white
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-cyan-400
"
        />

        <textarea
          value={journal.confluence}
          onChange={(e) =>
            setJournal({ ...journal, confluence: e.target.value })
          }
          placeholder="Confluence for entry..."
         className="
  w-full h-28 p-3 rounded-lg
  bg-white/70 dark:bg-white/10
  border border-gray-300/70 dark:border-white/10
  text-black dark:text-white
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-cyan-400
"
        />

        <textarea
          value={journal.stopLoss}
          onChange={(e) =>
            setJournal({ ...journal, stopLoss: e.target.value })
          }
          placeholder="Stop loss (pips)..."
         className="
  w-full h-28 p-3 rounded-lg
  bg-white/70 dark:bg-white/10
  border border-gray-300/70 dark:border-white/10
  text-black dark:text-white
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-cyan-400
"
        />

        <textarea
          value={journal.takeProfit}
          onChange={(e) =>
            setJournal({ ...journal, takeProfit: e.target.value })
          }
          placeholder="Take profit (pips)..."
         className="
  w-full h-28 p-3 rounded-lg
  bg-white/70 dark:bg-white/10
  border border-gray-300/70 dark:border-white/10
  text-black dark:text-white
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-cyan-400
"
        />

        <textarea
          value={journal.emotions}
          onChange={(e) =>
            setJournal({ ...journal, emotions: e.target.value })
          }
          placeholder="Emotions..."
          className="
  w-full h-28 p-3 rounded-lg
  bg-white/70 dark:bg-white/10
  border border-gray-300/70 dark:border-white/10
  text-black dark:text-white
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-cyan-400
"
        />

        <textarea
          value={journal.regrets}
          onChange={(e) =>
            setJournal({ ...journal, regrets: e.target.value })
          }
          placeholder="Regrets..."
          className="
  w-full h-28 p-3 rounded-lg
  bg-white/70 dark:bg-white/10
  border border-gray-300/70 dark:border-white/10
  text-black dark:text-white
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-cyan-400
"
        />

        <textarea
          value={journal.management}
          onChange={(e) =>
            setJournal({ ...journal, management: e.target.value })
          }
          placeholder="Trade management..."
          className="
  w-full h-28 p-3 rounded-lg
  bg-white/70 dark:bg-white/10
  border border-gray-300/70 dark:border-white/10
  text-black dark:text-white
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-cyan-400
"
        />

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          accept="image/png, image/jpeg"
          multiple
          onChange={(e) => {
            const files = e.target.files;
            if (!files) return;

            Array.from(files).forEach((file) => {
              const reader = new FileReader();

              reader.onloadend = () => {
                setJournal((prev) => ({
                  ...prev,
                  images: [...(prev.images || []), reader.result as string],
                }));
              };

              reader.readAsDataURL(file);
            });
          }}
          className="w-full p-3 rounded-lg border"
        />

        {/* IMAGE PREVIEW + DELETE */}
        {journal.images?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            {journal.images.map((img, i) => (
              <div key={i} className="relative group">

                <img
                  src={img}
                  className="rounded-lg max-h-40 w-full object-cover border"
                />

                <button
                  onClick={() =>
                    setJournal((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, index) => index !== i),
                    }))
                  }
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  Delete
                </button>

              </div>
            ))}
          </div>
        )}

        {/* SAVE */}
        <button
          onClick={saveJournal}
          className="px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600"
        >
          Save Journal
        </button>

      </div>
    </div>
  );
}