"use client";

import { useMemo, useEffect } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { useAuth } from "@/components/AuthProvider";
import { getStats } from "@/lib/calcStats";

import type { Trade } from "@/types/trade";

type Props = {
  pair: string;
  trades: Trade[];
  onStats?: (stats: {
    totalProfit: number;
    winRate: number;
    totalTrades: number;
    maxDrawdown: number;
   equityCurve: {
  equity: number;
  drawdown: number;
}[];
  }) => void;
};

export default function EquityChart({
  pair,
  trades,
  onStats,
}: Props)

{
  const { session } = useAuth();

  // AUTH GUARD
  if (!session) return null;

  // FILTERED TRADES
  const filteredTrades = useMemo(() => {
    if (!Array.isArray(trades)) return [];

    if (pair === "ALL") {
      return trades;
    }

    return trades.filter(
      (t) => t?.pair === pair
    );
  }, [trades, pair]);

   const stats = useMemo(() => {
  return getStats(filteredTrades);
}, [filteredTrades]);
    

  // EQUITY DATA
  const data = useMemo(() => {
  return stats.equityCurve.map(
    (point, index) => ({
      trade: index + 1,
      equity: point.equity,
      drawdown: point.drawdown,
    })
  );
}, [stats]);
      
  // SEND STATS TO DASHBOARD
  useEffect(() => {
    if (onStats) {
      onStats(stats);
    }
  }, [stats, onStats]);

  // EMPTY STATE
  if (filteredTrades.length === 0) {
    return (
      <div
        className="
          p-6 rounded-xl
          bg-white/60 dark:bg-white/5
          border border-white/20 dark:border-white/10
          text-black dark:text-white
        "
      >
        No trades yet
      </div>
    );
  }

  return (
    <div
      className="
        p-4 rounded-xl
        bg-white/60 dark:bg-white/5
        border border-white/20 dark:border-white/10
      "
    >
      <h2 className="text-black dark:text-white font-semibold mb-4">
        Equity Curve
      </h2>

      <div
        style={{
          width: "100%",
          height: 300,
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="trade" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="equity"
              stroke="#14b8a6"
              strokeWidth={2}
              dot={false}
            />
            <Line
  type="monotone"
  dataKey="drawdown"
  stroke="#ef4444"
  strokeWidth={2}
  dot={false}
/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}