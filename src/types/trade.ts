export type Trade = {
  id: string;
  user_id: string;

  pair: string;

  entry: number;
  exit: number;
  lot: number;

  profit: number;

  tradeDate: string;

  bias: "BUY" | "SELL";
};