"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import KPI from "@/components/KPI";
import { ChevronDown } from "lucide-react";

// ✅ safer dynamic imports (prevents SSR issues)
const EquityChart = dynamic(
  () => import("@/components/charts/EquityChart"),
  { ssr: false }
);

const TradesTable = dynamic(
  () => import("@/components/table/TradesTable"),
  { ssr: false }
);

export default function DashboardPage() {
  const [pair, setPair] = useState("ALL");
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [pairs, setPairs] = useState<string[]>(["ALL"]);

  const [stats, setStats] = useState({
    totalProfit: 0,
    winRate: 0,
    totalTrades: 0,
    maxDrawdown: 0,
  });

  // ✅ LOAD TRADES + STATS + PAIRS (SAFE BUILD VERSION)
  useEffect(() => {
    const stored = localStorage.getItem("trades");

    if (!stored) return;

    const parsed: any[] = JSON.parse(stored);

    // STATS
    const totalProfit = parsed.reduce(
      (sum: number, t: any) => sum + Number(t.profit),
      0
    );

    const wins = parsed.filter(
      (t: any) => Number(t.profit) > 0
    ).length;

    setStats({
      totalProfit,
      winRate: parsed.length ? (wins / parsed.length) * 100 : 0,
      totalTrades: parsed.length,
      maxDrawdown: 0,
    });

    // UNIQUE PAIRS (SAFE STRING CONVERSION)
    const uniquePairs: string[] = Array.from(
      new Set(parsed.map((t: any) => String(t.pair)))
    );

    setPairs(["ALL", ...uniquePairs]);

  }, []);

  // CLOSE DROPDOWN OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      {/* DROPDOWN */}
      <div ref={dropdownRef} className="relative w-fit">

        <button
          onClick={() => setOpen(!open)}
          className="
            flex items-center justify-between gap-2
            px-4 py-3 rounded-lg
            bg-white dark:bg-[#111827]
            border border-gray-200/70 dark:border-white/10
            text-black dark:text-white
            hover:shadow-sm transition-all
          "
        >
          <span className="font-medium">
            {pair === "ALL" ? "All Pairs" : pair}
          </span>

          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          className={`
            absolute mt-2 w-full z-50
            bg-white dark:bg-[#111827]
            border border-gray-200/70 dark:border-white/10
            rounded-lg shadow-lg overflow-hidden
            transition-all duration-200 origin-top
            ${
              open
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }
          `}
        >
          {pairs.map((p) => (
            <div
              key={p}
              onClick={() => {
                setPair(p);
                setOpen(false);
              }}
              className="
                px-4 py-3 cursor-pointer transition
                text-black dark:text-white
                hover:bg-cyan-50 dark:hover:bg-white/10
              "
            >
              {p === "ALL" ? "All Pairs" : p}
            </div>
          ))}
        </div>

      </div>

      {/* CHART */}
      <EquityChart pair={pair} onStats={setStats} />

      {/* TABLE */}
      <TradesTable pair={pair} />

    </div>
  );
}