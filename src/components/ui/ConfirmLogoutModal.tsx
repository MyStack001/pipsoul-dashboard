"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert } from "lucide-react";

type ConfirmLogoutModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmLogoutModal({
  open,
  onClose,
  onConfirm,
}: ConfirmLogoutModalProps) {
    const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);

  return () => setMounted(false);
}, []);

if (!mounted) return null;
  return createPortal(
  <AnimatePresence>
    {open && (
      <>
        {/* Overlay */}
        <motion.div
          className="fixed inset-0 z-[9998] bg-black/45 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        />

        {/* Modal */}
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-5 pointer-events-none">
          <motion.div
            initial={{ x: -500, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -500, opacity: 0, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 24,
            }}
            className="
              pointer-events-auto
              w-full
              max-w-md
              rounded-3xl
              border
              border-gray-200 dark:border-white/10
              bg-white/90 dark:bg-[#111827]/95
              backdrop-blur-xl
              shadow-2xl
              p-8
            "
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/15">
              <TriangleAlert className="h-8 w-8 text-red-500" />
            </div>

            <h2 className="text-center text-2xl font-bold text-black dark:text-white">
              Sign Out of Pipsoul?
            </h2>

            <p className="mt-3 text-center text-gray-600 dark:text-gray-400 leading-7">
              Are you sure you want to log out of your Pipsoul account?
            </p>

            <p className="mt-1 text-center text-sm text-gray-500">
              You can sign back in at any time.
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={onClose}
                className="
                  flex-1
                  rounded-xl
                  border
                  border-gray-300 dark:border-white/10
                  py-3
                  font-semibold
                  text-black dark:text-white
                  transition-all
                  duration-300
                  hover:bg-gray-100
                  dark:hover:bg-white/10
                "
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                className="
                  flex-1
                  rounded-xl
                  bg-red-500
                  py-3
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:bg-red-600
                  hover:shadow-lg
                  hover:shadow-red-500/20
                  active:scale-95
                "
              >
                Yes, Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>,
  document.body
);
}