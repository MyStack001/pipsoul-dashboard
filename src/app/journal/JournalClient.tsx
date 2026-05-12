"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Trade } from "@/types/trade";
import { JournalEntry } from "@/types/journal";

export default function JournalClient() {
  const searchParams = useSearchParams();

  const tradeIdParam = searchParams.get("id");

  const tradeId =
    tradeIdParam && !isNaN(Number(tradeIdParam))
      ? Number(tradeIdParam)
      : null;

  const [trade, setTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(true);

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
    if (!tradeId) {
      setLoading(false);
      return;
    }

    try {
      const storedTrades = localStorage.getItem("trades");
      const storedJournals = localStorage.getItem("journals");

      if (storedTrades) {
        const parsedTrades: Trade[] = JSON.parse(storedTrades);

        const found = parsedTrades.find(
          (t) => t.id === tradeId
        );

        if (found) setTrade(found);
      }

      if (storedJournals) {
        const parsed = JSON.parse(storedJournals);

        const normalized: JournalEntry[] = parsed.map(
          (j: any) => ({
            ...j,
            images: j.images ?? [],
          })
        );

        const existing = normalized.find(
          (j) => j.tradeId === tradeId
        );

        if (existing) setJournal(existing);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [tradeId]);

  if (!tradeId) {
    return (
      <p className="p-6 text-red-500">
        Invalid trade link. Open from dashboard.
      </p>
    );
  }

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!trade) {
    return <p className="p-6">Trade not found</p>;
  }

  const saveJournal = () => {
    const stored = localStorage.getItem("journals");

    const journals: JournalEntry[] = stored
      ? JSON.parse(stored)
      : [];

    const index = journals.findIndex(
      (j) => j.tradeId === tradeId
    );

    if (index !== -1) {
      journals[index] = journal;
    } else {
      journals.push(journal);
    }

    localStorage.setItem(
      "journals",
      JSON.stringify(journals)
    );
  };

  const inputStyles =
    "w-full h-28 p-3 rounded-lg border bg-white dark:bg-[#111827] text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500";

  return (
    <div className="p-6 space-y-6 text-black dark:text-white">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">
          Trading Journal
        </h1>

        <p className="text-sm text-gray-500">
          Review and reflect on your trade
        </p>
      </div>

      {/* TRADE INFO */}
      <div className="p-4 rounded-xl border space-y-2 bg-white/60 dark:bg-white/5">
        <p><strong>Pair:</strong> {trade.pair}</p>

        <p>
          <strong>Bias:</strong>{" "}
          <span
            className={
              trade.bias === "BUY"
                ? "text-green-500"
                : "text-red-500"
            }
          >
            {trade.bias}
          </span>
        </p>

        <p><strong>Profit:</strong> ${trade.profit}</p>
        <p><strong>Date:</strong> {trade.date}</p>
      </div>

      {/* INPUTS */}
      <div className="space-y-4">

        <textarea
          value={journal.reason}
          onChange={(e) =>
            setJournal({
              ...journal,
              reason: e.target.value,
            })
          }
          placeholder="Reason for the trade..."
          className={inputStyles}
        />

        <textarea
          value={journal.confluence}
          onChange={(e) =>
            setJournal({
              ...journal,
              confluence: e.target.value,
            })
          }
          placeholder="Confluence for entry..."
          className={inputStyles}
        />

        <textarea
          value={journal.stopLoss}
          onChange={(e) =>
            setJournal({
              ...journal,
              stopLoss: e.target.value,
            })
          }
          placeholder="Stop loss (pips)..."
          className={inputStyles}
        />

        <textarea
          value={journal.takeProfit}
          onChange={(e) =>
            setJournal({
              ...journal,
              takeProfit: e.target.value,
            })
          }
          placeholder="Take profit (pips)..."
          className={inputStyles}
        />

        <textarea
          value={journal.emotions}
          onChange={(e) =>
            setJournal({
              ...journal,
              emotions: e.target.value,
            })
          }
          placeholder="Emotions during trade..."
          className={inputStyles}
        />

        <textarea
          value={journal.regrets}
          onChange={(e) =>
            setJournal({
              ...journal,
              regrets: e.target.value,
            })
          }
          placeholder="How could this trade have been better?"
          className={inputStyles}
        />

        <textarea
          value={journal.management}
          onChange={(e) =>
            setJournal({
              ...journal,
              management: e.target.value,
            })
          }
          placeholder="Trade management notes..."
          className={inputStyles}
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
                  images: [
                    ...(prev.images || []),
                    reader.result as string,
                  ],
                }));
              };

              reader.readAsDataURL(file);
            });
          }}
          className="w-full p-3 rounded-lg border bg-white dark:bg-[#111827]"
        />

        {/* IMAGE PREVIEW */}
        {journal.images?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {journal.images.map((img, i) => (
              <div
                key={i}
                className="relative group"
              >
                <img
                  src={img}
                  alt="Chart"
                  className="rounded-lg border max-h-40 object-cover w-full"
                />

                <button
                  onClick={() =>
                    setJournal((prev) => ({
                      ...prev,
                      images: prev.images.filter(
                        (_, index) => index !== i
                      ),
                    }))
                  }
                  className="
                    absolute top-2 right-2
                    bg-red-500 text-white
                    text-xs px-2 py-1 rounded
                    opacity-0 group-hover:opacity-100
                    transition
                  "
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* SAVE BUTTON */}
        <button
          onClick={saveJournal}
          className="
            px-4 py-3 rounded-lg
            bg-cyan-500 hover:bg-cyan-600
            text-white font-medium transition
          "
        >
          Save Journal
        </button>

      </div>
    </div>
  );
}