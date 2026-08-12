export type JournalEntry = {
  tradeId: string;
  accountId: string;
  pair: string;

  reason: string;
  confluence: string;
  stopLoss: string;
  takeProfit: string;
  emotions: string;
  regrets: string;
  management: string;
  images: string[];
};