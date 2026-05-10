export type Trade = {
  id: number;
  pair: string;
  entry: number;
  exit: number;
  lot: number;
  profit: number;
  date: string;
  bias: "BUY" | "SELL";
};

export function getStats(filteredTrades: Trade[] = []) {
  const totalTrades = filteredTrades.length;

  const totalProfit = filteredTrades.reduce(
    (acc: number, t: Trade) => acc + Number(t.profit),
    0
  );

  const wins = filteredTrades.filter(
    (t: Trade) => Number(t.profit) > 0
  ).length;

  const winRate = totalTrades
    ? (wins / totalTrades) * 100
    : 0;

  // simple drawdown (safe version for now)
  let peak = 0;
  let maxDrawdown = 0;

  let equity = 1000;

  for (const t of filteredTrades) {
    equity += Number(t.profit);
    if (equity > peak) peak = equity;

    const dd = equity - peak;
    if (dd < maxDrawdown) maxDrawdown = dd;
  }

  return {
    totalTrades,
    winRate,
    totalProfit,
    maxDrawdown,
  };
}