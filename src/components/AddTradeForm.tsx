"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { ChevronDown } from "lucide-react";
import { useTradesStore } from "@/hooks/useTradesStore";

export default function AddTradeForm() {
  const { session } = useAuth();

  const [pair, setPair] = useState("");

  // ✅ CUSTOM BIAS DROPDOWN
  const [bias, setBias] =
    useState<"BUY" | "SELL" | "">("");

  const [biasOpen, setBiasOpen] =
    useState(false);

  const [entry, setEntry] = useState("");
  const [exit, setExit] = useState("");
  const [lot, setLot] = useState("");

  // ✅ MANUAL PROFIT INPUT
  const [profit, setProfit] =
    useState("");
const [tradeDate, setTradeDate] = useState("");


  const [loading, setLoading] =
    useState(false);

  const inputStyles = `
    px-4 py-3 rounded-lg
    bg-white dark:bg-[#111827]
    border border-gray-200/70 dark:border-white/10
    text-black dark:text-white
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    focus:outline-none focus:ring-2 focus:ring-cyan-400
  `;

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!session?.user?.id) {
      alert("No session found");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        user_id: session.user.id,

        pair,
        bias,

        entry: Number(entry),
        exit: Number(exit),

        lot: Number(lot),

        // ✅ MANUAL PROFIT
        profit: Number(profit),

        tradeDate,
      };

      const { data, error } =
        await supabase
          .from("trades")
          .insert([payload])
          .select();

      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }

      console.log(
        "INSERT SUCCESS:",
        data
      );
    
      // ✅ RESET
      setPair("");

      setBias("");
      setBiasOpen(false);

      setEntry("");
      setExit("");
      setLot("");

      setProfit("");
      setTradeDate("");

    } catch (err) {
      console.error(err);
      alert("Something crashed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
        gap-4
        p-6 rounded-2xl
        bg-white/60 dark:bg-white/5
        backdrop-blur-xl
        border border-gray-200/70 dark:border-white/10
        shadow-sm
      "
    >
      {/* PAIR */}
      <input
        type="text"
        placeholder="Pair"
        value={pair}
        onChange={(e) =>
          setPair(e.target.value)
        }
        className={inputStyles}
      />

      {/* CUSTOM BIAS DROPDOWN */}
      <div className="relative">
        <button
          type="button"
          onClick={() =>
            setBiasOpen(!biasOpen)
          }
          className={`
            ${inputStyles}
            w-full flex items-center
            justify-between text-left
          `}
        >
          <span
            className={`
              ${
                bias
                  ? bias === "BUY"
                    ? "text-green-500"
                    : "text-red-500"
                  : "text-gray-400 dark:text-gray-500"
              }
            `}
          >
            {bias || "BIAS"}
          </span>

          <ChevronDown
            size={18}
            className={`
              transition-transform duration-300
              text-gray-500
              ${
                biasOpen
                  ? "rotate-180"
                  : ""
              }
            `}
          />
        </button>

        {/* DROPDOWN MENU */}
        <div
          className={`
            absolute mt-2 w-full z-50
            bg-white dark:bg-[#111827]
            border border-gray-200/70 dark:border-white/10
            rounded-lg shadow-lg overflow-hidden
            transition-all duration-200 origin-top
            ${
              biasOpen
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }
          `}
        >
          {["BUY", "SELL"].map(
            (item) => (
              <div
                key={item}
                onClick={() => {
                  setBias(
                    item as
                      | "BUY"
                      | "SELL"
                  );

                  setBiasOpen(false);
                }}
                className={`
                  px-4 py-3 cursor-pointer transition
                  hover:bg-cyan-50 dark:hover:bg-white/10
                  ${
                    item === "BUY"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                `}
              >
                {item}
              </div>
            )
          )}
        </div>
      </div>

      {/* ENTRY */}
      <input
        type="number"
        step="0.0001"
        placeholder="Entry"
        value={entry}
        onChange={(e) =>
          setEntry(e.target.value)
        }
        className={inputStyles}
      />

      {/* EXIT */}
      <input
        type="number"
        step="0.0001"
        placeholder="Exit"
        value={exit}
        onChange={(e) =>
          setExit(e.target.value)
        }
        className={inputStyles}
      />

      {/* LOT SIZE */}
      <input
        type="number"
        step="0.01"
        placeholder="Lot Size"
        value={lot}
        onChange={(e) =>
          setLot(e.target.value)
        }
        className={inputStyles}
      />

      {/* PROFIT */}
      <input
        type="number"
        step="0.01"
        placeholder="Profit / Loss"
        value={profit}
        onChange={(e) =>
          setProfit(e.target.value)
        }
        className={inputStyles}
      />
      <input
  type="date"
  value={tradeDate}
  onChange={(e) => setTradeDate(e.target.value)}
  className={`
    ${inputStyles}
    [color-scheme:light] dark:[color-scheme:dark]
    
  `}
/>

      {/* BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="
          px-5 py-3 rounded-lg
          bg-cyan-500 hover:bg-cyan-600
          text-white font-medium
          transition-all duration-200
          hover:shadow-lg
        "
      >
        {loading
          ? "Saving..."
          : "Add Trade"}
      </button>
    </form>
  );
}