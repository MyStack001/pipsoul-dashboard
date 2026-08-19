"use client";

import { Menu, ChevronDown, Hand } from "lucide-react";
import Notifications from "./Notifications";
import { useProfile } from "@/components/ProfileProvider";
import { useEffect, useRef, useState } from "react";
import { useAccount } from "@/components/AccountProvider";
import { toast } from "sonner";

export default function Topbar({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const { profile } = useProfile();

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

  const modalRef = useRef<HTMLDivElement>(null);

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

  /* --------------------------------
     CLOSE ADD ACCOUNT ON OUTSIDE CLICK
  -------------------------------- */

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

  /* --------------------------------
     ESCAPE KEY
  -------------------------------- */

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
      {/* =========================
          TOPBAR
      ========================== */}

      <div
        className="
          h-16
          w-full
          backdrop-blur-xl
          bg-white/30
          dark:bg-white/5
          border-b
          border-gray-200/60
          dark:border-white/10
          flex
          items-center
          justify-between
          px-3
          sm:px-4
          md:px-6
        "
      >
        {/* =========================
            LEFT SIDE
        ========================== */}

        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* MOBILE MENU */}
          <button
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="
              md:hidden
              shrink-0
              p-2
              rounded-xl
              text-gray-700
              dark:text-gray-300
              hover:bg-black/5
              dark:hover:bg-white/10
              transition
              active:scale-95
            "
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* GREETING */}
         <div className="min-w-0 max-w-[calc(100vw-120px)] sm:max-w-[420px] md:max-w-[500px]">
            <h2
  className="
    flex
    min-w-0
    items-center
    gap-1.5
    whitespace-nowrap
    text-sm
    font-semibold
    text-black
    dark:text-white
    sm:gap-2
    sm:text-lg
  "
>
  <span className="shrink-0">
    {greeting},
  </span>

  <span className="min-w-0 truncate">
    {profile?.name ?? "Trader"}
  </span>

  <Hand className="h-4 w-4 shrink-0 text-cyan-500 sm:h-5 sm:w-5" />
</h2>

            {/* Hide subtitle on very small screens */}
            <p
              className="
                hidden
                sm:block
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Ready to conquer the markets today?
            </p>
          </div>
        </div>

        {/* =========================
            DESKTOP TRADING ACCOUNT
        ========================== */}

        <div className="relative hidden md:flex flex-col items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Trading Account
          </span>

          <button
            type="button"
            onClick={() => setAccountOpen(!accountOpen)}
            className="
              mt-1
              flex
              items-center
              gap-1
              cursor-pointer
              text-sm
              font-medium
              text-black
              dark:text-white
              hover:text-cyan-500
              transition-colors
            "
          >
            <span>
              {currentAccount?.name || "Trading Account"}
            </span>

            <ChevronDown
              className={`
                w-4
                h-4
                transition-transform
                duration-200
                ${accountOpen ? "rotate-180" : ""}
              `}
            />
          </button>

          {/* ACCOUNT DROPDOWN */}

          {accountOpen && (
            <div
              className="
                absolute
                top-full
                mt-3
                w-56
                rounded-2xl
                border
                border-gray-200/70
                dark:border-white/10
                bg-white/95
                dark:bg-[#111827]/95
                backdrop-blur-xl
                shadow-2xl
                overflow-hidden
                z-50
              "
            >
              {/* ACCOUNTS */}

              {accounts.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => {
                    setCurrentAccount(account);
                    setAccountOpen(false);
                  }}
                  className="
                    w-full
                    px-4
                    py-3
                    text-left
                    cursor-pointer
                    hover:bg-cyan-50
                    dark:hover:bg-white/10
                    text-sm
                    text-black
                    dark:text-white
                    transition
                  "
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`
                        w-4
                        ${
                          account.id === currentAccount?.id
                            ? "text-cyan-500"
                            : "text-transparent"
                        }
                      `}
                    >
                      ✓
                    </span>

                    {account.name}
                  </span>
                </button>
              ))}

              <div className="border-t border-gray-200 dark:border-white/10" />

              {/* ADD ACCOUNT */}

              <button
                type="button"
                onClick={() => {
                  setAccountOpen(false);
                  setShowAddAccountModal(true);
                }}
                className="
                  w-full
                  px-4
                  py-3
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

              {/* MANAGE ACCOUNTS */}

              <button
                type="button"
                onClick={() => {
                  setAccountOpen(false);
                  setShowManageAccountsModal(true);
                }}
                className="
                  w-full
                  px-4
                  py-3
                  text-left
                  cursor-pointer
                  hover:bg-cyan-50
                  dark:hover:bg-white/10
                  text-sm
                  text-black
                  dark:text-white
                  transition
                "
              >
                ⚙ Manage Accounts
              </button>
            </div>
          )}
        </div>

        {/* =========================
            RIGHT SIDE
        ========================== */}

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Notifications />

          {/* NAME - HIDDEN ON MOBILE */}
          <div className="text-right hidden sm:block">
            <p className="font-medium text-black dark:text-white">
              {profile?.name || "Trader"}
            </p>
          </div>

          {/* AVATAR */}
          <div
            className="
              w-9
              h-9
              sm:w-10
              sm:h-10
              rounded-full
              overflow-hidden
              bg-cyan-500
              flex
              items-center
              justify-center
              text-white
              font-bold
              shrink-0
              ring-2
              ring-white/50
              dark:ring-white/10
            "
          >
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

      {/* =========================
          ADD ACCOUNT MODAL
      ========================== */}

      {showAddAccountModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            p-4
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
              border
              border-gray-200
              dark:border-white/10
              bg-white/90
              dark:bg-[#111827]/95
              backdrop-blur-xl
              px-6
              sm:px-8
              py-7
              shadow-2xl
            "
          >
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Add Trading Account
            </h2>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Create a separate account to track your performance
              independently.
            </p>

            <div className="mt-6">
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
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  bg-white
                  dark:bg-[#0f172a]
                  border
                  border-gray-200
                  dark:border-white/10
                  text-black
                  dark:text-white
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
                  px-5
                  py-2.5
                  rounded-xl
                  border
                  border-gray-200
                  dark:border-white/10
                  text-gray-700
                  dark:text-gray-300
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
                  px-5
                  py-2.5
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

      {/* =========================
          MANAGE ACCOUNTS MODAL
      ========================== */}

      {showManageAccountsModal && (
        <div
          onClick={() => setShowManageAccountsModal(false)}
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            p-4
            bg-black/40
            backdrop-blur-sm
          "
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              w-full
              max-w-lg
              max-h-[85vh]
              overflow-y-auto
              rounded-2xl
              border
              border-gray-200
              dark:border-white/10
              bg-white/90
              dark:bg-[#111827]/95
              backdrop-blur-xl
              px-6
              sm:px-8
              py-7
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
                    flex
                    items-center
                    justify-between
                    gap-3
                    rounded-xl
                    border
                    border-gray-200
                    dark:border-white/10
                    px-4
                    py-3
                  "
                >
                  {editingAccountId === account.id ? (
                    <input
                      autoFocus
                      value={editingName}
                      onChange={(e) =>
                        setEditingName(e.target.value)
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
                        border
                        border-gray-200
                        dark:border-white/10
                        bg-transparent
                        px-2
                        py-1
                        text-black
                        dark:text-white
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

                  <div className="flex items-center gap-4 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAccountId(account.id);
                        setEditingName(account.name);
                      }}
                      className="hover:scale-110 transition"
                    >
                      ✏️
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAccountToDelete(account.id);
                        setAccountToDeleteName(account.name);
                      }}
                      className="hover:scale-110 transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setShowManageAccountsModal(false)
                }
                className="
                  px-5
                  py-2.5
                  rounded-xl
                  border
                  border-gray-200
                  dark:border-white/10
                  hover:bg-gray-100
                  dark:hover:bg-white/10
                  transition
                "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          DELETE ACCOUNT MODAL
      ========================== */}

      {accountToDelete && (
        <div
          onClick={() => {
            setAccountToDelete(null);
            setAccountToDeleteName("");
          }}
          className="
            fixed
            inset-0
            z-[110]
            flex
            items-center
            justify-center
            p-4
            bg-black/40
            backdrop-blur-sm
          "
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              w-full
              max-w-md
              rounded-2xl
              border
              border-gray-200
              dark:border-white/10
              bg-white/90
              dark:bg-[#111827]/95
              backdrop-blur-xl
              px-6
              sm:px-8
              py-7
              shadow-2xl
            "
          >
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Delete Trading Account
            </h2>

            <p className="mt-4 text-gray-600 dark:text-gray-300">
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

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setAccountToDelete(null);
                  setAccountToDeleteName("");
                }}
                className="
                  px-5
                  py-2.5
                  rounded-xl
                  border
                  border-gray-200
                  dark:border-white/10
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

                  const deleted = await deleteAccount(
                    accountToDelete
                  );

                  if (!deleted) return;

                  toast.success(
                    "Trading account deleted successfully."
                  );

                  setAccountToDelete(null);
                  setAccountToDeleteName("");
                  setShowManageAccountsModal(false);
                }}
                className="
                  px-5
                  py-2.5
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
        </div>
      )}
    </>
  );
}