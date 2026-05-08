"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sun, Moon } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

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

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Trades", href: "/trades" },
    { name: "Analytics", href: "/analytics" },
    { name: "Users", href: "/users" },
    { name: "Journal", href: "/journal" },
  ];

  return (
    <div className="w-60 h-screen backdrop-blur-xl bg-white/40 dark:bg-white/5 border-r border-gray-200/70 dark:border-white/10 p-4 flex flex-col text-black dark:text-white shadow-sm">
      <h2 className="text-xl font-bold mb-6">Pipsoul</h2>

      <nav className="flex flex-col gap-2 mb-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <a
              key={item.name}
              href={item.href}
              className={`
                px-3 py-2 rounded-lg transition-all duration-200

                ${
                  isActive
                    ? "bg-cyan-100/80 border border-cyan-300 shadow-sm text-black font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-cyan-50 hover:text-black hover:shadow-sm"
                }

                dark:hover:bg-white/10 dark:hover:text-white
              `}
            >
              {item.name}
            </a>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="mt-2 flex items-center justify-between w-full px-3 py-2 rounded-lg bg-white/60 dark:bg-white/10 border border-gray-200/70 dark:border-white/10 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95"
      >
        <span className="font-medium">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>

        <span className="text-cyan-500 dark:text-cyan-400 transition-all duration-300 hover:rotate-12">
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </span>
      </button>
    </div>
  );
}
