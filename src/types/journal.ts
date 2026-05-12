export interface JournalEntry {
  tradeId: number;
  reason: string;
  confluence: string;
  stopLoss: string;
  takeProfit: string;
  emotions: string;
  regrets: string;
  management: string;

  // ✅ ADD THIS
  images: string[];
}