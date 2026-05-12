"use client";

import { motion } from "framer-motion";

export default function UsersPage() {
  const user = {
    name: "Shadrach",
    email: "pipsoul@example.com",
    tradingStyle: "Intraday Trader",
    accountType: "Prop Firm",
    experience: "Intermediate",
    totalTrades: 148,
    winRate: "63%",
    totalProfit: "$4,820",
    journals: 39,
    joined: "May 2026",
  };

  const stats = [
    {
      label: "Total Trades",
      value: user.totalTrades,
    },
    {
      label: "Win Rate",
      value: user.winRate,
    },
    {
      label: "Total Profit",
      value: user.totalProfit,
    },
    {
      label: "Journal Entries",
      value: user.journals,
    },
  ];

  return (
    <div className="p-6 space-y-6 text-black dark:text-white">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          User Profile
        </h1>

        <p className="text-gray-500 dark:text-gray-400">
          Manage your trader profile and statistics
        </p>
      </div>

      {/* PROFILE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          p-6 rounded-2xl
          border border-white/20 dark:border-white/10
          bg-white/60 dark:bg-white/5
          backdrop-blur-lg
          shadow-lg
          flex flex-col md:flex-row
          gap-6 items-center
        "
      >

        <div
          className="
            h-24 w-24 rounded-full
            bg-cyan-500
            flex items-center justify-center
            text-3xl font-bold text-white
          "
        >
          S
        </div>

        <div className="flex-1 space-y-2">

          <h2 className="text-2xl font-semibold">
            {user.name}
          </h2>

          <p className="text-gray-500 dark:text-gray-400">
            {user.email}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">

            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-sm">
              {user.tradingStyle}
            </span>

            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm">
              {user.accountType}
            </span>

            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-500 text-sm">
              {user.experience}
            </span>

          </div>
        </div>

        <button
          className="
            px-4 py-2 rounded-xl
            bg-cyan-500 hover:bg-cyan-600
            text-white transition
          "
        >
          Edit Profile
        </button>

      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              p-5 rounded-2xl
              border border-white/20 dark:border-white/10
              bg-white/60 dark:bg-white/5
              backdrop-blur-lg
              shadow-lg
            "
          >

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>

            <h3 className="text-2xl font-bold mt-2">
              {stat.value}
            </h3>

          </motion.div>
        ))}

      </div>

      {/* BIO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="
          p-6 rounded-2xl
          border border-white/20 dark:border-white/10
          bg-white/60 dark:bg-white/5
          backdrop-blur-lg
          shadow-lg
          space-y-4
        "
      >

        <h2 className="text-xl font-semibold">
          Trader Bio
        </h2>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Passionate forex trader focused on discipline,
          risk management, and long-term consistency.
          Journaling every trade to improve execution,
          psychology, and strategy refinement.
        </p>

      </motion.div>

      {/* ACCOUNT INFO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="
          p-6 rounded-2xl
          border border-white/20 dark:border-white/10
          bg-white/60 dark:bg-white/5
          backdrop-blur-lg
          shadow-lg
          space-y-4
        "
      >

        <h2 className="text-xl font-semibold">
          Account Information
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="font-medium">
              {user.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Joined
            </p>

            <p className="font-medium">
              {user.joined}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Trading Style
            </p>

            <p className="font-medium">
              {user.tradingStyle}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Experience
            </p>

            <p className="font-medium">
              {user.experience}
            </p>
          </div>

        </div>

      </motion.div>

    </div>
  );
}