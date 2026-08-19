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
  stats?: KPIStats;
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
    <div
      className="
        flex
        h-full
        min-h-[92px]
        flex-col
        justify-between
        rounded-xl
        border
        border-white/20
        bg-white/60
        p-4
        text-black
        shadow-lg
        backdrop-blur-lg
        transition-none
        dark:border-white/10
        dark:bg-white/5
        dark:text-white
        sm:min-h-[100px]
      "
    >
      <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
        {title}
      </p>

      <h2
        className={`
          mt-2
          text-xl
          font-bold
          tracking-tight
          sm:text-2xl
          ${color || ""}
        `}
      >
        {children}
      </h2>
    </div>
  );
}

export default function KPI({ stats }: KPIProps) {
  const safeStats: KPIStats = {
    totalProfit: stats?.totalProfit ?? 0,
    winRate: stats?.winRate ?? 0,
    maxDrawdown: stats?.maxDrawdown ?? 0,
    totalTrades: stats?.totalTrades ?? 0,
  };

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
    },
  };

  const hoverEffect = {
    scale: 1.03,
    y: -3,
    transition: {
      type: "spring",
      stiffness: 300,
    } as const,
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="
        mb-5
        grid
        grid-cols-2
        gap-3
        sm:gap-4
        md:grid-cols-4
      "
    >
      {/* Total Profit */}
      <motion.div
        variants={item}
        whileHover={hoverEffect}
        className="min-w-0"
      >
        <Card title="Total Profit" color="text-green-500">
          <CountUp
            value={safeStats.totalProfit}
            prefix="$"
            decimals={2}
          />
        </Card>
      </motion.div>

      {/* Win Rate */}
      <motion.div
        variants={item}
        whileHover={hoverEffect}
        className="min-w-0"
      >
        <Card title="Win Rate">
          <CountUp
            value={safeStats.winRate}
            suffix="%"
            decimals={1}
          />
        </Card>
      </motion.div>

      {/* Max Drawdown */}
      <motion.div
        variants={item}
        whileHover={hoverEffect}
        className="min-w-0"
      >
        <Card title="Max Drawdown" color="text-red-500">
          <CountUp
            value={Math.abs(safeStats.maxDrawdown)}
            prefix="$"
            decimals={2}
          />
        </Card>
      </motion.div>

      {/* Total Trades */}
      <motion.div
        variants={item}
        whileHover={hoverEffect}
        className="min-w-0"
      >
        <Card title="Total Trades">
          <CountUp value={safeStats.totalTrades} />
        </Card>
      </motion.div>
    </motion.div>
  );
}