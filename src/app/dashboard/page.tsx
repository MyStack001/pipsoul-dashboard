"use client";

import { useState } from "react";
import EquityChart from "@/components/charts/EquityChart";
import TradesTable from "@/components/table/TradesTable";
import KPI from "@/components/KPI";

export default function DashboardPage() {
  const [pair, setPair] = useState("ALL");

  const [stats, setStats] = useState({
    totalProfit: 0,
    winRate: 0,
    totalTrades: 0,
    maxDrawdown: 0,
  });

  return (
    <div className="p-6 space-y-6">
      {/* 🔹 HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Trading Overview
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Monitor your performance and trades
        </p>
      </div>

      {/* 🔹 KPI CARDS */}
      <KPI stats={stats} />

      {/* 🔽 FILTER */}
      <div>
        <select
          value={pair}
          onChange={(e) => setPair(e.target.value)}
          className="
    px-4 py-2 pr-8
    rounded-lg
    bg-white dark:bg-gray-900
    border border-gray-200/70 dark:border-white/10
    text-black dark:text-white
    backdrop-blur-md
    focus:outline-none focus:ring-2 focus:ring-cyan-400
  "
        >
          <option
            value="ALL"
            className="bg-white dark:bg-gray-900 text-black dark:text-white"
          >
            All Pairs
          </option>
          <option
            value="GBPJPY"
            className="bg-white dark:bg-gray-900 text-black dark:text-white"
          >
            GBPJPY
          </option>
          <option
            value="EURUSD"
            className="bg-white dark:bg-gray-900 text-black dark:text-white"
          >
            EURUSD
          </option>
          <option
            value="XAUUSD"
            className="bg-white dark:bg-gray-900 text-black dark:text-white"
          >
            XAUUSD
          </option>
        </select>
      </div>

      {/* 📈 CHART (IMPORTANT: send stats up) */}
      <EquityChart pair={pair} onStats={setStats} />

      {/* 📊 TABLE */}
      <TradesTable pair={pair} />
    </div>
  );
}
