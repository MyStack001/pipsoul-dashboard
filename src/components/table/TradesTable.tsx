"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Trade } from "@/types/trade";

import { useAuth } from "@/components/AuthProvider";
import { useTradesRealtime } from "@/hooks/useTradesRealtime";

export default function TradesTable({ pair }: { pair: string }) {
  const { session } = useAuth();

  const { filteredTrades } = useTradesRealtime(pair);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const itemsPerPage = 5;

  // FILTER + SEARCH
  const searchedTrades: Trade[] = useMemo(() => {
    return filteredTrades.filter((t) =>
      t.pair.toLowerCase().includes(search.toLowerCase())
    );
  }, [filteredTrades, search]);

  // PAGINATION
  const totalPages = Math.ceil(searchedTrades.length / itemsPerPage);

  const paginatedTrades: Trade[] = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return searchedTrades.slice(start, start + itemsPerPage);
  }, [searchedTrades, currentPage]);

  // SORTING
  const sortedTrades: Trade[] = useMemo(() => {
    return [...paginatedTrades].sort((a, b) =>
      sortOrder === "asc"
        ? a.profit - b.profit
        : b.profit - a.profit
    );
  }, [paginatedTrades, sortOrder]);

  if (!session) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-lg bg-white/60 dark:bg-white/5 border border-white/20 dark:border-white/10 text-black dark:text-white rounded-xl shadow-lg p-4 overflow-x-auto"
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

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-gray-300/70 dark:border-white/10">
            <th className="py-3">Pair</th>
            <th className="py-3">Date</th>
            <th className="py-3">Bias</th>
            <th className="py-3">Entry</th>
            <th className="py-3">Exit</th>
            <th className="py-3">Lot</th>

            <th
              className="py-3 cursor-pointer"
              onClick={() =>
                setSortOrder(sortOrder === "asc" ? "desc" : "asc")
              }
            >
              Profit {sortOrder === "asc" ? "↑" : "↓"}
            </th>

            <th className="py-3">Journal</th>
          </tr>
        </thead>

        <tbody>
          {sortedTrades.map((trade) => (
            <tr
              key={trade.id}
              className="border-b border-gray-200/80 dark:border-white/10 hover:bg-cyan-50/70 dark:hover:bg-white/10 transition"
            >
              <td className="py-4">{trade.pair}</td>
              <td className="py-4">{trade.date}</td>

              <td className="py-4">
                <span
                  className={
                    trade.bias === "BUY"
                      ? "text-green-500 font-semibold"
                      : "text-red-500 font-semibold"
                  }
                >
                  {trade.bias}
                </span>
              </td>

              <td className="py-4">{trade.entry}</td>
              <td className="py-4">{trade.exit}</td>
              <td className="py-4">{trade.lot}</td>

              <td
                className={`py-4 font-medium ${
                  trade.profit >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                ${trade.profit}
              </td>

              <td className="py-4 whitespace-nowrap">
                <Link
                  href={`/journal?id=${trade.id}`}
                  className="text-cyan-500 hover:underline"
                >
                  Open Journal
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex gap-3 mt-4 items-center">
        <button
          onClick={() =>
            setCurrentPage((p) => Math.max(p - 1, 1))
          }
          className="px-3 py-1 rounded-lg bg-white/70 dark:bg-white/10 border border-white/20 dark:border-white/10"
        >
          Prev
        </button>

        <span>
          {currentPage} / {totalPages || 1}
        </span>

        <button
          onClick={() =>
            setCurrentPage((p) =>
              Math.min(p + 1, totalPages || 1)
            )
          }
          className="px-3 py-1 rounded-lg bg-white/70 dark:bg-white/10 border border-white/20 dark:border-white/10"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}