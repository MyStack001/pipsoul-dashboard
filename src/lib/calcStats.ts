export type Trade = {
  id: number | string;

  pair: string;

  entry: number;
  exit: number;

  lot: number;

  profit: number;

  tradeDate: string;

  bias: "BUY" | "SELL";

  created_at?: string;
};

export function getStats(filteredTrades: Trade[] = []) {
  const sortedTrades = [...filteredTrades].sort(
    (a, b) =>
      new Date(
        a.created_at || a.tradeDate
      ).getTime() -
      new Date(
        b.created_at || b.tradeDate
      ).getTime()
  );

  const totalTrades =
    sortedTrades.length;

  const totalProfit =
    sortedTrades.reduce(
      (acc, t) =>
        acc + Number(t.profit || 0),
      0
    );

  const wins =
    sortedTrades.filter(
      (t) =>
        Number(t.profit || 0) > 0
    ).length;

  const winRate =
    totalTrades > 0
      ? (wins / totalTrades) * 100
      : 0;

  // =========================
  // EQUITY + DRAWDOWN
  // =========================
  let equity = 0;

  let peak = 0;

  let maxDrawdown = 0;

  const equityCurve: {
  equity: number;
  drawdown: number;
}[] = [];

  for (const trade of sortedTrades) {
    equity += Number(
      trade.profit || 0
    );

   if (equity > peak) {
  peak = equity;
}

const drawdown = peak - equity;

equityCurve.push({
  equity,
  drawdown: -drawdown,
});

if (drawdown > maxDrawdown) {
  maxDrawdown = drawdown;
}
  }

  return {
    totalTrades,

    totalProfit,

    winRate,

    maxDrawdown,

    equityCurve,
  };
}