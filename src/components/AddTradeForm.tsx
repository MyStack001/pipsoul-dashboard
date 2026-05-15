"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

export default function AddTradeForm() {
  const { session } = useAuth();

  const [pair, setPair] = useState("");
  const [bias, setBias] = useState<"BUY" | "SELL">("BUY");

  const [entry, setEntry] = useState("");
  const [exit, setExit] = useState("");
  const [lot, setLot] = useState("");

  const [loading, setLoading] = useState(false);

  const calculateProfit = () => {
    const e = Number(entry);
    const x = Number(exit);
    const l = Number(lot);

    if (bias === "BUY") {
      return (x - e) * l * 10000;
    }

    return (e - x) * l * 10000;
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!session) return;

    setLoading(true);

    const profit = calculateProfit();

    const { error } = await supabase
      .from("trades")
      .insert([
        {
          user_id: session.user.id,

          pair,
          bias,

          entry: Number(entry),
          exit: Number(exit),

          lot: Number(lot),

          profit,

          date: new Date().toISOString(),
        },
      ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    alert("Trade added!");

    setPair("");
    setEntry("");
    setExit("");
    setLot("");

    window.location.reload();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
        gap-4
        p-4
        rounded-xl
        bg-white dark:bg-[#111827]
        border border-gray-200/70 dark:border-white/10
      "
    >
      <input
        type="text"
        placeholder="Pair"
        value={pair}
        onChange={(e) => setPair(e.target.value)}
        className="p-3 rounded bg-gray-100 dark:bg-black/30"
      />

      <select
        value={bias}
        onChange={(e) =>
          setBias(e.target.value as "BUY" | "SELL")
        }
        className="p-3 rounded bg-gray-100 dark:bg-black/30"
      >
        <option value="BUY">BUY</option>
        <option value="SELL">SELL</option>
      </select>

      <input
        type="number"
        step="0.0001"
        placeholder="Entry"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        className="p-3 rounded bg-gray-100 dark:bg-black/30"
      />

      <input
        type="number"
        step="0.0001"
        placeholder="Exit"
        value={exit}
        onChange={(e) => setExit(e.target.value)}
        className="p-3 rounded bg-gray-100 dark:bg-black/30"
      />

      <input
        type="number"
        step="0.01"
        placeholder="Lot Size"
        value={lot}
        onChange={(e) => setLot(e.target.value)}
        className="p-3 rounded bg-gray-100 dark:bg-black/30"
      />

      <button
        type="submit"
        disabled={loading}
        className="
          bg-cyan-600 hover:bg-cyan-700
          text-white font-semibold
          rounded p-3
        "
      >
        {loading ? "Saving..." : "Add Trade"}
      </button>
    </form>
  );
}