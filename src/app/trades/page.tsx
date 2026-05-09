"use client";

import { useState } from "react";

export default function TradesPage() {
  const [form, setForm] = useState({
    pair: "",
    entry: "",
    exit: "",
    lot: "",
    profit: "",
    date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
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
      <div
        className="
          p-6 rounded-2xl
          bg-white/60 dark:bg-white/5
          backdrop-blur-xl
          border border-gray-200/70 dark:border-white/10
          shadow-sm
        "
      >
        <h2 className="text-lg font-medium mb-4 text-black dark:text-white">
          Add New Trade
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

          <input
  type="date"
  name="date"
  value={form.date}
  onChange={handleChange}
  className={`
    ${inputStyles}
    dark:[color-scheme:dark]
  `}
/>
        </div>

        {/* BUTTON */}
        <button
          className="
            mt-6 px-5 py-3 rounded-lg
            bg-cyan-500 hover:bg-cyan-600
            text-white font-medium
            transition-all duration-200
            hover:shadow-lg
          "
        >
          Add Trade
        </button>
      </div>

      {/* TABLE */}
      <div
        className="
          rounded-2xl overflow-hidden
          bg-white/60 dark:bg-white/5
          backdrop-blur-xl
          border border-gray-200/70 dark:border-white/10
          shadow-sm
        "
      >
        <table className="w-full">

          <thead
            className="
              bg-gray-100/70 dark:bg-white/10
              text-left
            "
          >
            <tr>
              <th className="px-6 py-4 text-black dark:text-white">
                Pair
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
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-gray-200/50 dark:border-white/10">

              <td className="px-6 py-4 text-black dark:text-white">
                GBPJPY
              </td>

              <td className="px-6 py-4 text-black dark:text-white">
                198.200
              </td>

              <td className="px-6 py-4 text-black dark:text-white">
                199.100
              </td>

              <td className="px-6 py-4 text-black dark:text-white">
                0.10
              </td>

              <td className="px-6 py-4 text-green-500">
                +$120
              </td>

              <td className="px-6 py-4 text-black dark:text-white">
                2026-05-09
              </td>

            </tr>
          </tbody>

        </table>
      </div>

    </div>
  );
}