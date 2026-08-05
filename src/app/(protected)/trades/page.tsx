"use client";

import AddTradeForm from "@/components/AddTradeForm";
import TradesTable from "@/components/table/TradesTable";
import { useTradesStore } from "@/hooks/useTradesStore";
import { useAccount } from "@/components/AccountProvider";
import PageSection from "@/components/PageSection";

export default function TradesPage() {
  const { trades } = useTradesStore();
  const { currentAccount } = useAccount();

const filteredTrades = currentAccount
  ? trades.filter(
      (trade) => trade.account_id === currentAccount.id
    )
  : trades;
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageSection>
      <div>
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Trades
        </h1>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          Manage and review your trading activity
        </p>
      </div>
      </PageSection>

      {/* ADD TRADE FORM */}
      <PageSection delay={0.08}>
      <AddTradeForm />
      </PageSection>

      {/* LIVE TRADES TABLE */}
      <PageSection delay={0.08}>
      <TradesTable pair="ALL" trades={filteredTrades} />
      </PageSection>
    </div>
  );
}