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