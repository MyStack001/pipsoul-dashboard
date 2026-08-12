"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import KPI from "@/components/KPI";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useTradesStore } from "@/hooks/useTradesStore";
import { useAccount } from "@/components/AccountProvider";

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

  const { trades } = useTradesStore();
  const { currentAccount } = useAccount();

  const [pair, setPair] = useState("ALL");
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // --------------------------------------------------
  // ACCOUNT-SPECIFIC TRADES
  // --------------------------------------------------

  const accountTrades = useMemo(() => {
    if (!Array.isArray(trades)) return [];

    if (!currentAccount) return [];

    return trades.filter(
      (trade) => trade.account_id === currentAccount.id
    );
  }, [trades, currentAccount]);

useEffect(() => {
  setPair("ALL");
}, [currentAccount?.id]);
  // --------------------------------------------------
  // PAIRS FOR CURRENT ACCOUNT
  // --------------------------------------------------

  const pairs = useMemo(() => {
    if (!Array.isArray(accountTrades)) return ["ALL"];

    const uniquePairs = Array.from(
      new Set(
        accountTrades
          .map((t) => t.pair)
          .filter(Boolean)
      )
    );

    return ["ALL", ...uniquePairs];
  }, [accountTrades]);

  // --------------------------------------------------
  // STATS
  // --------------------------------------------------

  const [stats, setStats] = useState({
    totalProfit: 0,
    winRate: 0,
    totalTrades: 0,
    maxDrawdown: 0,
  });

  // --------------------------------------------------
  // AUTH REDIRECT
  // --------------------------------------------------

  useEffect(() => {
    if (!loading && !session) {
      router.push("/login");
    }
  }, [session, loading, router]);

  // --------------------------------------------------
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // --------------------------------------------------

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

  // --------------------------------------------------
  // RESET PAIR IF CURRENT PAIR DOESN'T EXIST
  // --------------------------------------------------

  useEffect(() => {
    if (pair !== "ALL" && !pairs.includes(pair)) {
      setPair("ALL");
    }
  }, [pairs, pair]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="p-6 text-black dark:text-white">
        Loading...
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="space-y-6">

      {/* HEADER */}

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

        {currentAccount && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Account:{" "}
            <span className="font-medium text-black dark:text-white">
              {currentAccount.name}
            </span>
          </p>
        )}
      </div>

      {/* KPI */}

      <KPI stats={stats} />

      {/* PAIR FILTER */}

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
            rounded-lg shadow-lg
            max-h-64
            overflow-y-auto
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

      {/* EQUITY CHART */}

      <EquityChart
        pair={pair}
        trades={accountTrades}
        onStats={setStats}
      />

      {/* TRADES TABLE */}

      <TradesTable
        pair={pair}
        trades={accountTrades}
      />

    </div>
  );
}