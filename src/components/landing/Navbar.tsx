"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-3 sm:px-5 pt-3 sm:pt-5">

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
            px-3
            sm:px-6
            py-3
            sm:py-4
          "
        >

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 shrink-0"
          >
            <Image
              src="/Logo.png"
              alt="Pipsoul"
              width={44}
              height={44}
              className="
                h-9
                w-9
                sm:h-11
                sm:w-11
                object-contain
              "
              priority
            />

            <span
              className="
                text-lg
                sm:text-xl
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
              href="#why-pipsoul"
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

            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-cyan-500 dark:text-gray-300 dark:hover:text-cyan-400 transition-colors"
            >
              How It Works
            </a>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">

            <Link
              href="/login"
              className="
                rounded-xl
                px-2.5
                sm:px-4
                py-2
                text-sm
                sm:text-base
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
                px-3.5
                sm:px-5
                py-2
                sm:py-2.5
                text-sm
                sm:text-base
                font-semibold
                text-white
                hover:bg-cyan-600
                transition-colors
                whitespace-nowrap
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