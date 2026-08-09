"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardPenLine, Brain, Images, } from "lucide-react";
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
  const { session, loading: authLoading } = useAuth();

  const [trade, setTrade] = useState<Trade | null>(null);
  const [journals, setJournals] = useState<any[]>([]);
  const [journal, setJournal] = useState<JournalEntry | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

const journalsPerPage = 6;
const [search, setSearch] = useState("");
const [biasFilter, setBiasFilter] = useState("ALL");
const [dateFilter, setDateFilter] = useState("");

  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const inputStyles =
  "w-full h-28 rounded-2xl p-4 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 backdrop-blur-xl transition-all duration-300 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20";

  // =========================
// LOAD DATA
// =========================
useEffect(() => {
  const load = async () => {
    console.log("load() started");
    console.log("Session:", session);

    try {
      if (authLoading) {
        console.log("Auth still loading...");
        return;
      }

      if (!session?.user?.id) {
        console.log("No session yet");
        return;
      }

      console.log("Session found:", session.user.id);

      // Your existing code continues here...

        // Load all journals
       const {
  data: journalsData,
  error: journalsError,
} = await supabase
  .from("journals")
  .select(`
    *,
    trades (
      pair,
      bias
    )
  `)
  .eq("user_id", session.user.id)
  .order("updated_at", { ascending: false });

 console.log("Journals returned:", journalsData);

if (journalsError) {
  console.error("Journals error:", journalsError);
  console.log("Error message:", journalsError.message);
  console.log("Error details:", journalsError.details);
  console.log("Error hint:", journalsError.hint);
  console.log("Error code:", journalsError.code);
} else {
  setJournals(journalsData ?? []);
  console.log("State journals:", journalsData);
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
  }, [tradeId, session?.user?.id, authLoading]);

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
  const filteredJournals = useMemo(() => {
    console.log("Rendering journals:", journals);
  return journals.filter((j: any) => {
    const matchesSearch =
      search === "" ||
      (j.trades?.pair ?? "")
  .toLowerCase()
  .includes(search.toLowerCase());

    const matchesBias =
      biasFilter === "ALL" ||
      j.trades?.bias === biasFilter;

    const matchesDate =
      dateFilter === "" ||
      (j.updated_at ?? j.created_at)
        .startsWith(dateFilter);

    return (
      matchesSearch &&
      matchesBias &&
      matchesDate
    );
  });
}, [journals, search, biasFilter, dateFilter]);

const totalPages = Math.ceil(
  filteredJournals.length / journalsPerPage
);

const paginatedJournals = filteredJournals.slice(
  (currentPage - 1) * journalsPerPage,
  currentPage * journalsPerPage
);
useEffect(() => {
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }
}, [currentPage, totalPages]);

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

  
  // =========================
  // LIST PAGE
  // =========================
  if (!tradeId) {
    return (
      <div className="space-y-6">

        
  <h1 className="text-2xl font-semibold text-black dark:text-white">
    All Journals
  </h1>

    <div className="flex flex-col md:flex-row gap-4">

  {/* Search */}
  <input
    type="text"
    placeholder="Search by pair..."
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setCurrentPage(1);
    }}
    className="
      flex-1
      rounded-xl
      border
      border-gray-200
      dark:border-white/10
      bg-white
      dark:bg-[#111827]
      px-4
      py-3
      text-black
      dark:text-white
      placeholder:text-gray-400
    "
  />

  {/* BUY / SELL */}
  <select
    value={biasFilter}
    onChange={(e) => {
      setBiasFilter(e.target.value);
      setCurrentPage(1);
    }}
    className="
      rounded-xl
      border
      border-gray-200
      dark:border-white/10
      bg-white
      dark:bg-[#111827]
      px-4
      py-3
      text-black
      dark:text-white
    "
  >
    <option value="ALL">All Trades</option>
    <option value="BUY">BUY</option>
    <option value="SELL">SELL</option>
  </select>

  {/* Date */}
  <input
    type="date"
    value={dateFilter}
    onChange={(e) => {
      setDateFilter(e.target.value);
      setCurrentPage(1);
    }}
    className="
      rounded-xl
      border
      border-gray-200
      dark:border-white/10
      bg-white
      dark:bg-[#111827]
      px-4
      py-3
      text-black
      dark:text-white
    "
  />

</div>

        {!loading && journals.length === 0 ? (
          <p className="text-gray-400">
            No journals yet
          </p>
        ) : (
          <>
        

  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {paginatedJournals.map((j: any) => (
              <Link
                key={j.trade_id}
                href={`/journal?id=${j.trade_id}`}
               className="
  block
  rounded-2xl
  border
  border-gray-200
  dark:border-white/10
  bg-white
  dark:bg-[#111827]
  p-5

  transition-transform
  transition-shadow
  duration-200

  hover:-translate-y-1
  hover:border-cyan-500
  hover:shadow-lg

  dark:hover:border-cyan-400/60
  dark:hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]
"
              >
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    j.trades?.bias === "BUY"
                      ? "bg-green-500/15 text-green-500"
                      : "bg-red-500/15 text-red-500"
                  }`}
                >
                  {j.trades?.bias === "BUY"
                    ? "🟢 BUY"
                    : "🔴 SELL"}
                </span>

                <h2 className="mt-4 text-xl font-bold text-black dark:text-white">
                  {j.trades?.pair}
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

          {totalPages > 1 && (
  
    <div className="flex items-center justify-center gap-4 mt-6">
    <button
      disabled={currentPage === 1}
      onClick={() =>
        setCurrentPage((p) => Math.max(1, p - 1))
      }
      className="
        px-4 py-2 rounded-xl
        font-medium
        transition-all duration-200

        bg-gray-100
        border border-gray-300
        text-gray-800

        dark:bg-white/10
        dark:border-white/20
        dark:text-white
        dark:hover:bg-white/20

        hover:bg-gray-200

        disabled:opacity-40
        disabled:cursor-not-allowed
      "
    >
      Previous
    </button>

    <span className="text-gray-700 dark:text-gray-300 font-medium">
      Page {currentPage} of {totalPages}
    </span>

    <button
      disabled={currentPage === totalPages}
      onClick={() =>
        setCurrentPage((p) =>
          Math.min(totalPages, p + 1)
        )
      }
      className="
        px-4 py-2 rounded-xl
        font-medium
        transition-all duration-200

        bg-gray-100
        border border-gray-300
        text-gray-800

        dark:bg-white/10
        dark:border-white/20
        dark:text-white
        dark:hover:bg-white/20

        hover:bg-gray-200

        disabled:opacity-40
        disabled:cursor-not-allowed
      "
    >
      Next
    </button>

  </div>
)} 
</>
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
   
  <div
    className="
      rounded-2xl
      border
      border-gray-200
      dark:border-white/10
      bg-white
      dark:bg-[#111827]
      p-6
      space-y-5
    "
  >
   
    <div>
      <h2 className="text-lg font-semibold text-black dark:text-white">
        Trade Summary
      </h2>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Review the key details of this trade before writing your journal.
      </p>
    </div>
    

    <div className="grid grid-cols-2 md:grid-cols-5 gap-5">

      {/* Pair */}
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Pair
        </p>

        <p className="mt-1 text-lg font-semibold text-black dark:text-white">
          {trade.pair}
        </p>
      </div>

      {/* Bias */}
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Direction
        </p>

        <p
          className={`mt-1 text-lg font-semibold ${
            trade.bias === "BUY"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {trade.bias === "BUY" ? "🟢 BUY" : "🔴 SELL"}
        </p>
      </div>

      {/* Profit */}
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Profit
        </p>

        <p
          className={`mt-1 text-lg font-semibold ${
            Number(trade.profit) >= 0
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {Number(trade.profit) >= 0 ? "+" : ""}
          ${Number(trade.profit).toFixed(2)}
        </p>
      </div>

      {/* Entry */}
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Entry
        </p>

        <p className="mt-1 text-lg font-semibold text-black dark:text-white">
          {trade.entry}
        </p>
      </div>

      {/* Exit */}
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Exit
        </p>

        <p className="mt-1 text-lg font-semibold text-black dark:text-white">
          {trade.exit}
        </p>
      </div>

    </div>
  </div>
  
)}

      {journal && (
        <>
        <div className="space-y-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111827] p-6">


  <div>
    <h2 className="flex items-center gap-2 text-lg font-semibold text-black dark:text-white">
  <ClipboardPenLine className="w-5 h-5 text-cyan-500" />
  Trade Information
</h2>

    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Document why you entered the trade and the confirmations that supported your decision.
    </p>
  </div>

  {/* Reason */}
  <div className="space-y-2">
  <div>
    <h3 className="text-base font-semibold text-black dark:text-white">
      Reason
    </h3>

    <p className="text-sm text-gray-500 dark:text-gray-400">
      Why did you enter this trade?
    </p>
  </div>

  <textarea
  className={inputStyles}
  value={journal.reason}
  onChange={(e) =>
    setJournal({
      ...journal,
      reason: e.target.value,
    })
  }
  placeholder="e.g. London breakout after liquidity sweep..."
/>
</div>

  {/* Confluence */}
  <div className="space-y-2">
  <div>
    <h3 className="text-base font-semibold text-black dark:text-white">
      Confluence
    </h3>

    <p className="text-sm text-gray-500 dark:text-gray-400">
      List the confirmations that supported your entry.
    </p>
  </div>

  <textarea
  className={inputStyles}
  value={journal.confluence}
  onChange={(e) =>
    setJournal({
      ...journal,
      confluence: e.target.value,
    })
  }
  placeholder="e.g. Psychological level, bullish FVG, SMT divergence, liquidity sweep..."
/>
</div>

</div>
       
<div className="space-y-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white 
dark:bg-[#111827] p-6">

  <div>
    <h2 className="flex items-center gap-2 text-lg font-semibold text-black dark:text-white">
  <Brain className="w-5 h-5 text-cyan-500" />
  Psychology & Execution
</h2>

    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Reflect on your emotions and how you managed the trade from entry to exit.
    </p>
  </div>

  {/* Emotions */}
   <div className="space-y-2">
  <div>
    <h3 className="text-base font-semibold text-black dark:text-white">
      Emotions
    </h3>

    <p className="text-sm text-gray-500 dark:text-gray-400">
      How did you feel before, during and after the trade?
    </p>
  </div>

  <textarea
  className={inputStyles}
  value={journal.emotions}
  onChange={(e) =>
    setJournal({
      ...journal,
      emotions: e.target.value,
    })
  }
  placeholder="e.g. Calm before entry, slight fear during retracement, confident after confirmation..."
/>
</div>

  {/* Trade Management */}
  <div className="space-y-2">
  <div>
    <h3 className="text-base font-semibold text-black dark:text-white">
      Trade Management
    </h3>

    <p className="text-sm text-gray-500 dark:text-gray-400">
      How did you manage the trade? Did you Break-even, move SL or TP?
    </p>
  </div>

  <textarea
  className={inputStyles}
  value={journal.management}
  onChange={(e) =>
    setJournal({
      ...journal,
      management: e.target.value,
    })
  }
  placeholder="e.g. Moved stop loss to break-even after 1R, scaled out 50% at TP1..."
/>
</div>

</div>       

<div className="rounded-2xl border border-gray-200 
dark:border-white/10 bg-white dark:bg-[#111827] p-6 space-y-4">

  <div>
    <h2 className="flex items-center gap-2 text-lg font-semibold text-black dark:text-white">
  <Images className="w-5 h-5 text-cyan-500" />
  Trade Screenshots
</h2>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Upload screenshots showing your setup, entry, management and exit.
    </p>
  </div>

  {/* Choose Images */}
  <div className="flex flex-col gap-2">

            <label
  className="
    inline-flex
    w-fit
    cursor-pointer
    items-center
    px-4
    py-3
    rounded-lg
    bg-white
    dark:bg-[#111827]
    border
    border-gray-200
    dark:border-white/10
    text-gray-900
    dark:text-white
    hover:border-cyan-500
    transition-all
  "
>
  Choose Images

  <input
    type="file"
    accept="image/*"
    multiple
    className="hidden"
    onChange={async (e) => {
      const files = Array.from(e.target.files || []);

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

  {/* Image Grid */}
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

</div>
      
          <div className="flex justify-end gap-3 pt-2">

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