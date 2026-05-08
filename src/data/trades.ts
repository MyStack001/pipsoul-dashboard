export type Trade = {
  id: number;
  pair: string;
  entry: number;
  exit: number;
  lot: number;
  profit: number;
  date: string;
};

export const trades: Trade[] = [
  {
    id: 1,
    pair: "XAUUSD",
    entry: 2000,
    exit: 2020,
    lot: 0.1,
    profit: 20,
  },
  {
    id: 2,
    pair: "XAUUSD",
    entry: 2020,
    exit: 2010,
    lot: 0.2,
    profit: -10,
  },
  {
    id: 3,
    pair: "EURUSD",
    entry: 1.085,
    exit: 1.09,
    lot: 0.1,
    profit: 50,
  },
  {
    id: 4,
    pair: "GBPJPY",
    entry: 190.5,
    exit: 191.2,
    lot: 0.15,
    profit: 70,
  },
  {
    id: 5,
    pair: "EURUSD",
    entry: 1.09,
    exit: 1.082,
    lot: 0.1,
    profit: -80,
  },
  {
    id: 6,
    pair: "XAUUSD",
    entry: 2010,
    exit: 2035,
    lot: 0.1,
    profit: 25,
  },
  {
    id: 7,
    pair: "GBPJPY",
    entry: 191.2,
    exit: 190.8,
    lot: 0.2,
    profit: -40,
  },
];
