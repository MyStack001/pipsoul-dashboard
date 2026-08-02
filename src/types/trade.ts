export type Trade = {
  id: string;
  user_id: string;

  pair: string;

  entry: number;
  exit: number;

  entry_display: string;
  exit_display: string;

  lot: number;

  profit: number;

  tradeDate: string;

  bias: "BUY" | "SELL";
};