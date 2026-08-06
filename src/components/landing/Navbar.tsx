"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-5 pt-5">

        <nav
          className="
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-gray-200
            dark:border-white/10
            bg-white/75
            dark:bg-[#0B1120]/75
            backdrop-blur-xl
            px-6
            py-4
          "
        >

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-cyan-500
                font-bold
                text-white
              "
            >
              P
            </div>

            <span
              className="
                text-xl
                font-bold
                text-gray-900
                dark:text-white
              "
            >
              Pipsoul
            </span>
          </Link>

          {/* Desktop Links */}
          <div
            className="
              hidden
              md:flex
              items-center
              gap-8
              text-sm
              font-medium
            "
          >
            <a
              href="#features"
              className="text-gray-600 hover:text-cyan-500 dark:text-gray-300 dark:hover:text-cyan-400 transition-colors"
            >
              Features
            </a>

            <a
              href="#why"
              className="text-gray-600 hover:text-cyan-500 dark:text-gray-300 dark:hover:text-cyan-400 transition-colors"
            >
              Why Pipsoul
            </a>

            <a
              href="#preview"
              className="text-gray-600 hover:text-cyan-500 dark:text-gray-300 dark:hover:text-cyan-400 transition-colors"
            >
              Preview
            </a>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            <Link
              href="/login"
              className="
                rounded-xl
                px-4
                py-2
                font-medium
                text-gray-700
                dark:text-gray-300
                hover:text-cyan-500
                dark:hover:text-cyan-400
                transition-colors
              "
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="
                rounded-xl
                bg-cyan-500
                px-5
                py-2.5
                font-semibold
                text-white
                hover:bg-cyan-600
                transition-colors
              "
            >
              Get Started
            </Link>

          </div>

        </nav>

      </div>
    </header>
  );
}