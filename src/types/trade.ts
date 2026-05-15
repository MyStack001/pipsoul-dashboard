export type Trade = {
  id: string;
  user_id: string;

  pair: string;

  entry: number;
  exit: number;
  lot: number;

  profit: number;

  date: string;

  bias: "BUY" | "SELL";
};