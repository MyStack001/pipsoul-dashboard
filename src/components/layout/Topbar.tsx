"use client";

export default function Topbar() {
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
      <h2 className="font-medium">
        Dashboard
      </h2>

      <div className="text-sm text-gray-700 dark:text-gray-300">
        User
      </div>
    </div>
  );
}