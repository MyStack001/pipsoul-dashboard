"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

import { Trade } from "@/types/trade";
import { JournalEntry } from "@/types/journal";

export default function JournalClient() {
  const searchParams = useSearchParams();
  const tradeId = searchParams.get("id");

  const [trade, setTrade] = useState<Trade | null>(null);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [journal, setJournal] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const inputStyles =
    "w-full h-28 p-3 rounded-lg border bg-white dark:bg-[#111827] text-black dark:text-white";

  useEffect(() => {
    const load = async () => {
      try {
        const stored = localStorage.getItem("journals");
        const parsed: JournalEntry[] = stored ? JSON.parse(stored) : [];

        setJournals(parsed);

        if (!tradeId) {
          setLoading(false);
          return;
        }

        const { data } = await supabase
          .from("trades")
          .select("*")
          .eq("id", tradeId)
          .maybeSingle();

        if (data) setTrade(data);

        const existing = parsed.find((j) => j.tradeId === tradeId);

        setJournal(
          existing || {
            tradeId,
            pair: data?.pair || "Unknown",
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
        ? {
            ...prev,
            images: [...(prev.images || []), imageUrl],
          }
        : prev
    );

    setUploading(false);
  };
const deleteImage = (imageUrl: string) => {
  if (!journal) return;

  setJournal({
    ...journal,
    images: journal.images.filter(
      (img) => img !== imageUrl
    ),
  });
};
  // =========================
  // SAVE JOURNAL
  // =========================
  const saveJournal = () => {
    if (!journal || !tradeId) return;

    const stored = localStorage.getItem("journals");
    const all: JournalEntry[] = stored ? JSON.parse(stored) : [];

    const index = all.findIndex((j) => j.tradeId === tradeId);

    if (index !== -1) {
      all[index] = journal;
    } else {
      all.push(journal);
    }

    localStorage.setItem("journals", JSON.stringify(all));
    setJournals(all);

    alert("Journal saved ✅");
  };

  if (loading)
    return (
      <p className="p-6 text-gray-900 dark:text-white">Loading...</p>
    );

  if (!tradeId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          All Journals
        </h1>

        {journals.length === 0 ? (
          <p className="text-gray-500 mt-4">No journals yet</p>
        ) : (
          journals.map((j) => (
            <a
              key={j.tradeId}
              href={`/journal?id=${j.tradeId}`}
              className="
                block p-4 mt-3 rounded-lg border
                border-gray-200 dark:border-white/10
                text-gray-900 dark:text-white
                hover:bg-gray-50 dark:hover:bg-white/10
              "
            >
              {j.pair} Journal
            </a>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* TITLE */}
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        {trade ? `${trade.pair} Trade Journal` : "Trade Journal"}
      </h1>

      {/* TRADE INFO */}
      {trade && (
        <div className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111827]">
          <div className="flex items-center gap-3">
            <span className={`font-semibold ${trade.bias === "BUY" ? "text-green-500" : "text-red-500"}`}>
              {trade.bias}
            </span>

            <span className="text-gray-400">•</span>

            <span className={`font-semibold ${Number(trade.profit) >= 0 ? "text-green-500" : "text-red-500"}`}>
              {Number(trade.profit) >= 0 ? "+" : ""}${trade.profit}
            </span>
          </div>
        </div>
      )}

      {/* FORM */}
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

          {/* UPLOAD */}
          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadImage(file);
              }}
              className="text-sm text-gray-500"
            />

            {uploading && (
              <p className="text-cyan-500 text-sm">Uploading...</p>
            )}
          </div>

          {/* IMAGES GRID */}
          {journal?.images?.length > 0 && (
  <div className="grid grid-cols-2 gap-3 mt-4">
    {journal.images.map((img, i) => (
      <div
        key={i}
        className="
          relative
          rounded-lg
          overflow-hidden
          border
          border-gray-200
          dark:border-white/10
        "
      >
       <img
  src={img}
  alt="chart"
  onClick={() => {
  setZoom(1);
  setPreviewImg(img);
}}
  className="
    w-full
    h-40
    object-cover
    cursor-pointer
    hover:opacity-90
    transition
  "
/>

        <button
          onClick={() => deleteImage(img)}
          className="
            absolute
            top-2
            right-2
            px-2
            py-1
            rounded
            bg-red-500
            text-white
            text-xs
          "
        >
          Delete
        </button>
      </div>
    ))}
  </div>
)}
          {/* ZOOM MODAL */}
     {previewImg && (
  <div
    onClick={() => setPreviewImg(null)}
    className="
      fixed
      inset-0
      bg-black/90
      flex
      items-center
      justify-center
      z-50
      p-6
    "
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative"
    >
      {/* CLOSE */}
      <button
        onClick={() => {
          setPreviewImg(null);
          setZoom(1);
        }}
        className="
          absolute
          -top-12
          right-0
          text-white
          text-xl
        "
      >
        ✕
      </button>

      {/* CONTROLS */}
      <div
        className="
  absolute
  bottom-4
  left-1/2
  -translate-x-1/2
  flex
  items-center
  gap-2
  z-10
"
      >
        <button
          onClick={() =>
            setZoom((prev) => Math.max(0.5, prev - 0.25))
          }
          className="
  px-4 py-2
  rounded-lg
  bg-black/60
  backdrop-blur-sm
  text-white
  border
  border-white/10
  hover:bg-black/80
  transition
"
        >
          −
        </button>

        <button
          onClick={() => setZoom(1)}
          className="
  px-4 py-2
  rounded-lg
  bg-black/60
  backdrop-blur-sm
  text-white
  border
  border-white/10
  hover:bg-black/80
  transition
"
        >
         {Math.round(zoom * 100)}%
        </button>

        <button
          onClick={() =>
            setZoom((prev) => Math.min(5, prev + 0.25))
          }
          className="
            px-3 py-1
            rounded
            bg-white/20
            text-white
          "
        >
          +
        </button>
      </div>

      {/* IMAGE */}
      <img
        src={previewImg}
        alt="preview"
        style={{
          transform: `scale(${zoom})`,
          transition: "transform 0.2s ease",
        }}
        className="
          max-w-[90vw]
          max-h-[85vh]
          rounded-xl
        "
      />
    </div>
  </div>
)}     
     
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