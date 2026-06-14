"use client";

import { useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 inset-y-0 w-60">
        <Sidebar />
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="
            fixed inset-0 z-40
            bg-black/50
            md:hidden
          "
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-60
          transform transition-transform duration-300 ease-in-out
          md:hidden

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <Sidebar
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Right Section */}
      <div className="flex min-w-0 flex-1 flex-col md:ml-60">

        {/* Topbar */}
        <header className="fixed top-0 left-0 right-0 z-30 md:left-60">
          <Topbar
            onMenuClick={() =>
              setSidebarOpen(true)
            }
          />
        </header>

        {/* Main Content */}
        <main
          className="
            mt-16
            h-[calc(100vh-4rem)]
            overflow-y-auto
            overflow-x-hidden
            p-4 md:p-6
            bg-gray-50 dark:bg-[#0B0F19]
          "
        >
          {children}
        </main>

      </div>
    </div>
  );
}