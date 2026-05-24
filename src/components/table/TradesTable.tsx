"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/AuthProvider";
import { useTradesStore } from "@/hooks/useTradesStore";
import { supabase } from "@/lib/supabase";

export default function TradesTable({ pair }: { pair: string }) {
  const { session } = useAuth();
  const router = useRouter();
  const { trades } = useTradesStore();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const itemsPerPage = 5;

  // FILTER
  const filteredTrades = useMemo(() => {
    if (!Array.isArray(trades)) return [];
    if (pair === "ALL") return trades;

    return trades.filter((t) => t.pair === pair);
  }, [trades, pair]);

  // SEARCH
  const searchedTrades = useMemo(() => {
    return filteredTrades.filter((t) =>
      t.pair.toLowerCase().includes(search.toLowerCase())
    );
  }, [filteredTrades, search]);

  // PAGINATION
  const totalPages = Math.ceil(searchedTrades.length / itemsPerPage);

  const paginatedTrades = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return searchedTrades.slice(start, start + itemsPerPage);
  }, [searchedTrades, currentPage]);

  // SORT
  const sortedTrades = useMemo(() => {
    return [...paginatedTrades].sort((a, b) => {
      const aProfit = Number(a.profit || 0);
      const bProfit = Number(b.profit || 0);

      return sortOrder === "asc"
        ? aProfit - bProfit
        : bProfit - aProfit;
    });
  }, [paginatedTrades, sortOrder]);

  if (!session) {
    return <p className="p-6">No session</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-white/60 dark:bg-white/5"
    >
      {/* HEADER */}
      <div className="flex justify-between mb-5">
        <h2 className="text-lg font-semibold">Trades</h2>

        <button
          onClick={() =>
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
          }
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg"
        >
          Sort
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        placeholder="Search pair..."
        className="mb-5 w-full p-3 border rounded-lg"
      />

      {/* TABLE */}
<table className="w-full text-sm border-collapse">
  <thead>
    <tr className="border-b border-gray-200 dark:border-white/10">
      <th className="px-4 py-3 text-left">Pair</th>
      <th className="px-4 py-3 text-left">Bias</th>
      <th className="px-4 py-3 text-left">Entry</th>
      <th className="px-4 py-3 text-left">Exit</th>
      <th className="px-4 py-3 text-left">Lot</th>
      <th className="px-4 py-3 text-left">Profit</th>
      <th className="px-4 py-3 text-left">Journal</th>
    </tr>
  </thead>

  <tbody>
    {sortedTrades.map((trade) => (
      <tr
        key={trade.id}
        className="border-b border-gray-200 dark:border-white/10"
      >
        <td className="px-4 py-3">{trade.pair}</td>

        <td
          className={`px-4 py-3 font-medium ${
            trade.bias === "BUY"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {trade.bias}
        </td>

        <td className="px-4 py-3">
          {trade.entry}
        </td>

        <td className="px-4 py-3">
          {trade.exit}
        </td>

        <td className="px-4 py-3">
          {trade.lot}
        </td>

        <td className="px-4 py-3 font-semibold">
          ${trade.profit}
        </td>

        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                router.push(
                  `/journal?id=${trade.id}`
                )
              }
              className="text-cyan-500 hover:text-cyan-400"
            >
              Edit
            </button>

            <a
              href="/journal"
              className="text-gray-500 hover:text-gray-400"
            >
              View
            </a>

            <button
              onClick={async () => {
                const confirmDelete =
                  confirm("Delete?");

                if (!confirmDelete) return;

                const { error } =
                  await supabase
                    .from("trades")
                    .delete()
                    .eq("id", trade.id);

                if (error) {
                  alert(error.message);
                }
              }}
              className="text-red-500 hover:text-red-400"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
      {sortedTrades.length === 0 && (
        <p className="text-center text-gray-500 mt-5">
          No trades found
        </p>
      )}
    </motion.div>
  );
}