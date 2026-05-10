"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { Trade } from "@/types/trade";

const getTrades = (): Trade[] => {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem("trades");
  return stored ? (JSON.parse(stored) as Trade[]) : [];
};

type EquityChartProps = {
  pair: string;
  onStats?: (stats: {
    totalProfit: number;
    maxDrawdown: number;
    winRate: number;
    totalTrades: number;
  }) => void;
};

export default function EquityChart({ pair, onStats }: EquityChartProps) {
  // ✅ FILTERED DATA
  const filteredTrades = useMemo(() => {
    const trades = getTrades();

    return pair === "ALL"
      ? trades
      : trades.filter((t: Trade) => t.pair === pair);
  }, [pair]);

  // ✅ EQUITY CURVE
  const equityData = useMemo(() => {
    let running = 1000;

    return filteredTrades.map((t: Trade, index: number) => {
      running += t.profit;

      return {
        trade: index + 1,
        equity: running,
      };
    });
  }, [filteredTrades]);

  // ✅ DRAWDOWN
  const drawdownData = useMemo(() => {
    let peak = -Infinity;

    return equityData.map((point) => {
      peak = Math.max(peak, point.equity);

      return {
        trade: point.trade,
        equity: point.equity,
        drawdown: point.equity - peak,
      };
    });
  }, [equityData]);

  // ✅ STATS
  const stats = useMemo(() => {
    const totalProfit = filteredTrades.reduce(
      (acc: number, t: Trade) => acc + t.profit,
      0
    );

    const maxDrawdown =
      drawdownData.length > 0
        ? Math.min(...drawdownData.map((d) => d.drawdown))
        : 0;

    const winRate =
      filteredTrades.length > 0
        ? (filteredTrades.filter((t: Trade) => t.profit > 0).length /
            filteredTrades.length) *
          100
        : 0;

    return {
      totalProfit,
      maxDrawdown,
      winRate,
      totalTrades: filteredTrades.length,
    };
  }, [filteredTrades, drawdownData]);

  // ✅ SEND STATS UP
  useEffect(() => {
    onStats?.(stats);
  }, [stats, onStats]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="
        backdrop-blur-lg
        bg-white/60 dark:bg-white/5
        border border-white/20 dark:border-white/10
        text-black dark:text-white
        p-4 rounded-xl shadow-lg mb-6
      "
    >
      <h2 className="text-lg font-semibold mb-4">Equity Curve</h2>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={drawdownData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="trade" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.9)",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                backdropFilter: "blur(10px)",
              }}
            />

            <Line
              type="monotone"
              dataKey="equity"
              stroke="#14b8a6"
              strokeWidth={2}
            />

            <Line
              type="monotone"
              dataKey="drawdown"
              stroke="#ef4444"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}