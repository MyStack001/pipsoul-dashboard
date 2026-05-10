"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Trade } from "@/types/trade";

export default function TradesPage() {

  // ✅ FORM STATE
  const [form, setForm] = useState({
    pair: "",
    entry: "",
    exit: "",
    lot: "",
    profit: "",
    date: "",
    bias: "BUY" as "BUY" | "SELL",
  });

  // ✅ TRADES STATE
  const [trades, setTrades] = useState<Trade[]>([]);

  // ✅ EDIT MODE
  const [editingId, setEditingId] = useState<number | null>(null);

  // ✅ CUSTOM DROPDOWN
  const [biasOpen, setBiasOpen] = useState(false);

  const biasDropdownRef = useRef<HTMLDivElement>(null);

  // ✅ LOAD SAVED TRADES
  useEffect(() => {

    const savedTrades = localStorage.getItem("trades");

    if (savedTrades) {
      setTrades(JSON.parse(savedTrades));
    }

  }, []);

  // ✅ AUTO SAVE TRADES
  useEffect(() => {

    localStorage.setItem(
      "trades",
      JSON.stringify(trades)
    );

  }, [trades]);

  // ✅ CLOSE DROPDOWN OUTSIDE CLICK
  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {

      if (
        biasDropdownRef.current &&
        !biasDropdownRef.current.contains(event.target as Node)
      ) {
        setBiasOpen(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

  }, []);

  // ✅ INPUT HANDLER
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  // ✅ ADD / UPDATE TRADE
  const handleAddTrade = () => {

    if (
      !form.pair ||
      !form.entry ||
      !form.exit ||
      !form.lot ||
      !form.profit ||
      !form.date
    ) {
      return;
    }

    const newTrade: Trade = {
      id: editingId || Date.now(),
      pair: form.pair,
      entry: Number(form.entry),
      exit: Number(form.exit),
      lot: Number(form.lot),
      profit: Number(form.profit),
      date: form.date,
      bias: form.bias,
    };

    // ✅ UPDATE EXISTING TRADE
    if (editingId) {

      const updatedTrades = trades.map((trade) =>
        trade.id === editingId
          ? newTrade
          : trade
      );

      setTrades(updatedTrades);

      setEditingId(null);

    } else {

      // ✅ ADD NEW TRADE
      setTrades([newTrade, ...trades]);

    }

    // ✅ RESET FORM
    setForm({
      pair: "",
      entry: "",
      exit: "",
      lot: "",
      profit: "",
      date: "",
      bias: "BUY",
    });

  };

  const inputStyles = `
    px-4 py-3 rounded-lg
    bg-white dark:bg-[#111827]
    border border-gray-200/70 dark:border-white/10
    text-black dark:text-white
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    focus:outline-none focus:ring-2 focus:ring-cyan-400
  `;

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Trades
        </h1>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          Manage and review your trading activity
        </p>
      </div>

      {/* ADD TRADE CARD */}
      <div className="
        p-6 rounded-2xl
        bg-white/60 dark:bg-white/5
        backdrop-blur-xl
        border border-gray-200/70 dark:border-white/10
        shadow-sm
      ">

        <h2 className="text-lg font-medium mb-4 text-black dark:text-white">
          {editingId ? "Edit Trade" : "Add New Trade"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <input
            type="text"
            name="pair"
            placeholder="Pair (e.g. GBPJPY)"
            value={form.pair}
            onChange={handleChange}
            className={inputStyles}
          />

          <input
            type="number"
            name="entry"
            placeholder="Entry Price"
            value={form.entry}
            onChange={handleChange}
            className={inputStyles}
          />

          <input
            type="number"
            name="exit"
            placeholder="Exit Price"
            value={form.exit}
            onChange={handleChange}
            className={inputStyles}
          />

          <input
            type="number"
            name="lot"
            placeholder="Lot Size"
            value={form.lot}
            onChange={handleChange}
            className={inputStyles}
          />

          <input
            type="number"
            name="profit"
            placeholder="Profit / Loss"
            value={form.profit}
            onChange={handleChange}
            className={inputStyles}
          />

          {/* DATE */}
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className={`${inputStyles} dark:[color-scheme:dark]`}
          />

          {/* BUY / SELL DROPDOWN */}
          <div ref={biasDropdownRef} className="relative">

            <button
              type="button"
              onClick={() => setBiasOpen(!biasOpen)}
              className="
                w-full flex items-center justify-between
                px-4 py-3 rounded-lg
                bg-white dark:bg-[#111827]
                border border-gray-200/70 dark:border-white/10
                text-black dark:text-white
                hover:shadow-sm transition-all
              "
            >
              <span
                className={`font-medium ${
                  form.bias === "BUY"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {form.bias}
              </span>

              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  biasOpen ? "rotate-180" : ""
                }`}
              />
            </button>

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

              {["BUY", "SELL"].map((bias) => (

                <div
                  key={bias}
                  onClick={() => {

                    setForm({
                      ...form,
                      bias: bias as "BUY" | "SELL",
                    });

                    setBiasOpen(false);

                  }}
                  className={`
                    px-4 py-3 cursor-pointer transition
                    hover:bg-cyan-50 dark:hover:bg-white/10
                    ${
                      bias === "BUY"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  `}
                >
                  {bias}
                </div>

              ))}

            </div>

          </div>

        </div>

        {/* BUTTON */}
        <button
          onClick={handleAddTrade}
          className="
            mt-6 px-5 py-3 rounded-lg
            bg-cyan-500 hover:bg-cyan-600
            text-white font-medium
            transition-all duration-200
            hover:shadow-lg
          "
        >
          {editingId ? "Update Trade" : "Add Trade"}
        </button>

      </div>

      {/* TABLE */}
      <div className="
        rounded-2xl overflow-hidden
        bg-white/60 dark:bg-white/5
        backdrop-blur-xl
        border border-gray-200/70 dark:border-white/10
        shadow-sm overflow-x-auto
      ">

        <table className="w-full">

          <thead className="bg-gray-100/70 dark:bg-white/10 text-left">

            <tr>
              <th className="px-6 py-4 text-black dark:text-white">
                Pair
              </th>

              <th className="px-6 py-4 text-black dark:text-white">
                Bias
              </th>

              <th className="px-6 py-4 text-black dark:text-white">
                Entry
              </th>

              <th className="px-6 py-4 text-black dark:text-white">
                Exit
              </th>

              <th className="px-6 py-4 text-black dark:text-white">
                Lot
              </th>

              <th className="px-6 py-4 text-black dark:text-white">
                Profit
              </th>

              <th className="px-6 py-4 text-black dark:text-white">
                Date
              </th>

              <th className="px-6 py-4 text-black dark:text-white">
                Actions
              </th>
            </tr>

          </thead>

          <tbody>

            {trades.map((trade) => (

              <tr
                key={trade.id}
                className="border-t border-gray-200/50 dark:border-white/10"
              >

                <td className="px-6 py-4 text-black dark:text-white">
                  {trade.pair}
                </td>

                <td
                  className={`px-6 py-4 font-semibold ${
                    trade.bias === "BUY"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {trade.bias}
                </td>

                <td className="px-6 py-4 text-black dark:text-white">
                  {trade.entry}
                </td>

                <td className="px-6 py-4 text-black dark:text-white">
                  {trade.exit}
                </td>

                <td className="px-6 py-4 text-black dark:text-white">
                  {trade.lot}
                </td>

                <td
                  className={`px-6 py-4 font-semibold ${
                    trade.profit >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  ${trade.profit}
                </td>

                <td className="px-6 py-4 text-black dark:text-white">
                  {trade.date}
                </td>

                <td className="px-6 py-4 flex gap-2">

                  {/* EDIT */}
                  <button
                    onClick={() => {

                      setForm({
                        pair: trade.pair,
                        entry: String(trade.entry),
                        exit: String(trade.exit),
                        lot: String(trade.lot),
                        profit: String(trade.profit),
                        date: trade.date,
                        bias: trade.bias,
                      });

                      setEditingId(trade.id);

                    }}
                    className="
                      px-3 py-1 rounded-lg
                      bg-cyan-500 hover:bg-cyan-600
                      text-white text-sm
                      transition
                    "
                  >
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => {

                      const filteredTrades =
                        trades.filter(
                          (t) => t.id !== trade.id
                        );

                      setTrades(filteredTrades);

                    }}
                    className="
                      px-3 py-1 rounded-lg
                      bg-red-500 hover:bg-red-600
                      text-white text-sm
                      transition
                    "
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}