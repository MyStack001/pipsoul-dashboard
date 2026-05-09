"use client";

import { useState } from "react";
import EquityChart from "@/components/charts/EquityChart";
import TradesTable from "@/components/table/TradesTable";
import KPI from "@/components/KPI";
import { ChevronDown } from "lucide-react";

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

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Trading Overview
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Monitor your performance and trades
        </p>
      </div>

      {/* KPI */}
      <KPI stats={stats} />

      {/* FILTER */}
      <div className="relative w-fit">

        <select
          value={pair}
          onChange={(e) => setPair(e.target.value)}
          className="
            appearance-none
            px-4 py-2 pr-10
            rounded-lg
            bg-white dark:bg-gray-900
            border border-gray-200/70 dark:border-white/10
            text-black dark:text-white
            backdrop-blur-md
            focus:outline-none focus:ring-2 focus:ring-cyan-400
          "
        >
          <option value="ALL">All Pairs</option>
          <option value="GBPJPY">GBPJPY</option>
          <option value="EURUSD">EURUSD</option>
          <option value="XAUUSD">XAUUSD</option>
        </select>

        {/* Dropdown Icon */}
        <ChevronDown className="
          w-4 h-4
          absolute right-3 top-1/2 -translate-y-1/2
          pointer-events-none
          text-gray-500 dark:text-gray-300
        " />

      </div>

      {/* CHART */}
      <EquityChart pair={pair} onStats={setStats} />

      {/* TABLE */}
      <TradesTable pair={pair} />

    </div>
  );
}