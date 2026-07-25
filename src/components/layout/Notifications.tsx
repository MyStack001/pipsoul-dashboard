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
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={async () => {
  const next = !open;
  setOpen(next);

  if (next) {
    await markAsRead();
  }
}}
        className="relative p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition"
      >
        <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-cyan-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-80 rounded-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden z-50"
          >
            <div className="px-5 py-4 border-b border-gray-200 dark:border-white/10">
              <h3 className="font-semibold text-black dark:text-white">
                Notifications
              </h3>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
  <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
    No notifications yet.
  </div>
) : (
  notifications.map((item) => (
                <div
                  key={item.id}
                  className="px-5 py-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition"
                >
                  <div className="flex items-start gap-3">
                    {!item.is_read && (
                      <div className="mt-2 h-2 w-2 rounded-full bg-cyan-500" />
                    )}

                    <div>
                      <p className="font-medium text-black dark:text-white">
                        {item.title}
                      </p>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {item.message}
                      </p>

                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )))}
            </div>

            <button className="w-full py-3 text-sm font-medium text-cyan-500 hover:bg-gray-50 dark:hover:bg-white/5">
              View all notifications
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}