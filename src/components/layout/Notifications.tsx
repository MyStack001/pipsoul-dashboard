"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNotifications } from "@/components/NotificationProvider";

export default function Notifications() {
  const [open, setOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    markAsRead,
  } = useNotifications();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div
      ref={ref}
      className="relative shrink-0"
    >
      {/* Notification Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        aria-expanded={open}
        className="
          relative
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          transition-all
          duration-200
          hover:bg-black/5
          active:scale-95
          dark:hover:bg-white/10
        "
      >
        <Bell
          className="
            h-6
            w-6
            text-gray-700
            dark:text-gray-300
          "
        />

        {/* Unread Count */}
        {unreadCount > 0 && (
          <span
            className="
              absolute
              -right-1
              -top-1
              flex
              h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-cyan-500
              px-1
              text-[10px]
              font-bold
              leading-none
              text-white
              shadow-sm
              ring-2
              ring-white
              dark:ring-[#020817]
            "
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: -8,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -8,
              scale: 0.98,
            }}
            transition={{
              duration: 0.18,
              ease: "easeOut",
            }}
            className="
              fixed
              right-4
              top-[4.5rem]
              z-[9999]

              w-[calc(100vw-2rem)]
              max-w-sm

              overflow-hidden
              rounded-2xl

              border
              border-gray-200/70
              bg-white/95
              shadow-[0_20px_60px_rgba(0,0,0,0.15)]
              backdrop-blur-2xl

              dark:border-white/10
              dark:bg-[#0B1220]/95
              dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]

              sm:right-6
              sm:w-96
            "
          >
            {/* Header */}
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-gray-200/70
                px-5
                py-4
                dark:border-white/10
              "
            >
              <div>
                <h3
                  className="
                    text-base
                    font-semibold
                    text-black
                    dark:text-white
                  "
                >
                  Notifications
                </h3>

                {unreadCount > 0 && (
                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    {unreadCount} unread
                  </p>
                )}
              </div>

              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-cyan-500/10
                  text-cyan-500
                "
              >
                <Bell className="h-4 w-4" />
              </div>
            </div>

            {/* Notification List */}
            <div
              className="
                max-h-[min(420px,calc(100vh-11rem))]
                overflow-y-auto
                overscroll-contain
              "
            >
              {notifications.length === 0 ? (
                <div
                  className="
                    flex
                    min-h-40
                    flex-col
                    items-center
                    justify-center
                    px-6
                    py-10
                    text-center
                  "
                >
                  <div
                    className="
                      mb-3
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      bg-gray-100
                      text-gray-400
                      dark:bg-white/5
                      dark:text-gray-500
                    "
                  >
                    <Bell className="h-5 w-5" />
                  </div>

                  <p
                    className="
                      text-sm
                      font-medium
                      text-gray-700
                      dark:text-gray-300
                    "
                  >
                    No notifications yet
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-gray-400
                      dark:text-gray-500
                    "
                  >
                    We'll let you know when something happens.
                  </p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={async () => {
                      if (!item.is_read) {
                        await markAsRead(item.id);
                      }
                    }}
                    className={`
                      group
                      cursor-pointer
                      border-b
                      border-gray-100
                      px-5
                      py-4
                      transition-colors
                      dark:border-white/5

                      ${
                        !item.is_read
                          ? "bg-cyan-500/[0.04] hover:bg-cyan-500/[0.08] dark:bg-cyan-500/[0.05] dark:hover:bg-cyan-500/[0.09]"
                          : "hover:bg-gray-50 dark:hover:bg-white/[0.04]"
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      {/* Unread Indicator */}
                      <div className="flex w-2 shrink-0 justify-center pt-1.5">
                        {!item.is_read && (
                          <span
                            className="
                              h-2
                              w-2
                              rounded-full
                              bg-cyan-500
                            "
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <p
                          className={`
                            text-sm
                            font-semibold
                            ${
                              item.is_read
                                ? "text-gray-800 dark:text-gray-200"
                                : "text-black dark:text-white"
                            }
                          `}
                        >
                          {item.title}
                        </p>

                        <p
                          className="
                            mt-1
                            break-words
                            text-sm
                            leading-5
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          {item.message}
                        </p>

                        <p
                          className="
                            mt-2
                            text-[11px]
                            text-gray-400
                            dark:text-gray-500
                          "
                        >
                          {new Date(
                            item.created_at
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div
              className="
                border-t
                border-gray-200/70
                bg-white/80
                px-4
                py-3
                dark:border-white/10
                dark:bg-white/[0.02]
              "
            >
              <button
                type="button"
                className="
                  w-full
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-cyan-500
                  transition-colors
                  hover:bg-cyan-500/10
                  hover:text-cyan-400
                "
              >
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}