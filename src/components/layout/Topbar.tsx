"use client";

import { Menu } from "lucide-react";

export default function Topbar({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  return (
    <div
      className="
        h-16
        backdrop-blur-xl
        bg-white/30 dark:bg-white/5
        border-b border-gray-200/60 dark:border-white/10
        text-black dark:text-white
        flex items-center justify-between px-6
        shadow-sm dark:shadow-none
      "
    >
      <div className="flex items-center gap-4">

        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="
            md:hidden
            p-2 rounded-lg
            hover:bg-black/5
            dark:hover:bg-white/10
            transition-colors
          "
        >
          <Menu className="w-6 h-6" />
        </button>

        <h2 className="font-medium">
          Dashboard
        </h2>
      </div>

      <div className="text-sm text-gray-700 dark:text-gray-300">
        User
      </div>
    </div>
  );
}