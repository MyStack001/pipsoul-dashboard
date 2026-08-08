"use client";

import AIChat from "@/components/ai/AIChat";

export default function AIPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Pipsoul AI
        </h1>

        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Your trading companion for discipline, psychology, and smarter
          decision-making.
        </p>
      </div>

      {/* AI Chat */}
      <AIChat />
    </div>
  );
}