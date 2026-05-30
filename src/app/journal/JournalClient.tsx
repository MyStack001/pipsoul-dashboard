"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

import { Trade } from "@/types/trade";
import { JournalEntry } from "@/types/journal";

export default function JournalClient() {
  const searchParams = useSearchParams();
  const tradeId = searchParams.get("id");
  const { session } = useAuth();

  const [trade, setTrade] = useState<Trade | null>(null);
  const [journals, setJournals] = useState<any[]>([]);
  const [journal, setJournal] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const inputStyles =
    "w-full h-28 p-3 rounded-lg border bg-white dark:bg-[#111827] text-black dark:text-white";

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    const load = async () => {
      try {
        if (!session?.user?.id) return;

        // 1. LOAD ALL JOURNALS
        const { data: journalsData, error: journalsError } = await supabase
          .from("journals")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (!journalsError) setJournals(journalsData || []);

        if (!tradeId) {
          setLoading(false);
          return;
        }

        // 2. LOAD TRADE
        const { data: tradeData, error: tradeError } = await supabase
          .from("trades")
          .select("*")
          .eq("id", tradeId)
          .maybeSingle();

        if (!tradeError) setTrade(tradeData);

        // 3. LOAD JOURNAL FOR THIS TRADE
        const { data: journalData } = await supabase
          .from("journals")
          .select("*")
          .eq("trade_id", tradeId)
          .eq("user_id", session.user.id)
          .maybeSingle();

        setJournal(
          journalData || {
            tradeId,
            pair: tradeData?.pair || "Unknown",
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
  }, [tradeId, session?.user?.id]);

  // =========================
  // UPLOAD IMAGE
  // =========================
  const uploadImage = async (file: File) => {
    if (!file || !tradeId) return;

    setUploading(true);

    const filePath = `${tradeId}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("journal-images")
      .upload(filePath, file);

    if (error) {
      alert(error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("journal-images")
      .getPublicUrl(filePath);

    const imageUrl = data.publicUrl;

    setJournal((prev) =>
      prev
        ? { ...prev, images: [...(prev.images || []), imageUrl] }
        : prev
    );

    setUploading(false);
  };

  // =========================
  // DELETE IMAGE
  // =========================
  const deleteImage = (imageUrl: string) => {
    if (!journal) return;

    setJournal({
      ...journal,
      images: journal.images.filter((img) => img !== imageUrl),
    });
  };

  // =========================
  // SAVE JOURNAL (SUPABASE)
  // =========================
  const saveJournal = async () => {
  if (!journal || !tradeId || !session?.user?.id) return;

  const { error } = await supabase.from("journals").upsert(
    {
      trade_id: tradeId,
      user_id: session.user.id,
      pair: trade?.pair || journal.pair,
      reason: journal.reason,
      confluence: journal.confluence,
      stop_loss: journal.stopLoss,
      take_profit: journal.takeProfit,
      emotions: journal.emotions,
      regrets: journal.regrets,
      management: journal.management,
      images: journal.images,
    },
    {
      onConflict: "trade_id",
    }
  );

  if (error) {
    alert(error.message);
    return;
  }

  alert("Journal saved ✅");
};
   
  // =========================
  // DELETE JOURNAL
  // =========================
  const deleteJournal = async () => {
    if (!tradeId || !session?.user?.id) return;

    const { error } = await supabase
      .from("journals")
      .delete()
      .eq("trade_id", tradeId)
      .eq("user_id", session.user.id);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/journal";
  };

  // =========================
  // LOADING
  // =========================
  if (loading)
    return (
      <p className="p-6 text-gray-900 dark:text-white">Loading...</p>
    );

  // =========================
  // LIST PAGE
  // =========================
  if (!tradeId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-white">
          All Journals
        </h1>

        {journals.length === 0 ? (
          <p className="text-gray-400 mt-4">No journals yet</p>
        ) : (
          journals.map((j: any) => (
            <a
              key={j.trade_id}
              href={`/journal?id=${j.trade_id}`}
              className="block p-4 mt-3 rounded-lg border border-white/10 text-white hover:bg-white/10"
            >
              {j.pair} Journal
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

      <h1 className="text-xl font-bold text-white">
        {trade ? `${trade.pair} Trade Journal` : "Trade Journal"}
      </h1>

      {/* TRADE INFO */}
      {trade && (
        <div className="p-4 rounded-xl border border-white/10 bg-[#111827]">
          <div className="flex gap-3">
            <span className={trade.bias === "BUY" ? "text-green-500" : "text-red-500"}>
              {trade.bias}
            </span>

            <span className="text-gray-400">•</span>

            <span className={Number(trade.profit) >= 0 ? "text-green-500" : "text-red-500"}>
              ${trade.profit}
            </span>
          </div>
        </div>
      )}

      {/* FORM */}
      {journal && (
        <>
          <textarea className={inputStyles} value={journal.reason}
            onChange={(e) => setJournal({ ...journal, reason: e.target.value })}
            placeholder="Reason..."
          />

          <textarea className={inputStyles} value={journal.confluence}
            onChange={(e) => setJournal({ ...journal, confluence: e.target.value })}
            placeholder="Confluence..."
          />

          <textarea className={inputStyles} value={journal.emotions}
            onChange={(e) => setJournal({ ...journal, emotions: e.target.value })}
            placeholder="Emotions..."
          />

          <textarea className={inputStyles} value={journal.management}
            onChange={(e) => setJournal({ ...journal, management: e.target.value })}
            placeholder="Management..."
          />

          {/* UPLOAD */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadImage(file);
            }}
          />

          {/* IMAGES */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {journal.images?.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} className="rounded-lg h-40 w-full object-cover" />

                <button
                  onClick={() => deleteImage(img)}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <button onClick={saveJournal} className="px-4 py-3 bg-cyan-500 text-white rounded-lg">
            Save Journal
          </button>

          <button onClick={deleteJournal} className="px-4 py-3 bg-red-500 text-white rounded-lg mt-3">
            Delete Journal
          </button>
        </>
      )}
    </div>
  );
}