"use client";

import { motion, animate } from "framer-motion";
import { useEffect, useState } from "react";

type KPIStats = {
  totalTrades: number;
  winRate: number;
  totalProfit: number;
  maxDrawdown: number;
};

type KPIProps = {
  stats?: KPIStats; // ✅ make optional to prevent crash
};

function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value || 0, {
      duration: 0.8,
      onUpdate(latest) {
        setDisplay(latest);
      },
    });

    return () => controls.stop();
  }, [value]);

  return (
    <span>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function Card({
  title,
  children,
  color,
}: {
  title: string;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="backdrop-blur-lg bg-white/60 dark:bg-white/5 border border-white/20 dark:border-white/10 text-black dark:text-white p-4 rounded-xl shadow-lg">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <h2 className={`text-xl font-bold ${color || ""}`}>{children}</h2>
    </div>
  );
}

export default function KPI({ stats }: KPIProps) {
  // ✅ SAFE DEFAULTS (THIS FIXES YOUR CRASH)
  const safeStats: KPIStats = {
    totalProfit: stats?.totalProfit ?? 0,
    winRate: stats?.winRate ?? 0,
    maxDrawdown: stats?.maxDrawdown ?? 0,
    totalTrades: stats?.totalTrades ?? 0,
  };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const hoverEffect = {
    scale: 1.05,
    y: -5,
    transition: { type: "spring", stiffness: 300 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
    >
      <motion.div variants={item} whileHover={hoverEffect}>
        <Card title="Total Profit" color="text-green-500">
          <CountUp value={safeStats.totalProfit} prefix="$" decimals={2} />
        </Card>
      </motion.div>

      <motion.div variants={item} whileHover={hoverEffect}>
        <Card title="Win Rate">
          <CountUp value={safeStats.winRate} suffix="%" decimals={1} />
        </Card>
      </motion.div>

      <motion.div variants={item} whileHover={hoverEffect}>
        <Card title="Max Drawdown" color="text-red-500">
          <CountUp
            value={Math.abs(safeStats.maxDrawdown)}
            prefix="$"
            decimals={2}
          />
        </Card>
      </motion.div>

      <motion.div variants={item} whileHover={hoverEffect}>
        <Card title="Total Trades">
          <CountUp value={safeStats.totalTrades} />
        </Card>
      </motion.div>
    </motion.div>
  );
}
