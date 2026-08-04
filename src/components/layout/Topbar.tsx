"use client";

import { Menu, ChevronDown } from "lucide-react";
import Notifications from "./Notifications";
import { useProfile } from "@/components/ProfileProvider";
import { useEffect, useRef, useState } from "react";
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
  addAccount,
} = useAccount();
const [accountOpen, setAccountOpen] = useState(false);
const [showManageAccountsModal, setShowManageAccountsModal] =
  useState(false);

const [showAddAccountModal, setShowAddAccountModal] = useState(false);
const [newAccountName, setNewAccountName] = useState("");
const modalRef = useRef<HTMLDivElement>(null);

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

useEffect(() => {
  if (!showAddAccountModal) return;

  const handleClickOutside = (event: MouseEvent) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(event.target as Node)
    ) {
      setShowAddAccountModal(false);
      setNewAccountName("");
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () =>
    document.removeEventListener("mousedown", handleClickOutside);
}, [showAddAccountModal]);

useEffect(() => {
  if (!showAddAccountModal) return;

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setShowAddAccountModal(false);
      setNewAccountName("");
    }
  };

  document.addEventListener("keydown", handleEscape);

  return () =>
    document.removeEventListener("keydown", handleEscape);
}, [showAddAccountModal]);

  return (
    <>
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
  <span>
  {currentAccount?.name || "Trading Account"}
</span>

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
  onClick={() => {
    setAccountOpen(false);
    setShowAddAccountModal(true);
  }}
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

<div
  onClick={() => {
    setAccountOpen(false);
    setShowManageAccountsModal(true);
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
  ⚙ Manage Accounts
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

    {showAddAccountModal && (
      <div
        className="
          fixed inset-0
          z-[100]
          flex items-center justify-center
          bg-black/40
          backdrop-blur-sm
        "
      >
        <div
        ref={modalRef}
          className="
            w-full
            max-w-[420px]
            rounded-2xl
            border border-gray-200 dark:border-white/10
            bg-white/80 dark:bg-[#111827]/90
            backdrop-blur-xl
            px-8 py-7
            shadow-2xl
          "
        >
          <h2 className="text-2xl font-bold text-black dark:text-white">
  Add Trading Account
</h2>

<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
  Create a separate account to track your performance independently.
</p>

<div className="mt-6">
  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
    Account Name
  </label>

  <input
    type="text"
    placeholder="e.g. FTMO 100K"
    value={newAccountName}
    onChange={(e) => setNewAccountName(e.target.value)}
    className="
      w-full
      px-4 py-3
      rounded-xl
      bg-white dark:bg-[#0f172a]
      border border-gray-200 dark:border-white/10
      text-black dark:text-white
      placeholder:text-gray-400
      focus:outline-none
      focus:ring-2
      focus:ring-cyan-500
    "
  />
</div>

<div className="mt-8 flex justify-end gap-3">
  <button
    type="button"
    onClick={() => {
      setShowAddAccountModal(false);
      setNewAccountName("");
    }}
    className="
      px-5 py-2.5
      rounded-xl
      border border-gray-200 dark:border-white/10
      text-gray-700 dark:text-gray-300
      hover:bg-gray-100
      dark:hover:bg-white/10
      transition
    "
  >
    Cancel
  </button>

  <button
    type="button"
    onClick={async () => {
  if (!newAccountName.trim()) return;

  const account = await addAccount(newAccountName.trim());

  if (!account) return;

  setShowAddAccountModal(false);
  setNewAccountName("");
}}
    className="
      px-5 py-2.5
      rounded-xl
      bg-cyan-500
      hover:bg-cyan-600
      text-white
      transition
    "
  >
    Add Account
  </button>
</div>
        </div>
      </div>
    )}

    {showManageAccountsModal && (
  <div
    onClick={() => setShowManageAccountsModal(false)}
    className="
      fixed inset-0
      z-[100]
      flex items-center justify-center
      bg-black/40
      backdrop-blur-sm
    "
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="
        w-full
        max-w-lg
        rounded-2xl
        border border-gray-200 dark:border-white/10
        bg-white/80 dark:bg-[#111827]/90
        backdrop-blur-xl
        px-8 py-7
        shadow-2xl
      "
    >
      <h2 className="text-2xl font-bold text-black dark:text-white">
        Manage Trading Accounts
      </h2>

      <div className="mt-6 space-y-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="
              flex items-center justify-between
              rounded-xl
              border border-gray-200 dark:border-white/10
              px-4 py-3
            "
          >
            <span className="font-medium text-black dark:text-white">
              {account.name}
            </span>

            <div className="flex items-center gap-4">
              <button className="hover:scale-110 transition">
                ✏️
              </button>

              <button className="hover:scale-110 transition">
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setShowManageAccountsModal(false)}
          className="
            px-5 py-2.5
            rounded-xl
            border border-gray-200 dark:border-white/10
            hover:bg-gray-100
            dark:hover:bg-white/10
          "
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

  </>
);
}