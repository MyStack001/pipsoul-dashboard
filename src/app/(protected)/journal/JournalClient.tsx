"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

import { Trade } from "@/types/trade";
import { JournalEntry } from "@/types/journal";

import { toast } from "sonner";
import { unlockAchievement } from "@/lib/achievements";
import { createNotification } from "@/lib/notifications";

export default function JournalClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

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

        // Load all journals
        const { data: journalsData, error: journalsError } = await supabase
          .from("journals")
          .select("*")
          .eq("user_id", session.user.id)
          .order("updated_at", { ascending: false });

        if (!journalsError && journalsData) {
          // Fetch the trade for each journal so BUY/SELL and pair always work
          const enriched = await Promise.all(
            journalsData.map(async (journal) => {
              const { data: trade } = await supabase
                .from("trades")
                .select("pair,bias")
                .eq("id", journal.trade_id)
                .maybeSingle();

              return {
                ...journal,
                trade,
              };
            })
          );

          setJournals(enriched);
        }

        if (!tradeId) {
          setLoading(false);
          return;
        }

        // =========================
        // LOAD TRADE
        // =========================
        const { data: tradeData, error: tradeError } = await supabase
          .from("trades")
          .select("*")
          .eq("id", tradeId)
          .maybeSingle();

        if (!tradeError) {
          setTrade(tradeData);
        }

        // =========================
        // LOAD JOURNAL
        // =========================
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
        ? {
            ...prev,
            images: [...(prev.images || []), imageUrl],
          }
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
  // SAVE JOURNAL
  // =========================
  const saveJournal = async () => {
    if (!journal || !tradeId || !session?.user?.id) return;

    const { error } = await supabase
      .from("journals")
      .upsert(
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

    // =========================
    // NOTIFICATION
    // =========================
    await createNotification(
      session.user.id,
      "Journal Saved",
      `${trade?.pair ?? journal.pair} journal was updated successfully.`,
      "success"
    );

    // =========================
    // JOURNAL ACHIEVEMENTS
    // =========================

    const { count: journalCount } = await supabase
      .from("journals")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", session.user.id);

    // 📝 First Journal
    if (journalCount === 1) {
      await unlockAchievement(
        session.user.id,
        "first_journal",
        "📝 First Journal",
        "Congratulations! You saved your first trade journal."
      );
    }

    // 📚 10 Journaled Trades
    if (journalCount === 10) {
      await unlockAchievement(
        session.user.id,
        "journal_10",
        "📚 10 Journaled Trades",
        "You've journaled your first 10 trades. Great consistency!"
      );
    }

    // 📖 50 Journaled Trades
    if (journalCount === 50) {
      await unlockAchievement(
        session.user.id,
        "journal_50",
        "📖 50 Journaled Trades",
        "50 trade journals completed. Keep learning from every trade."
      );
    }

    // 💯 100 Journaled Trades
    if (journalCount === 100) {
      await unlockAchievement(
        session.user.id,
        "journal_100",
        "💯 100 Journaled Trades",
        "100 trade journals completed. You're building elite discipline."
      );
    }

    // 🔥 First 5 Trades Journaled
    const { data: firstFiveTrades } = await supabase
      .from("trades")
      .select("id")
      .eq("user_id", session.user.id)
      .order("created_at", {
        ascending: true,
      })
      .limit(5);

    if (firstFiveTrades && firstFiveTrades.length === 5) {
      const tradeIds = firstFiveTrades.map((t) => t.id);

      const { data: journaledTrades } = await supabase
        .from("journals")
        .select("trade_id")
        .in("trade_id", tradeIds);

      if (journaledTrades?.length === 5) {
        await unlockAchievement(
          session.user.id,
          "journal_no_skip_5",
          "🔥 No Skip Streak",
          "You've journaled your first 5 trades without skipping any."
        );
      }
    }

    toast.success("Journal saved successfully!");

    console.log("Before redirect:", {
      current: window.location.pathname + window.location.search,
    });

    setTimeout(() => {
      console.log("Redirecting...");
      router.replace("/journal");
    }, 1000);
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

    toast.success("Journal deleted");

    router.replace("/journal");
  };
  // =========================
  // LOADING
  // =========================
  const formatLastUpdated = (date: string) => {
  const now = new Date();
  const updated = new Date(date);

  const seconds = Math.floor((now.getTime() - updated.getTime()) / 1000);

  if (seconds < 60) return `${seconds} secs ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  return updated.toLocaleDateString();
};

  if (loading) {
    return (
      <p className="p-6 text-gray-900 dark:text-white">
        Loading...
      </p>
    );
  }

  // =========================
  // LIST PAGE
  // =========================
  if (!tradeId) {
    return (
      <div className="space-y-6">

        <h1 className="text-2xl font-semibold text-black dark:text-white">
          All Journals
        </h1>

        {journals.length === 0 ? (
          <p className="text-gray-400">
            No journals yet
          </p>
        ) : (
          <div className="grid gap-5">
            {journals.map((j: any) => (
              <Link
                key={j.trade_id}
                href={`/journal?id=${j.trade_id}`}
                className="
                  block
                  rounded-2xl
                  border
                  border-white/20
                  bg-white/40
                  dark:bg-white/5
                  backdrop-blur-xl
                  p-5
                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  hover:border-cyan-400/40
                  hover:shadow-xl
                "
              >
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    j.trade?.bias === "BUY"
                      ? "bg-green-500/15 text-green-500"
                      : "bg-red-500/15 text-red-500"
                  }`}
                >
                  {j.trade?.bias === "BUY"
                    ? "🟢 BUY"
                    : "🔴 SELL"}
                </span>

                <h2 className="mt-4 text-xl font-bold text-black dark:text-white">
                  {j.trade?.pair}
                </h2>

                <p className="text-gray-500 dark:text-gray-400">
                  Trade Journal
                </p>

                <p className="mt-4 text-sm text-gray-400">
                  Last updated{" "}
                  {formatLastUpdated(
                    j.updated_at ?? j.created_at
                  )}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // =========================
  // EDIT MODE
  // =========================
  return (
    <div className="space-y-6">

      <h1 className="text-xl font-bold text-black dark:text-white">
        {trade ? `${trade.pair} Trade Journal` : "Trade Journal"}
      </h1>

      {trade && (
        <div className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111827] text-black dark:text-white">
          <div className="flex gap-3">

            <span
              className={
                trade.bias === "BUY"
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {trade.bias}
            </span>

            <span className="text-gray-400">•</span>

            <span
              className={
                Number(trade.profit) >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              ${trade.profit}
            </span>

          </div>
        </div>
      )}

      {journal && (
        <>
          <textarea
            className={inputStyles}
            value={journal.reason}
            onChange={(e) =>
              setJournal({
                ...journal,
                reason: e.target.value,
              })
            }
            placeholder="Reason..."
          />

          <textarea
            className={inputStyles}
            value={journal.confluence}
            onChange={(e) =>
              setJournal({
                ...journal,
                confluence: e.target.value,
              })
            }
            placeholder="Confluence..."
          />

          <textarea
            className={inputStyles}
            value={journal.emotions}
            onChange={(e) =>
              setJournal({
                ...journal,
                emotions: e.target.value,
              })
            }
            placeholder="Emotions..."
          />

          <textarea
            className={inputStyles}
            value={journal.management}
            onChange={(e) =>
              setJournal({
                ...journal,
                management: e.target.value,
              })
            }
            placeholder="Management..."
          />

          <div className="flex flex-col gap-2">

            <label
              className="
                inline-flex
                w-fit
                cursor-pointer
                px-4
                py-3
                rounded-lg
                bg-white
                dark:bg-[#111827]
                border
                border-gray-200
                dark:border-white/10
              "
            >
              Choose Images

              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={async (e) => {
                  const files = Array.from(
                    e.target.files || []
                  );

                  for (const file of files) {
                    await uploadImage(file);
                  }
                }}
              />
            </label>

            {uploading && (
              <p className="text-cyan-500 text-sm">
                Uploading image...
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {journal.images?.map((img, i) => (
              <div
                key={i}
                className="relative"
              >
                <img
                  src={img}
                  className="rounded-lg h-40 w-full object-cover cursor-pointer"
                  onClick={() => {
                    setPreviewImg(img);
                    setZoom(1);
                  }}
                />

                <button
                  onClick={() =>
                    deleteImage(img)
                  }
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={saveJournal}
              className="px-4 py-3 bg-cyan-500 text-white rounded-lg"
            >
              Save Journal
            </button>

            <button
              onClick={deleteJournal}
              className="px-4 py-3 bg-red-500 text-white rounded-lg"
            >
              Delete Journal
            </button>

          </div>
        </>
      )}

      {previewImg && (
        <div
          onClick={() => setPreviewImg(null)}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex items-center justify-center"
          >
            <button
              onClick={() => {
                setPreviewImg(null);
                setZoom(1);
              }}
              className="absolute -top-12 right-0 text-white text-2xl"
            >
              ✕
            </button>

            <img
              src={previewImg}
              style={{
                transform: `scale(${zoom})`,
                transition: "transform .2s ease",
              }}
              className="max-w-[90vw] max-h-[85vh] rounded-lg"
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">

              <button
                onClick={() =>
                  setZoom((z) =>
                    Math.max(0.5, z - 0.25)
                  )
                }
                className="px-4 py-2 bg-black/70 text-white"
              >
                −
              </button>

              <button
                onClick={() => setZoom(1)}
                className="px-4 py-2 bg-black/70 text-white"
              >
                {Math.round(zoom * 100)}%
              </button>

              <button
                onClick={() =>
                  setZoom((z) =>
                    Math.min(4, z + 0.25)
                  )
                }
                className="px-4 py-2 bg-black/70 text-white"
              >
                +
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}