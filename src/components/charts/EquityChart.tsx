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
import { useTradesStore } from "@/hooks/useTradesStore";

type Props = {
  pair: string;

  onStats?: (stats: {
    totalProfit: number;
    winRate: number;
    totalTrades: number;
    maxDrawdown: number;
  }) => void;
};

export default function EquityChart({
  pair,
  onStats,
}: Props) {
  const { session } = useAuth();

  const { trades } = useTradesStore();

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

  // EQUITY DATA
  const data = useMemo(() => {
    let running = 1000;

    return filteredTrades.map((t, i) => {
      const profit = Number(
        t?.profit ?? 0
      );

      running += isNaN(profit)
        ? 0
        : profit;

      return {
        trade: i + 1,
        equity: running,
      };
    });
  }, [filteredTrades]);

  // CALCULATE STATS
  const stats = useMemo(() => {
    const totalTrades =
      filteredTrades.length;

    const totalProfit =
      filteredTrades.reduce(
        (acc, t) =>
          acc + Number(t?.profit ?? 0),
        0
      );

    const wins =
      filteredTrades.filter(
        (t) => Number(t?.profit) > 0
      ).length;

    const winRate =
      totalTrades > 0
        ? (wins / totalTrades) * 100
        : 0;

    return {
      totalProfit,
      winRate,
      totalTrades,
      maxDrawdown: 0,
    };
  }, [filteredTrades]);

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
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}