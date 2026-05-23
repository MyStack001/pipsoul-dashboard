"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { useAuth } from "@/components/AuthProvider";
import { useTradesStore } from "@/hooks/useTradesStore";

export default function TradesTable({
  pair,
}: {
  pair: string;
}) {
  const { session } = useAuth();

  const { trades } = useTradesStore();

  const [search, setSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [sortOrder, setSortOrder] =
    useState<"asc" | "desc">("desc");

  const itemsPerPage = 5;

  // FILTER
  const filteredTrades = useMemo(() => {
    if (!Array.isArray(trades))
      return [];

    if (pair === "ALL")
      return trades;

    return trades.filter(
      (t) => t.pair === pair
    );
  }, [trades, pair]);

  // SEARCH
  const searchedTrades = useMemo(() => {
    return filteredTrades.filter((t) =>
      t.pair
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [filteredTrades, search]);

  // PAGINATION
  const totalPages = Math.ceil(
    searchedTrades.length /
      itemsPerPage
  );

  const paginatedTrades =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        itemsPerPage;

      return searchedTrades.slice(
        start,
        start + itemsPerPage
      );
    }, [
      searchedTrades,
      currentPage,
    ]);

  // SORT
  const sortedTrades = useMemo(() => {
    return [...paginatedTrades].sort(
      (a, b) => {
        const profitA = Number(
          a.profit || 0
        );

        const profitB = Number(
          b.profit || 0
        );

        return sortOrder === "asc"
          ? profitA - profitB
          : profitB - profitA;
      }
    );
  }, [
    paginatedTrades,
    sortOrder,
  ]);

  if (!session) return null;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        p-6 rounded-2xl
        bg-white/60 dark:bg-white/5
        backdrop-blur-xl
        border border-gray-200/70 dark:border-white/10
        shadow-sm
        overflow-x-auto
      "
    >
      {/* HEADER */}
      <div
        className="
          flex items-center
          justify-between
          mb-5
        "
      >
        <h2
          className="
            text-lg font-semibold
            text-black dark:text-white
          "
        >
          Trades
        </h2>

        <button
          onClick={() =>
            setSortOrder(
              sortOrder === "asc"
                ? "desc"
                : "asc"
            )
          }
          className="
            px-4 py-2 rounded-lg
            bg-cyan-500 hover:bg-cyan-600
            text-white text-sm
            transition-all duration-200
          "
        >
          Sort:
          {" "}
          {sortOrder === "asc"
            ? "Lowest"
            : "Highest"}
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => {
          setSearch(
            e.target.value
          );

          setCurrentPage(1);
        }}
        placeholder="Search pair..."
        className="
          mb-5 w-full
          px-4 py-3 rounded-lg
          bg-white dark:bg-[#111827]
          border border-gray-200/70 dark:border-white/10
          text-black dark:text-white
          placeholder:text-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-cyan-400
        "
      />

      {/* TABLE */}
<table className="w-full text-sm">
  <thead
    className="
      bg-gray-100/70
      dark:bg-white/10
    "
  >
    <tr>
      <th
        className="
          px-4 py-3 text-left
          text-black dark:text-white
        "
      >
        Pair
      </th>

      <th
        className="
          px-4 py-3 text-left
          text-black dark:text-white
        "
      >
        Bias
      </th>

      <th
        className="
          px-4 py-3 text-left
          text-black dark:text-white
        "
      >
        Entry
      </th>

      <th
        className="
          px-4 py-3 text-left
          text-black dark:text-white
        "
      >
        Exit
      </th>

      <th
        className="
          px-4 py-3 text-left
          text-black dark:text-white
        "
      >
        Lot
      </th>

      <th
        className="
          px-4 py-3 text-left
          text-black dark:text-white
        "
      >
        Profit
      </th>

      {/* NEW */}
      <th
        className="
          px-4 py-3 text-left
          text-black dark:text-white
        "
      >
        Journal
      </th>
    </tr>
  </thead>

  <tbody>
    {sortedTrades.map((trade) => (
      <tr
        key={trade.id}
        className="
          border-t
          border-gray-200/50
          dark:border-white/10
          hover:bg-black/5
          dark:hover:bg-white/5
          transition
        "
      >
        <td
          className="
            px-4 py-4
            text-black
            dark:text-white
          "
        >
          {trade.pair}
        </td>

        <td
          className={`
            px-4 py-4 font-medium
            ${
              trade.bias === "BUY"
                ? "text-green-500"
                : "text-red-500"
            }
          `}
        >
          {trade.bias}
        </td>

        <td
          className="
            px-4 py-4
            text-black
            dark:text-white
          "
        >
          {trade.entry}
        </td>

        <td
          className="
            px-4 py-4
            text-black
            dark:text-white
          "
        >
          {trade.exit}
        </td>

        <td
          className="
            px-4 py-4
            text-black
            dark:text-white
          "
        >
          {trade.lot}
        </td>

        <td
          className={`
            px-4 py-4 font-semibold
            ${
              Number(trade.profit) >= 0
                ? "text-green-500"
                : "text-red-500"
            }
          `}
        >
          $
          {Number(
            trade.profit
          ).toFixed(2)}
        </td>

        {/* OPEN JOURNAL LINK */}
        <td className="px-4 py-4">
          <a
            href={`/journal/${trade.id}`}
            className="
              text-cyan-500
              hover:text-cyan-400
              transition-colors duration-200
              font-medium
            "
          >
            Open Journal
          </a>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      {/* EMPTY */}
      {sortedTrades.length ===
        0 && (
        <div
          className="
            py-10 text-center
            text-gray-500
            dark:text-gray-400
          "
        >
          No trades found
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div
          className="
            flex items-center
            justify-center gap-3
            mt-6
          "
        >
          <button
            disabled={
              currentPage === 1
            }
            onClick={() =>
              setCurrentPage(
                (prev) =>
                  prev - 1
              )
            }
            className="
              px-4 py-2 rounded-lg
              bg-white dark:bg-[#111827]
              border border-gray-200/70 dark:border-white/10
              text-black dark:text-white
              disabled:opacity-40
            "
          >
            Prev
          </button>

          <span
            className="
              text-black dark:text-white
            "
          >
            {currentPage} /{" "}
            {totalPages}
          </span>

          <button
            disabled={
              currentPage ===
              totalPages
            }
            onClick={() =>
              setCurrentPage(
                (prev) =>
                  prev + 1
              )
            }
            className="
              px-4 py-2 rounded-lg
              bg-white dark:bg-[#111827]
              border border-gray-200/70 dark:border-white/10
              text-black dark:text-white
              disabled:opacity-40
            "
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
}