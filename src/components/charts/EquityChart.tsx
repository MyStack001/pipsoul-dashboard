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
  pair?: string;
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
}: Props) {
  const { session } = useAuth();

  // FILTERED TRADES
  const filteredTrades = useMemo(() => {
    const safeTrades = Array.isArray(trades)
      ? trades
      : [];

    if (pair && pair !== "ALL") {
      return safeTrades.filter(
        (t) => t.pair === pair
      );
    }

    return safeTrades;
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

  // AUTH GUARD
  if (!session) return null;

  // EMPTY STATE
  if (filteredTrades.length === 0) {
    return (
      <div
        className="
          rounded-xl
          border
          border-white/20
          bg-white/60
          p-5
          text-black
          dark:border-white/10
          dark:bg-white/5
          dark:text-white
          sm:p-6
        "
      >
        <p className="text-sm">
          No trades yet
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        min-w-0
        overflow-hidden
        rounded-xl
        border
        border-white/20
        bg-white/60
        p-3
        dark:border-white/10
        dark:bg-white/5
        sm:p-4
      "
    >
      <h2
        className="
          mb-3
          text-sm
          font-semibold
          text-black
          sm:mb-4
          sm:text-base
          dark:text-white
        "
      >
        Equity Curve
      </h2>

      <div
        className="
          h-[230px]
          w-full
          sm:h-[260px]
          lg:h-[300px]
        "
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 8,
              left: -12,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              opacity={0.35}
            />

            <XAxis
              dataKey="trade"
              tick={{
                fontSize: 11,
              }}
              tickMargin={6}
              minTickGap={18}
            />

            <YAxis
              tick={{
                fontSize: 11,
              }}
              width={48}
              tickMargin={4}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.1)",
                backgroundColor: "rgba(17,24,39,0.95)",
                fontSize: "12px",
              }}
              labelStyle={{
                marginBottom: "4px",
              }}
              formatter={(value) => {
  if (typeof value === "number") {
    return [`$${value.toFixed(2)}`];
  }

  return [String(value ?? "0")];
}}
            />

            <Line
              type="monotone"
              dataKey="equity"
              stroke="#14b8a6"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
              }}
            />

            <Line
              type="monotone"
              dataKey="drawdown"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}