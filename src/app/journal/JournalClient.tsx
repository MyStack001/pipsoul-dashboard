"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

import { Trade } from "@/types/trade";
import { JournalEntry } from "@/types/journal";

export default function JournalClient() {
  const searchParams = useSearchParams();

  // =========================
  // FIX: KEEP ID AS STRING (NO Number())
  // =========================
  const tradeId = searchParams.get("id");

  const [trade, setTrade] = useState<Trade | null>(null);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [journal, setJournal] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const inputStyles =
    "w-full h-28 p-3 rounded-lg border bg-white dark:bg-[#111827] text-black dark:text-white";

  useEffect(() => {
    const load = async () => {
      try {
        // =========================
        // LOAD JOURNALS (LOCAL STORAGE)
        // =========================
        const stored = localStorage.getItem("journals");
        const parsed: JournalEntry[] = stored ? JSON.parse(stored) : [];

        setJournals(parsed);

        // =========================
        // LIST PAGE (/journal)
        // =========================
        if (!tradeId) {
          setLoading(false);
          return;
        }

        // =========================
        // FETCH TRADE (SUPABASE UUID)
        // =========================
        const { data, error } = await supabase
          .from("trades")
          .select("*")
          .eq("id", tradeId) // 🔥 STRING MATCH (NO Number)
          .maybeSingle();

        if (error) {
          console.error("Trade fetch error:", error.message);
        }

        if (data) {
          setTrade(data);
        }

        // =========================
        // FIND JOURNAL (STRING MATCH)
        // =========================
        const existing = parsed.find(
          (j) => j.tradeId === tradeId
        );

        setJournal(
          existing || {
            tradeId,

            reason: "",
            confluence: "",
            stopLoss: "",
            takeProfit: "",
            emotions: "",
            regrets: "",
            management: "",
            images: [],
          }
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [tradeId]);

  // =========================
  // SAVE JOURNAL
  // =========================
  const saveJournal = () => {
    if (!journal || !tradeId) return;

    const stored = localStorage.getItem("journals");
    const all: JournalEntry[] = stored ? JSON.parse(stored) : [];

    const index = all.findIndex(
      (j) => j.tradeId === tradeId
    );

    if (index !== -1) {
      all[index] = journal;
    } else {
      all.push(journal);
    }

    localStorage.setItem("journals", JSON.stringify(all));
    setJournals(all);

    alert("Journal saved ✅");
  };

  // =========================
  // LOADING
  // =========================
  if (loading) return <p className="p-6">Loading...</p>;

  // =========================
  // LIST PAGE
  // =========================
  if (!tradeId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">All Journals</h1>

        {journals.length === 0 ? (
          <p className="text-gray-500 mt-4">No journals yet</p>
        ) : (
          journals.map((j) => (
            <a
              key={j.tradeId}
              href={`/journal?id=${j.tradeId}`}
              className="block p-4 border rounded-lg mt-3 hover:bg-gray-50 dark:hover:bg-white/10"
            >
              Trade #{j.tradeId}
            </a>
          ))
        )}
      </div>
    );
  }

  // =========================
  // EDIT MODE
  // =========================
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">
        Journal Trade #{tradeId}
      </h1>

      {/* TRADE INFO */}
      {trade ? (
        <div className="p-4 border rounded-lg">
          <p>Pair: {trade.pair}</p>
          <p>Bias: {trade.bias}</p>
          <p>Profit: ${trade.profit}</p>
        </div>
      ) : (
        <p className="text-yellow-500">
          Trade not found in Supabase (journal still works)
        </p>
      )}

      {/* JOURNAL FORM */}
      {journal && (
        <>
          <textarea
            value={journal.reason}
            onChange={(e) =>
              setJournal({ ...journal, reason: e.target.value })
            }
            placeholder="Reason..."
            className={inputStyles}
          />

          <textarea
            value={journal.confluence}
            onChange={(e) =>
              setJournal({ ...journal, confluence: e.target.value })
            }
            placeholder="Confluence..."
            className={inputStyles}
          />

          <textarea
            value={journal.emotions}
            onChange={(e) =>
              setJournal({ ...journal, emotions: e.target.value })
            }
            placeholder="Emotions..."
            className={inputStyles}
          />

          <textarea
            value={journal.management}
            onChange={(e) =>
              setJournal({ ...journal, management: e.target.value })
            }
            placeholder="Management..."
            className={inputStyles}
          />

          <button
            onClick={saveJournal}
            className="px-4 py-3 bg-cyan-500 text-white rounded-lg"
          >
            Save Journal
          </button>
        </>
      )}
    </div>
  );
}