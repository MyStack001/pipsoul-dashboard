"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { trades as allTrades } from "@/data/trades";
import type { Trade } from "@/data/trades";

export default function TradesTable({ pair }: { pair: string }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const itemsPerPage = 5;

  const filteredTrades: Trade[] = useMemo(() => {
    return allTrades
      .filter((t) => pair === "ALL" || t.pair === pair)
      .filter((t) =>
        t.pair.toLowerCase().includes(search.toLowerCase())
      );
  }, [pair, search]);

  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage);

  const paginatedTrades: Trade[] = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTrades.slice(start, start + itemsPerPage);
  }, [filteredTrades, currentPage]);

  const sortedTrades: Trade[] = useMemo(() => {
    return [...paginatedTrades].sort((a, b) => {
      return sortOrder === "asc"
        ? a.profit - b.profit
        : b.profit - a.profit;
    });
  }, [paginatedTrades, sortOrder]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-lg bg-white/60 dark:bg-white/5 border border-white/20 dark:border-white/10 text-black dark:text-white rounded-xl shadow-lg p-4"
    >
      <h2 className="text-lg font-semibold mb-4">Trades</h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search pair..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="mb-3 p-2 w-full rounded bg-white/70 dark:bg-white/10 border border-white/20 dark:border-white/10"
      />

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-gray-300/70 dark:border-white/10">
            <th>Pair</th>
            <th>Date</th> {/* ✅ NEW */}
            <th>Entry</th>
            <th>Exit</th>
            <th>Lot</th>
            <th
              className="cursor-pointer"
              onClick={() =>
                setSortOrder(sortOrder === "asc" ? "desc" : "asc")
              }
            >
              Profit {sortOrder === "asc" ? "↑" : "↓"}
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedTrades.map((trade) => (
            <tr
              key={trade.id}
              className="border-b border-gray-200/80 dark:border-white/10 hover:bg-cyan-50/70 dark:hover:bg-white/10"
            >
              <td>{trade.pair}</td>
              <td>{trade.date}</td> {/* ✅ NEW */}
              <td>{trade.entry}</td>
              <td>{trade.exit}</td>
              <td>{trade.lot}</td>
              <td className={trade.profit > 0 ? "text-green-500" : "text-red-500"}>
                {trade.profit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex gap-2 mt-4 items-center">
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
          Prev
        </button>

        <span>
          {currentPage} / {totalPages || 1}
        </span>

        <button
          onClick={() =>
            setCurrentPage((p) => Math.min(p + 1, totalPages))
          }
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}