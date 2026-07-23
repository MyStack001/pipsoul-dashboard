"use client";

import { Menu } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

export default function Topbar({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const { profile } = useProfile();

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
      ? "Good afternoon"
      : "Good evening";

  return (
    <div
      className="
        h-16
        backdrop-blur-xl
        bg-white/30 dark:bg-white/5
        border-b border-gray-200/60 dark:border-white/10
        flex items-center justify-between
        px-6
      "
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white">
            {greeting}, {profile?.name || "Trader"} 👋
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ready to conquer the markets today?
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="font-medium text-black dark:text-white">
            {profile?.name || "Trader"}
          </p>
        </div>

        <div className="w-10 h-10 rounded-full overflow-hidden bg-cyan-500 flex items-center justify-center text-white font-bold">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            profile?.name?.charAt(0).toUpperCase() || "T"
          )}
        </div>
      </div>
    </div>
  );
}