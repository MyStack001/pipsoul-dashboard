"use client";

import { Menu, ChevronDown } from "lucide-react";
import Notifications from "./Notifications";
import { useProfile } from "@/components/ProfileProvider";
import { useEffect, useState } from "react";
import { useAccount } from "@/components/AccountProvider";

export default function Topbar({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const { profile, loading  } = useProfile();
  const {
  accounts,
  currentAccount,
  setCurrentAccount,
} = useAccount();
const [accountOpen, setAccountOpen] = useState(false);

  const hour = new Date().getHours();

 const [greeting, setGreeting] = useState("Hello");

useEffect(() => {
  const hour = new Date().getHours();

  setGreeting(
    hour < 12
      ? "Good morning"
      : hour < 18
      ? "Good afternoon"
      : "Good evening"
  );
}, []);

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
    {greeting}, {profile?.name ?? "Trader"} 👋
  </h2>

  <p className="text-sm text-gray-500 dark:text-gray-400">
    Ready to conquer the markets today?
  </p>
</div>
      </div>

      <div className="relative hidden md:flex flex-col items-center">
  <span className="text-xs text-gray-500 dark:text-gray-400">
    Trading Account
  </span>

  <div
  onClick={() => setAccountOpen(!accountOpen)}
  className="
    mt-1
    flex items-center gap-1
    cursor-pointer
    text-sm font-medium
    text-black dark:text-white
    hover:text-cyan-500
    transition-colors
  "
>
  <span>Trading Account</span>

  <ChevronDown className="w-4 h-4" />
</div>
{accountOpen && (
  <div
    className="
      absolute
      mt-2
      w-56
      rounded-xl
      border border-gray-200/70 dark:border-white/10
      bg-white dark:bg-[#111827]
      shadow-xl
      overflow-hidden
      z-50
    "
  >
    {accounts.map((account) => (
      <div
  key={account.id}
  onClick={() => {
    setCurrentAccount(account);
    setAccountOpen(false);
  }}
  className="
    px-4 py-3
    cursor-pointer
    hover:bg-cyan-50
    dark:hover:bg-white/10
    text-sm
    text-black
    dark:text-white
  "
>
        {account.id === currentAccount?.id ? "✓ " : ""}
        {account.name}
      </div>
    ))}

    <div className="border-t border-gray-200 dark:border-white/10" />

    <div
      className="
        px-4 py-3
        cursor-pointer
        text-cyan-500
        hover:bg-cyan-50
        dark:hover:bg-white/10
        text-sm
      "
    >
      + Add Account
    </div>
  </div>
)}
</div>

      <div className="flex items-center gap-4">
  <Notifications />

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