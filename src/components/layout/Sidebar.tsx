"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { supabase } from "@/lib/supabase";
import {
  Sun,
  Moon,
  LayoutDashboard,
  BarChart3,
  LineChart,
  CircleUserRound,
  BookOpen,
  LogOut,
} from "lucide-react";
import Image from "next/image";

export default function Sidebar({
  onClose,
}: {
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [isDark, setIsDark] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const checkTheme = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const isDarkMode = document.documentElement.classList.contains("dark");

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
    router.push("/login");
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Trades", href: "/trades", icon: BarChart3 },
    { name: "Analytics", href: "/analytics", icon: LineChart },
    { name: "Profile", href: "/profile", icon: CircleUserRound },
    { name: "Journal", href: "/journal", icon: BookOpen },
  ];

  return (
    <>
      <div
        className="w-60 h-full flex flex-col bg-white/40 dark:bg-white/5
        backdrop-blur-xl border-r border-gray-200/70 dark:border-white/10
        text-black dark:text-white shadow-sm"
      >
        {/* TOP SECTION */}
        <div className="p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <Image
              src="/Logo.png"
              alt="Pipsoul Logo"
              width={36}
              height={36}
              priority
            />
            <h2 className="text-xl font-bold">Pipsoul</h2>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => onClose?.()}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
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
        <div className="mt-auto p-4 border-t border-gray-200/70 dark:border-white/10 space-y-3">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg
            bg-white/60 dark:bg-white/10 border border-gray-200/70 dark:border-white/10
            shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md active:scale-95"
          >
            <span className="font-medium">
              {isDark ? "Light Mode" : "Dark Mode"}
            </span>

            <span className="text-cyan-500 dark:text-cyan-400">
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </span>
          </button>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg
            border border-red-200 dark:border-red-500/20
            bg-red-50 dark:bg-red-500/10
            text-red-600 dark:text-red-400
            transition-all duration-300
            hover:bg-red-100 dark:hover:bg-red-500/20
            hover:scale-[1.02]
            active:scale-95"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

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