"use client";

import AddTradeForm from "@/components/AddTradeForm";
import TradesTable from "@/components/table/TradesTable";

export default function TradesPage() {
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Trades
        </h1>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          Manage and review your trading activity
        </p>
      </div>

      {/* ADD TRADE FORM */}
      <AddTradeForm />

      {/* LIVE TRADES TABLE */}
      <TradesTable pair="ALL" />
    </div>
  );
}