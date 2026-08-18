"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";
import {
  Bot,
  Sun,
  Moon,
  LayoutDashboard,
  BarChart3,
  LineChart,
  CircleUserRound,
  BookOpen,
  LogOut,
  ChevronDown,
  Pencil,
  Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useAccount } from "@/components/AccountProvider";
import { toast } from "sonner";

export default function Sidebar({
  onClose,
}: {
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [isDark, setIsDark] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Trading accounts
  const {
    accounts,
    currentAccount,
    setCurrentAccount,
    addAccount,
    renameAccount,
    deleteAccount,
  } = useAccount();

  const [accountOpen, setAccountOpen] = useState(false);

  const [showManageAccountsModal, setShowManageAccountsModal] =
    useState(false);

  const [showAddAccountModal, setShowAddAccountModal] =
    useState(false);

  const [newAccountName, setNewAccountName] = useState("");

  const [editingAccountId, setEditingAccountId] =
    useState<string | null>(null);

  const [editingName, setEditingName] = useState("");

  const [accountToDelete, setAccountToDelete] =
    useState<string | null>(null);

  const [accountToDeleteName, setAccountToDeleteName] =
    useState("");

  useEffect(() => {
    const checkTheme = () =>
      setIsDark(
        document.documentElement.classList.contains("dark")
      );

    checkTheme();

    const observer = new MutationObserver(checkTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const isDarkMode =
      document.documentElement.classList.contains("dark");

    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  async function confirmLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      return;
    }

    setShowLogoutModal(false);
    onClose?.();
    router.replace("/login");
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Trades",
      href: "/trades",
      icon: BarChart3,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: LineChart,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: CircleUserRound,
    },
    {
      name: "Journal",
      href: "/journal",
      icon: BookOpen,
    },
    {
      name: "Pipsoul AI",
      href: "/ai",
      icon: Bot,
    },
  ];

  return (
    <>
      <div
        className="
          w-60 h-full flex flex-col
          bg-white/40 dark:bg-white/5
          backdrop-blur-xl
          border-r border-gray-200/70 dark:border-white/10
          text-black dark:text-white
          shadow-sm
        "
      >
        {/* TOP SECTION */}
        <div className="p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <Image
              src="/Logo.png"
              alt="Pipsoul Logo"
              width={40}
              height={40}
              className="rounded-full object-cover"
              priority
            />

            <h2 className="text-xl font-bold">
              Pipsoul
            </h2>
          </div>

          {/* TRADING ACCOUNT */}
          <div className="relative mb-6 md:hidden">
            <p className="px-1 mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              Trading Account
            </p>

            <button
              type="button"
              onClick={() => setAccountOpen(!accountOpen)}
              className="
                w-full
                flex items-center justify-between
                gap-2
                px-3 py-2.5
                rounded-xl
                bg-white/60 dark:bg-white/10
                border border-gray-200/70 dark:border-white/10
                shadow-sm
                text-sm font-medium
                text-black dark:text-white
                hover:bg-cyan-50
                dark:hover:bg-white/10
                transition
              "
            >
              <span className="truncate">
                {currentAccount?.name || "Trading Account"}
              </span>

              <ChevronDown
                className={`
                  w-4 h-4 shrink-0
                  transition-transform
                  ${
                    accountOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {/* ACCOUNT DROPDOWN */}
            {accountOpen && (
              <div
                className="
                  absolute
                  left-0
                  right-0
                  top-full
                  mt-2
                  w-full
                  rounded-xl
                  border border-gray-200/70 dark:border-white/10
                  bg-white dark:bg-[#111827]
                  shadow-xl
                  overflow-hidden
                  z-[80]
                "
              >
                {accounts.map((account) => (
                  <button
                    type="button"
                    key={account.id}
                    onClick={() => {
                      setCurrentAccount(account);
                      setAccountOpen(false);
                    }}
                    className="
                      w-full
                      px-4 py-3
                      flex items-center
                      text-left
                      cursor-pointer
                      hover:bg-cyan-50
                      dark:hover:bg-white/10
                      text-sm
                      text-black dark:text-white
                      transition
                    "
                  >
                    <span className="mr-2 w-4">
                      {account.id ===
                      currentAccount?.id
                        ? "✓"
                        : ""}
                    </span>

                    <span className="truncate">
                      {account.name}
                    </span>
                  </button>
                ))}

                <div className="border-t border-gray-200 dark:border-white/10" />

                <button
                  type="button"
                  onClick={() => {
                    setAccountOpen(false);
                    setShowAddAccountModal(true);
                  }}
                  className="
                    w-full
                    px-4 py-3
                    text-left
                    cursor-pointer
                    text-cyan-500
                    hover:bg-cyan-50
                    dark:hover:bg-white/10
                    text-sm
                    transition
                  "
                >
                  + Add Account
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAccountOpen(false);
                    setShowManageAccountsModal(true);
                  }}
                  className="
                    w-full
                    px-4 py-3
                    text-left
                    cursor-pointer
                    hover:bg-cyan-50
                    dark:hover:bg-white/10
                    text-sm
                    text-black dark:text-white
                    transition
                  "
                >
                  ⚙ Manage Accounts
                </button>
              </div>
            )}

            {/* ADD ACCOUNT FLOATING PANEL */}
            {showAddAccountModal && (
              <div
                className="
                  absolute
                  left-0
                  top-full
                  mt-3
                  z-[100]
                  w-[calc(100vw-2rem)]
                  max-w-[420px]
                  rounded-2xl
                  border border-gray-200 dark:border-white/10
                  bg-white/95 dark:bg-[#111827]/95
                  backdrop-blur-xl
                  px-6 py-6
                  shadow-2xl
                "
              >
                <h2 className="text-xl font-bold text-black dark:text-white">
                  Add Trading Account
                </h2>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Create a separate account to track your
                  performance independently.
                </p>

                <div className="mt-5">
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Account Name
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. FTMO 100K"
                    value={newAccountName}
                    onChange={(e) =>
                      setNewAccountName(e.target.value)
                    }
                    autoFocus
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

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddAccountModal(false);
                      setNewAccountName("");
                    }}
                    className="
                      px-4 py-2.5
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

                      const account = await addAccount(
                        newAccountName.trim()
                      );

                      if (!account) return;

                      setShowAddAccountModal(false);
                      setNewAccountName("");
                    }}
                    className="
                      px-4 py-2.5
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
            )}

            {/* MANAGE ACCOUNTS FLOATING PANEL */}
            {showManageAccountsModal && (
              <div
                className="
                  absolute
                  left-0
                  top-full
                  mt-3
                  z-[100]
                  w-[calc(100vw-2rem)]
                  max-w-lg
                  max-h-[70vh]
                  overflow-y-auto
                  rounded-2xl
                  border border-gray-200 dark:border-white/10
                  bg-white/95 dark:bg-[#111827]/95
                  backdrop-blur-xl
                  px-6 py-6
                  shadow-2xl
                "
              >
                <h2 className="text-xl font-bold text-black dark:text-white">
                  Manage Trading Accounts
                </h2>

                <div className="mt-5 space-y-3">
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className="
                        flex items-center justify-between
                        gap-3
                        rounded-xl
                        border border-gray-200 dark:border-white/10
                        px-4 py-3
                      "
                    >
                      {editingAccountId ===
                      account.id ? (
                        <input
                          autoFocus
                          value={editingName}
                          onChange={(e) =>
                            setEditingName(
                              e.target.value
                            )
                          }
                          onBlur={async () => {
                            await renameAccount(
                              account.id,
                              editingName
                            );

                            setEditingAccountId(null);
                            setEditingName("");
                          }}
                          onKeyDown={async (e) => {
                            if (e.key === "Enter") {
                              await renameAccount(
                                account.id,
                                editingName
                              );

                              setEditingAccountId(null);
                              setEditingName("");
                            }

                            if (e.key === "Escape") {
                              setEditingAccountId(null);
                              setEditingName("");
                            }
                          }}
                          className="
                            flex-1
                            min-w-0
                            rounded-lg
                            border border-gray-200 dark:border-white/10
                            bg-transparent
                            px-2 py-1
                            text-black dark:text-white
                            focus:outline-none
                            focus:ring-2
                            focus:ring-cyan-500
                          "
                        />
                      ) : (
                        <span className="font-medium text-black dark:text-white truncate">
                          {account.name}
                        </span>
                      )}

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAccountId(
                              account.id
                            );
                            setEditingName(account.name);
                          }}
                          className="
                            p-1.5 rounded-lg
                            text-gray-500
                            hover:text-cyan-500
                            hover:bg-cyan-50
                            dark:hover:bg-white/10
                            transition
                          "
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAccountToDelete(
                              account.id
                            );
                            setAccountToDeleteName(
                              account.name
                            );
                          }}
                          className="
                            p-1.5 rounded-lg
                            text-gray-500
                            hover:text-red-500
                            hover:bg-red-50
                            dark:hover:bg-red-500/10
                            transition
                          "
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setShowManageAccountsModal(false)
                    }
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
            )}
          </div>

          {/* NAVIGATION */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => onClose?.()}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-cyan-100/80 border border-cyan-300 shadow-sm text-black font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-cyan-50 hover:text-black hover:shadow-sm"
                    }
                    dark:hover:bg-white/10 dark:hover:text-white
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

       {/* BOTTOM SECTION */}
<div
  className="
    mt-auto p-4
    border-t border-gray-200/70 dark:border-white/10
  "
>
  <div className="space-y-2">

   {/* THEME TOGGLE */}
<button
  type="button"
  onClick={toggleTheme}
  className="
    group
    w-full
    flex items-center justify-between
    px-3 py-2.5
    rounded-xl
    bg-white/50 dark:bg-white/[0.04]
    border border-gray-200/70 dark:border-white/10
    hover:bg-white/80 dark:hover:bg-white/[0.08]
    transition-all duration-200
  "
>
  <div className="flex items-center gap-3">
    <div
      className="
        flex items-center justify-center
        w-8 h-8
        rounded-lg
        bg-cyan-50 dark:bg-cyan-500/10
        text-cyan-500 dark:text-cyan-400
        transition
      "
    >
      {isDark ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </div>

    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
      {isDark ? "Dark Mode" : "Light Mode"}
    </span>
  </div>

  {/* SWITCH */}
  <div
    className={`
      relative
      w-11 h-6
      rounded-full
      transition-colors duration-200
      ${
        isDark
          ? "bg-cyan-500"
          : "bg-gray-300 dark:bg-gray-700"
      }
    `}
  >
    <span
      className={`
        absolute
        top-0.5
        left-0.5
        w-5 h-5
        rounded-full
        bg-white
        shadow-md
        transition-transform duration-200
        ${
          isDark
            ? "translate-x-5"
            : "translate-x-0"
        }
      `}
    />
  </div>
</button>

    {/* LOGOUT */}
    <button
      type="button"
      onClick={() => setShowLogoutModal(true)}
      className="
        group
        w-full
        flex items-center gap-3
        px-3 py-2.5
        rounded-xl
        text-gray-600 dark:text-gray-400
        hover:bg-red-50
        dark:hover:bg-red-500/10
        hover:text-red-600
        dark:hover:text-red-400
        transition-all duration-200
      "
    >
      <div
        className="
          flex items-center justify-center
          w-8 h-8
          rounded-lg
          bg-gray-100 dark:bg-white/5
          text-gray-500 dark:text-gray-400
          group-hover:bg-red-100
          dark:group-hover:bg-red-500/10
          group-hover:text-red-500
          transition
        "
      >
        <LogOut className="w-4 h-4" />
      </div>

      <span className="text-sm font-medium">
        Logout
      </span>
    </button>

  </div>
</div>
      </div>

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
{accountToDelete &&
  typeof document !== "undefined" &&
  createPortal(
    <div
      onClick={() => {
        setAccountToDelete(null);
        setAccountToDeleteName("");
      }}
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/40
        backdrop-blur-sm
        px-4
      "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full
          max-w-md
          rounded-2xl
          border border-gray-200 dark:border-white/10
          bg-white/95 dark:bg-[#111827]/95
          backdrop-blur-xl
          px-6 py-6
          sm:px-8 sm:py-7
          shadow-2xl
        "
      >
        <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white">
          Delete Trading Account
        </h2>

        <p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-300">
          Are you sure you want to delete
          <span className="font-semibold">
            {" "}
            "{accountToDeleteName}"
          </span>
          ?
        </p>

        <p className="mt-2 text-sm text-red-500">
          This action cannot be undone.
        </p>

        <div className="mt-7 sm:mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setAccountToDelete(null);
              setAccountToDeleteName("");
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
              if (!accountToDelete) return;

              const deleted = await deleteAccount(accountToDelete);

              if (!deleted) return;

              toast.success(
                "Trading account deleted successfully."
              );

              setAccountToDelete(null);
              setAccountToDeleteName("");
              setShowManageAccountsModal(false);
            }}
            className="
              px-5 py-2.5
              rounded-xl
              bg-red-500
              hover:bg-red-600
              text-white
              transition
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  )}
      {/* LOGOUT MODAL */}
      <ConfirmModal
        open={showLogoutModal}
        title="Sign Out of Pipsoul?"
        description="Are you sure you want to log out of your Pipsoul account?"
        subtext="You can sign back in at any time."
        confirmText="Yes, Sign Out"
        confirmColor="red"
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
}