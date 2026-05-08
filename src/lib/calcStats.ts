import { trades } from "@/data/trades";

export function getStats(filteredTrades = trades) {
  const totalTrades = filteredTrades.length;

  const wins = filteredTrades.filter((t) => t.profit > 0).length;

  const winRate = totalTrades === 0 ? 0 : (wins / totalTrades) * 100;

  const totalProfit = filteredTrades.reduce((acc, t) => acc + t.profit, 0);

  // Equity + drawdown
  const equityData = filteredTrades.map((trade, index) => {
    return filteredTrades
      .slice(0, index + 1)
      .reduce((acc, t) => acc + t.profit, 1000);
  });

  const drawdowns = equityData.map((equity, index) => {
    const peak = Math.max(...equityData.slice(0, index + 1));
    return equity - peak;
  });

  const maxDrawdown = Math.min(...drawdowns);

  return {
    totalTrades,
    winRate,
    totalProfit,
    maxDrawdown,
  };
}
