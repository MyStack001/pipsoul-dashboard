"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import KPI from "@/components/KPI";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const EquityChart = dynamic(
  () => import("@/components/charts/EquityChart"),
  { ssr: false }
);

const TradesTable = dynamic(
  () => import("@/components/table/TradesTable"),
  { ssr: false }
);

export default function DashboardPage() {
  const { session, loading } = useAuth();
  const router = useRouter();

  const [pair, setPair] = useState("ALL");
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [pairs] = useState<string[]>(["ALL"]);

  const [stats, setStats] = useState({
    totalProfit: 0,
    winRate: 0,
    totalTrades: 0,
    maxDrawdown: 0,
  });

  useEffect(() => {
    if (!loading && !session) {
      router.push("/login");
    }
  }, [session, loading, router]);

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

  if (loading) {
    return (
      <div className="p-6 text-black dark:text-white">
        Loading...
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Trading Overview
        </h1>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          Monitor your performance and trades
        </p>

        <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">
          Logged in as: {session.user.email}
        </p>
      </div>

      <KPI stats={stats} />

      <div ref={dropdownRef} className="relative w-fit">

        <button
          onClick={() => setOpen(!open)}
          className="
            flex items-center justify-between gap-2
            px-4 py-3 rounded-lg
            bg-white dark:bg-[#111827]
            border border-gray-200/70 dark:border-white/10
            text-black dark:text-white
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
                px-4 py-3 cursor-pointer
                text-black dark:text-white
                hover:bg-cyan-50 dark:hover:bg-white/10
              "
            >
              {p === "ALL" ? "All Pairs" : p}
            </div>
          ))}
        </div>
      </div>

      <EquityChart
        pair={pair}
        onStats={setStats}
      />

      <TradesTable pair={pair} />

    </div>
  );
}