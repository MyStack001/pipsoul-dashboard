"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Trade } from "@/types/trade";
import { JournalEntry } from "@/types/journal";

export default function JournalClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tradeIdParam = searchParams.get("id");

  const tradeId =
    tradeIdParam && !isNaN(Number(tradeIdParam))
      ? Number(tradeIdParam)
      : null;

  const [trade, setTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(true);

  const [savedJournals, setSavedJournals] = useState<JournalEntry[]>([]);

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

  // LOAD DATA
  useEffect(() => {
    try {
      const storedTrades = localStorage.getItem("trades");
      const storedJournals = localStorage.getItem("journals");

      // LOAD ALL JOURNALS
      if (storedJournals) {
        const parsed = JSON.parse(storedJournals);

        const normalized: JournalEntry[] = parsed.map((j: any) => ({
          ...j,
          images: j.images ?? [],
        }));

        setSavedJournals(normalized);

        // LOAD EXISTING JOURNAL FOR SPECIFIC TRADE
        if (tradeId) {
          const existing = normalized.find(
            (j) => j.tradeId === tradeId
          );

          if (existing) {
            setJournal(existing);
          }
        }
      }

      // LOAD TRADE
      if (tradeId && storedTrades) {
        const parsedTrades: Trade[] = JSON.parse(storedTrades);

        const found = parsedTrades.find(
          (t) => t.id === tradeId
        );

        if (found) {
          setTrade(found);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [tradeId]);

  // SAVE JOURNAL
  const saveJournal = () => {
    try {
      const stored = localStorage.getItem("journals");

      const journals: JournalEntry[] = stored
        ? JSON.parse(stored)
        : [];

      const normalized = journals.map((j: any) => ({
        ...j,
        images: j.images ?? [],
      }));

      const index = normalized.findIndex(
        (j) => j.tradeId === tradeId
      );

      if (index !== -1) {
        normalized[index] = journal;
      } else {
        normalized.push(journal);
      }

      localStorage.setItem(
        "journals",
        JSON.stringify(normalized)
      );

      setSavedJournals(normalized);

      alert("Journal saved successfully ✅");
    } catch (err) {
      console.error(err);
    }
  };

  const inputStyles =
    "w-full h-28 p-3 rounded-lg border bg-white dark:bg-[#111827] text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500";

  // LOADING
  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  // =========================================
  // SHOW ALL SAVED JOURNALS
  // =========================================

  if (!tradeId) {
    return (
      <div className="p-6 space-y-6 text-black dark:text-white">

        <div>
          <h1 className="text-2xl font-semibold">
            Saved Journals
          </h1>

          <p className="text-sm text-gray-500">
            Review all your trading reflections
          </p>
        </div>

        {savedJournals.length === 0 ? (
          <div className="p-6 rounded-xl border bg-white/60 dark:bg-white/5">
            No saved journals yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {savedJournals.map((entry) => (
              <div
                key={entry.tradeId}
                className="p-5 rounded-xl border bg-white/60 dark:bg-white/5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg">
                    Trade #{entry.tradeId}
                  </h2>

                  <button
                    onClick={() =>
                      router.push(`/journal?id=${entry.tradeId}`)
                    }
                    className="text-cyan-500 hover:underline"
                  >
                    Open Journal
                  </button>
                </div>

                <p>
                  <strong>Reason:</strong> {entry.reason || "-"}
                </p>

                <p>
                  <strong>Emotions:</strong> {entry.emotions || "-"}
                </p>

                <p>
                  <strong>Management:</strong> {entry.management || "-"}
                </p>

                {entry.images?.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                    {entry.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Journal"
                        className="rounded-lg border h-28 object-cover w-full"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // INVALID TRADE
  if (!trade) {
    return (
      <p className="p-6 text-red-500">
        Trade not found.
      </p>
    );
  }

  // =========================================
  // SINGLE TRADE JOURNAL PAGE
  // =========================================

  return (
    <div className="p-6 space-y-6 text-black dark:text-white">

      <div>
        <h1 className="text-2xl font-semibold">
          Trading Journal
        </h1>

        <p className="text-sm text-gray-500">
          Review and reflect on your trade
        </p>
      </div>

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
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={saveJournal}
          className="px-4 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition"
        >
          Save Journal
        </button>

      </div>
    </div>
  );
}