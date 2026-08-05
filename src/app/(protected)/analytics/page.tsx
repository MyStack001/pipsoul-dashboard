"use client";

import { useMemo } from "react";
import { useTradesStore } from "@/hooks/useTradesStore";
import EquityChart from "@/components/charts/EquityChart";
import PageSection from "@/components/PageSection";
import AnimatedCard from "@/components/AnimatedCard";

export default function AnalyticsPage() {
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
        };
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
        <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
  Pair Performance
</h2>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full min-w-[900px] text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10">
                <th className="px-4 py-3 whitespace-nowrap text-left text-gray-900 dark:text-white">Pair</th>
                <th className="px-4 py-3 whitespace-nowrap text-left text-gray-900 dark:text-white">Trades</th>
                <th className="px-4 py-3 whitespace-nowrap text-left text-gray-900 dark:text-white">Win %</th>

                <th className="px-4 py-3 whitespace-nowrap text-left text-gray-900 dark:text-white">Profit</th>
                <th className="px-4 py-3 whitespace-nowrap text-left text-gray-900 dark:text-white">Avg</th>
                <th className="px-4 py-3 whitespace-nowrap text-left text-gray-900 dark:text-white">Best</th>
                <th className="px-4 py-3 whitespace-nowrap text-left text-gray-900 dark:text-white">Worst</th>
              </tr>
            </thead>

            <tbody>
              {pairStats.map((p: any) => (
                <tr
  key={p.pair}
  className="border-b border-gray-200 dark:border-white/10"
>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">
  {p.pair}
</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">
  {p.totalTrades}
</td>

                  <td className="px-4 py-3 whitespace-nowrap font-medium text-cyan-500">{p.winRate}%</td>
                  <td
  className={`px-4 py-3 whitespace-nowrap font-semibold ${
    Number(p.totalProfit) >= 0
      ? "text-green-500"
      : "text-red-500"
  }`}
>
  ${p.totalProfit.toFixed(2)}
</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">
  {p.avgProfit}
</td>
                  <td className="px-4 py-3 whitespace-nowrap font-semibold text-green-500">${p.bestTrade.toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-semibold text-red-500">${p.worstTrade.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    transition-all
    duration-300
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