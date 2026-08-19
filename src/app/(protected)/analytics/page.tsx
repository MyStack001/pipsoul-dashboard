"use client";

import { useMemo, useState } from "react";
import { useTradesStore } from "@/hooks/useTradesStore";
import EquityChart from "@/components/charts/EquityChart";
import PageSection from "@/components/PageSection";
import AnimatedCard from "@/components/AnimatedCard";

export default function AnalyticsPage() {
  const [search, setSearch] = useState("");
  const [pairCurrentPage, setPairCurrentPage] = useState(1);

const pairItemsPerPage = 5;
const [sortOrder, setSortOrder] =
  useState<"asc" | "desc">("desc");
  const { trades } = useTradesStore();


  // ========================
  // BASIC STATS
  // ========================
  const {
    totalTrades,
    winRate,
    totalProfit,
    averageProfit,
    bestTrade,
    worstTrade,
  } = useMemo(() => {
    const total = trades.length;

    const wins = trades.filter(
      (t) => Number(t.profit) > 0
    ).length;

    const totalProfit = trades.reduce(
      (sum, t) => sum + Number(t.profit || 0),
      0
    );

    return {
      totalTrades: total,
      winRate: total > 0 ? ((wins / total) * 100).toFixed(1) : "0",
      totalProfit,
      averageProfit: total > 0 ? (totalProfit / total).toFixed(2) : "0",
      bestTrade:
        total > 0
          ? Math.max(...trades.map((t) => Number(t.profit || 0)))
          : 0,
      worstTrade:
        total > 0
          ? Math.min(...trades.map((t) => Number(t.profit || 0)))
          : 0,
    };
  }, [trades]);

  // ========================
  // BUY / SELL STATS
  // ========================
  const { buyStats, sellStats } = useMemo(() => {
    const buyTrades = trades.filter((t) => t.bias === "BUY");
    const sellTrades = trades.filter((t) => t.bias === "SELL");

    const getSideStats = (sideTrades: typeof trades) => {
      const total = sideTrades.length;

      const wins = sideTrades.filter(
        (t) => Number(t.profit) > 0
      ).length;

      const totalProfit = sideTrades.reduce(
        (sum, t) => sum + Number(t.profit || 0),
        0
      );

      return {
        total,
        wins,
        winRate: total > 0 ? ((wins / total) * 100).toFixed(1) : "0",
        totalProfit,
      };
    };

    return {
      buyStats: getSideStats(buyTrades),
      sellStats: getSideStats(sellTrades),
    };
  }, [trades]);

  // ========================
  // PAIR PERFORMANCE
  // ========================
  const pairStats = useMemo(() => {
    const grouped = trades.reduce((acc: any, trade) => {
      const pair = trade.pair;
      const profit = Number(trade.profit || 0);

      if (!acc[pair]) {
  acc[pair] = {
    pair,
    totalTrades: 0,
    wins: 0,
    totalProfit: 0,
    bestTrade: -Infinity,
    worstTrade: Infinity,
    latestTradeDate: trade.tradeDate || null,
  };
}

if (
  trade.tradeDate &&
  (!acc[pair].latestTradeDate ||
    new Date(trade.tradeDate).getTime() >
      new Date(acc[pair].latestTradeDate).getTime())
) {
  acc[pair].latestTradeDate = trade.tradeDate;
}

      acc[pair].totalTrades += 1;
      acc[pair].totalProfit += profit;

      if (profit > 0) acc[pair].wins += 1;
      if (profit > acc[pair].bestTrade) acc[pair].bestTrade = profit;
      if (profit < acc[pair].worstTrade) acc[pair].worstTrade = profit;

      return acc;
    }, {});

    return Object.values(grouped).map((p: any) => ({
      ...p,
      winRate:
        p.totalTrades > 0
          ? ((p.wins / p.totalTrades) * 100).toFixed(1)
          : "0",
      avgProfit:
        p.totalTrades > 0
          ? (p.totalProfit / p.totalTrades).toFixed(2)
          : "0",
    }));
  }, [trades]);

  const filteredPairStats = useMemo(() => {
  const searched = pairStats.filter((p: any) =>
    p.pair
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return [...searched].sort((a: any, b: any) => {
    const aDate = new Date(
      a.latestTradeDate || 0
    ).getTime();

    const bDate = new Date(
      b.latestTradeDate || 0
    ).getTime();

    return sortOrder === "asc"
      ? aDate - bDate
      : bDate - aDate;
  });
}, [pairStats, search, sortOrder]);
const pairTotalPages = Math.ceil(
  filteredPairStats.length / pairItemsPerPage
);

const paginatedPairStats = useMemo(() => {
  const start =
    (pairCurrentPage - 1) * pairItemsPerPage;

  return filteredPairStats.slice(
    start,
    start + pairItemsPerPage
  );
}, [filteredPairStats, pairCurrentPage]);

  // ========================
  // UI
  // ========================
  return (
    <div className="space-y-6">
      
  <div>
    <h1 className="text-2xl font-semibold text-black dark:text-white">
      Analytics
    </h1>

    <p className="text-sm text-gray-600 dark:text-gray-300">
      Insights into your trading performance
    </p>
  </div>

      {/* BUY vs SELL */}
      <div className="grid gap-4 md:grid-cols-2">
  
    <Card title="BUY Trades" color="green" data={buyStats} />

    <Card title="SELL Trades" color="red" data={sellStats} />
  
</div>

      {/* MAIN STATS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  <AnimatedCard delay={0}>
    <StatCard title="Total Trades" value={totalTrades} />
  </AnimatedCard>

  <AnimatedCard delay={0.05}>
    <StatCard title="Win Rate" value={`${winRate}%`} />
  </AnimatedCard>

  <AnimatedCard delay={0.10}>
    <StatCard title="Total P/L" value={`$${totalProfit.toFixed(2)}`} />
  </AnimatedCard>

  <AnimatedCard delay={0.15}>
    <StatCard title="Average Trade" value={`$${averageProfit}`} />
  </AnimatedCard>

  <AnimatedCard delay={0.20}>
    <StatCard title="Best Trade" value={`$${bestTrade}`} />
  </AnimatedCard>

  <AnimatedCard delay={0.25}>
    <StatCard title="Worst Trade" value={`$${worstTrade}`} />
  </AnimatedCard>
</div>

       {/* EQUITY */}
      
  <EquityChart trades={trades} />

  
  {/* PAIR TABLE */}

<div className="rounded-2xl p-5 bg-white/60 dark:bg-white/5 border border-gray-200/70 dark:border-white/10">
  
  {/* HEADER */}
  <div
    className="
      mb-4
      flex
      flex-col
      gap-3
      sm:flex-row
      sm:items-center
      sm:justify-between
    "
  >
    <h2 className="text-lg font-semibold text-black dark:text-white">
      Pair Performance
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
        min-h-[44px]
        w-full
        rounded-lg
        bg-cyan-500
        px-4
        py-2
        text-sm
        font-medium
        text-white
        transition-colors
        hover:bg-cyan-400
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
      setPairCurrentPage(1);
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
      focus:border-cyan-400/50
      focus:ring-2
      focus:ring-cyan-400/10
      dark:border-white/10
      dark:bg-[#111827]
      dark:text-white
    "
  />

  {/* ========================= */}
  {/* MOBILE PAIR CARDS */}
  {/* ========================= */}

  <div className="space-y-3 md:hidden">
    {paginatedPairStats.map((p: any) => (
      <div
        key={p.pair}
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
              {p.pair}
            </p>

            <p
              className="
                mt-0.5
                text-xs
                text-gray-500
                dark:text-gray-400
              "
            >
              {p.totalTrades}{" "}
              {p.totalTrades === 1
                ? "trade"
                : "trades"}
            </p>
          </div>

          <span
            className="
              shrink-0
              rounded-full
              bg-cyan-500/10
              px-2.5
              py-1
              text-xs
              font-semibold
              text-cyan-500
            "
          >
            {p.winRate}%
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
            Total Profit
          </span>

          <span
            className={`
              text-base
              font-bold
              ${
                Number(p.totalProfit) >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            `}
          >
            ${p.totalProfit.toFixed(2)}
          </span>
        </div>

        {/* Pair details */}
        <div
          className="
            mt-4
            grid
            grid-cols-2
            gap-4
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
              Win Rate
            </p>

            <p
              className="
                mt-1
                text-sm
                font-semibold
                text-cyan-500
              "
            >
              {p.winRate}%
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
              Average
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
              ${p.avgProfit}
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
              Best
            </p>

            <p
              className="
                mt-1
                truncate
                text-sm
                font-semibold
                text-green-500
              "
            >
              ${p.bestTrade.toFixed(2)}
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
              Worst
            </p>

            <p
              className="
                mt-1
                truncate
                text-sm
                font-semibold
                text-red-500
              "
            >
              ${p.worstTrade.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
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
            Trades
          </th>

          <th className="whitespace-nowrap px-4 py-3 text-left text-gray-900 dark:text-white">
            Win %
          </th>

          <th className="whitespace-nowrap px-4 py-3 text-left text-gray-900 dark:text-white">
            Profit
          </th>

          <th className="whitespace-nowrap px-4 py-3 text-left text-gray-900 dark:text-white">
            Avg
          </th>

          <th className="whitespace-nowrap px-4 py-3 text-left text-gray-900 dark:text-white">
            Best
          </th>

          <th className="whitespace-nowrap px-4 py-3 text-left text-gray-900 dark:text-white">
            Worst
          </th>
        </tr>
      </thead>

      <tbody>
        {paginatedPairStats.map((p: any) => (
          <tr
            key={p.pair}
            className="border-b border-gray-200 dark:border-white/10"
          >
            <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 dark:text-white">
              {p.pair}
            </td>

            <td className="whitespace-nowrap px-4 py-3 text-gray-900 dark:text-white">
              {p.totalTrades}
            </td>

            <td className="whitespace-nowrap px-4 py-3 font-medium text-cyan-500">
              {p.winRate}%
            </td>

            <td
              className={`whitespace-nowrap px-4 py-3 font-semibold ${
                Number(p.totalProfit) >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              ${p.totalProfit.toFixed(2)}
            </td>

            <td className="whitespace-nowrap px-4 py-3 text-gray-900 dark:text-white">
              ${p.avgProfit}
            </td>

            <td className="whitespace-nowrap px-4 py-3 font-semibold text-green-500">
              ${p.bestTrade.toFixed(2)}
            </td>

            <td className="whitespace-nowrap px-4 py-3 font-semibold text-red-500">
              ${p.worstTrade.toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* EMPTY STATE */}

  {paginatedPairStats.length === 0 && (
    <p className="mt-5 text-center text-sm text-gray-500">
      No pairs found
    </p>
  )}

  {/* PAGINATION */}

  {pairTotalPages > 1 && (
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
        disabled={pairCurrentPage === 1}
        onClick={() =>
          setPairCurrentPage((page) =>
            Math.max(1, page - 1)
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
        Page {pairCurrentPage} of{" "}
        {pairTotalPages}
      </span>

      <button
        disabled={
          pairCurrentPage === pairTotalPages
        }
        onClick={() =>
          setPairCurrentPage((page) =>
            Math.min(
              pairTotalPages,
              page + 1
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

</div>
  

     
    </div>
   
  );
}

// ========================
// REUSABLE COMPONENTS
// ========================
function Card({
  title,
  color,
  data,
}: any) {
  return (
    <div
      className="
        rounded-2xl
        p-5
        bg-white/60
        dark:bg-[#111827]
        border
        border-gray-200/70
        dark:border-white/10
        backdrop-blur-xl
      "
    >
      <h2
        className={`text-lg font-semibold mb-3 ${
          color === "green"
            ? "text-green-500 dark:text-green-400"
            : "text-red-500 dark:text-red-400"
        }`}
      >
        {title}
      </h2>

      <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
        <p>Total Trades: {data.total}</p>
        <p>Wins: {data.wins}</p>
        <p>Win Rate: {data.winRate}%</p>

        <p className={color === "green" ? "font-semibold text-green-500" : "font-semibold text-red-500"}>
          Total Profit: ${data.totalProfit.toFixed(2)}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div
 className="
    rounded-2xl
    p-5
    border
    border-gray-200/70
    dark:border-white/10
    bg-white/60
    dark:bg-[#111827]
    backdrop-blur-xl
    hover:border-cyan-400/40
    hover:shadow-lg
"
>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </h2>

    </div>
  );
}