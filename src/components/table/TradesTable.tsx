"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import type { Trade } from "@/types/trade";
import { toast } from "sonner";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { createNotification } from "@/lib/notifications";

export default function TradesTable({
  pair,
  trades,
}: {
  pair: string;
  trades: Trade[];
}) {
  const { session } = useAuth();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] =
    useState<"asc" | "desc">("desc");

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [tradeToDelete, setTradeToDelete] =
    useState<Trade | null>(null);

  const [deleting, setDeleting] = useState(false);

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
      t.pair
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [filteredTrades, search]);

  // PAGINATION
  const totalPages = Math.ceil(
    searchedTrades.length / itemsPerPage
  );

  const paginatedTrades = useMemo(() => {
    const start =
      (currentPage - 1) * itemsPerPage;

    return searchedTrades.slice(
      start,
      start + itemsPerPage
    );
  }, [searchedTrades, currentPage]);

  // SORT
  const sortedTrades = useMemo(() => {
    return [...paginatedTrades].sort((a, b) => {
      const aDate = new Date(
        a.tradeDate || 0
      ).getTime();

      const bDate = new Date(
        b.tradeDate || 0
      ).getTime();

      return sortOrder === "asc"
        ? aDate - bDate
        : bDate - aDate;
    });
  }, [paginatedTrades, sortOrder]);

  if (!session) {
    return (
      <p className="p-6">
        No session
      </p>
    );
  }

  async function handleDeleteTrade() {
    if (!tradeToDelete) return;

    setDeleting(true);

    const { error } = await supabase
      .from("trades")
      .delete()
      .eq("id", tradeToDelete.id);

    setDeleting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    await createNotification(
      session!.user.id,
      "Trade Deleted",
      `${tradeToDelete.pair} trade has been deleted.`,
      "warning"
    );

    toast.success(
      "Trade deleted successfully."
    );

    setShowDeleteModal(false);
    setTradeToDelete(null);
  }

  return (
    <>
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
          min-w-0
          rounded-2xl
          bg-white/60
          p-4
          dark:bg-white/5
          sm:p-6
        "
      >
        {/* HEADER */}
        <div
          className="
            mb-4
            flex
            flex-col
            gap-3
            sm:mb-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <h2
            className="
              text-lg
              font-semibold
              text-gray-900
              dark:text-white
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
  min-h-[48px]
  w-full
  rounded-lg
  bg-cyan-500
  px-5
  py-3
  text-sm
  font-semibold
  text-white
  transition-all
  duration-200
  hover:bg-cyan-600
  hover:shadow-lg
  sm:w-auto
"
          >
            {sortOrder === "desc"
              ? "Newest First"
              : "Oldest First"}
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
          className="
            mb-5
            min-h-[46px]
            w-full
            rounded-lg
            border
            border-gray-200
            bg-white
            p-3
            text-sm
            text-black
            outline-none
            transition-all
            focus:border-cyan-400/50
            focus:ring-2
            focus:ring-cyan-400/10
            dark:border-white/10
            dark:bg-[#111827]
            dark:text-white
          "
        />

        {/* ========================= */}
        {/* MOBILE TRADE CARDS */}
        {/* ========================= */}
        <div className="space-y-3 md:hidden">
          {sortedTrades.map((trade) => (
            <motion.div
              key={trade.id}
              initial={{
                opacity: 0,
                y: 5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                rounded-xl
                border
                border-gray-200/70
                bg-white/70
                p-4
                shadow-sm
                dark:border-white/10
                dark:bg-[#111827]/70
              "
            >
              {/* Top row */}
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-3
                "
              >
                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-base
                      font-semibold
                      text-gray-900
                      dark:text-white
                    "
                  >
                    {trade.pair}
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    {trade.tradeDate
                      ? new Date(
                          trade.tradeDate
                        ).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "-"}
                  </p>
                </div>

                <span
                  className={`
                    shrink-0
                    rounded-full
                    px-2.5
                    py-1
                    text-xs
                    font-semibold
                    ${
                      trade.bias === "BUY"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }
                  `}
                >
                  {trade.bias}
                </span>
              </div>

              {/* Profit */}
              <div
                className="
                  mt-4
                  flex
                  items-center
                  justify-between
                  rounded-lg
                  bg-gray-50
                  px-3
                  py-2.5
                  dark:bg-white/5
                "
              >
                <span
                  className="
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Profit
                </span>

                <span
                  className={`
                    text-base
                    font-bold
                    ${
                      Number(trade.profit) >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  `}
                >
                  $
                  {trade.profit}
                </span>
              </div>

              {/* Trade details */}
              <div
                className="
                  mt-4
                  grid
                  grid-cols-3
                  gap-3
                "
              >
                <div>
                  <p
                    className="
                      text-[11px]
                      text-gray-400
                      dark:text-gray-500
                    "
                  >
                    Entry
                  </p>

                  <p
                    className="
                      mt-1
                      truncate
                      text-sm
                      font-medium
                      text-gray-900
                      dark:text-white
                    "
                  >
                    {trade.entry_display ??
                      trade.entry}
                  </p>
                </div>

                <div>
                  <p
                    className="
                      text-[11px]
                      text-gray-400
                      dark:text-gray-500
                    "
                  >
                    Exit
                  </p>

                  <p
                    className="
                      mt-1
                      truncate
                      text-sm
                      font-medium
                      text-gray-900
                      dark:text-white
                    "
                  >
                    {trade.exit_display ??
                      trade.exit}
                  </p>
                </div>

                <div>
                  <p
                    className="
                      text-[11px]
                      text-gray-400
                      dark:text-gray-500
                    "
                  >
                    Lot
                  </p>

                  <p
                    className="
                      mt-1
                      truncate
                      text-sm
                      font-medium
                      text-gray-900
                      dark:text-white
                    "
                  >
                    {trade.lot}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div
                className="
                  mt-4
                  flex
                  items-center
                  gap-4
                  border-t
                  border-gray-200
                  pt-3
                  dark:border-white/10
                "
              >
                <button
                  onClick={() =>
                    router.push(
                      `/journal?id=${trade.id}`
                    )
                  }
                  className="
                    min-h-[40px]
                    text-sm
                    font-medium
                    text-cyan-500
                    hover:text-cyan-400
                  "
                >
                  Edit
                </button>

                <a
                  href="/journal"
                  className="
                    flex
                    min-h-[40px]
                    items-center
                    text-sm
                    font-medium
                    text-gray-700
                    hover:text-gray-900
                    dark:text-gray-300
                    dark:hover:text-white
                  "
                >
                  View
                </a>

                <button
                  onClick={() => {
                    setTradeToDelete(trade);
                    setShowDeleteModal(true);
                  }}
                  className="
                    min-h-[40px]
                    text-sm
                    font-medium
                    text-red-500
                    hover:text-red-400
                  "
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ========================= */}
        {/* DESKTOP TABLE */}
        {/* ========================= */}
        <div className="hidden overflow-x-auto rounded-xl md:block">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10">
                <th className="whitespace-nowrap px-4 py-3 text-left text-gray-900 dark:text-white">
                  Pair
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left text-gray-900 dark:text-white">
                  Bias
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left text-gray-900 dark:text-white">
                  Entry
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left text-gray-900 dark:text-white">
                  Exit
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left text-gray-900 dark:text-white">
                  Lot
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left text-gray-900 dark:text-white">
                  Profit
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left text-gray-900 dark:text-white">
                  Date
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left text-gray-900 dark:text-white">
                  Journal
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedTrades.map((trade) => (
                <tr
                  key={trade.id}
                  className="border-b border-gray-200 dark:border-white/10"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-gray-900 dark:text-white">
                    {trade.pair}
                  </td>

                  <td
                    className={`
                      whitespace-nowrap
                      px-4
                      py-3
                      font-medium
                      ${
                        trade.bias === "BUY"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    `}
                  >
                    {trade.bias}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-gray-900 dark:text-white">
                    {trade.entry_display ??
                      trade.entry}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-gray-900 dark:text-white">
                    {trade.exit_display ??
                      trade.exit}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-gray-900 dark:text-white">
                    {trade.lot}
                  </td>

                  <td
                    className={`
                      whitespace-nowrap
                      px-4
                      py-3
                      font-semibold
                      ${
                        Number(trade.profit) >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    `}
                  >
                    ${trade.profit}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-gray-900 dark:text-white">
                    {trade.tradeDate
                      ? new Date(
                          trade.tradeDate
                        ).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "-"}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3">
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
                        className="
                          text-gray-700
                          hover:text-gray-900
                          dark:text-gray-300
                          dark:hover:text-white
                        "
                      >
                        View
                      </a>

                      <button
                        onClick={() => {
                          setTradeToDelete(trade);
                          setShowDeleteModal(true);
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
        </div>

        {/* EMPTY STATE */}
        {sortedTrades.length === 0 && (
          <p className="mt-5 text-center text-sm text-gray-500">
            No trades found
          </p>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div
            className="
              mt-6
              flex
              items-center
              justify-center
              gap-2
              sm:gap-4
            "
          >
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((p) =>
                  Math.max(1, p - 1)
                )
              }
              className="
                min-h-[42px]
                rounded-xl
                border
                border-gray-300
                bg-gray-100
                px-3
                py-2
                text-sm
                font-medium
                text-gray-800
                transition-all
                hover:bg-gray-200
                disabled:cursor-not-allowed
                disabled:opacity-40
                sm:px-4
                dark:border-white/20
                dark:bg-white/10
                dark:text-white
                dark:hover:bg-white/20
              "
            >
              Previous
            </button>

            <span
              className="
                whitespace-nowrap
                text-xs
                font-medium
                text-gray-700
                sm:text-sm
                dark:text-gray-300
              "
            >
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(
                    totalPages,
                    p + 1
                  )
                )
              }
              className="
                min-h-[42px]
                rounded-xl
                border
                border-gray-300
                bg-gray-100
                px-3
                py-2
                text-sm
                font-medium
                text-gray-800
                transition-all
                hover:bg-gray-200
                disabled:cursor-not-allowed
                disabled:opacity-40
                sm:px-4
                dark:border-white/20
                dark:bg-white/10
                dark:text-white
                dark:hover:bg-white/20
              "
            >
              Next
            </button>
          </div>
        )}
      </motion.div>

      {/* DELETE MODAL */}
      <ConfirmModal
        open={showDeleteModal}
        title="Delete Trade?"
        description="Are you sure you want to permanently delete this trade?"
        subtext="This action cannot be undone."
        confirmText="Delete Trade"
        loadingText="Deleting..."
        loading={deleting}
        confirmColor="red"
        onClose={() => {
          setShowDeleteModal(false);
          setTradeToDelete(null);
        }}
        onConfirm={handleDeleteTrade}
      />
    </>
  );
}