"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <footer
      className="
        relative
        overflow-hidden
        border-t
        border-gray-200
        dark:border-white/10
        bg-white
        dark:bg-[#020817]
        transition-colors
        duration-500
      "
    >
      {/* Background glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-[220px]
          w-[360px]
          -translate-x-1/2
          rounded-full
          bg-cyan-500/5
          blur-[100px]
          sm:h-[260px]
          sm:w-[500px]
          sm:blur-[110px]
          md:h-[300px]
          md:w-[600px]
          md:blur-[120px]
        "
      />

      <div
        className="
          relative
          mx-auto
          max-w-7xl
          px-5
          sm:px-6
        "
      >
        {/* Main Footer */}
        <div
          className="
            grid
            gap-10
            py-12
            sm:gap-12
            sm:py-16
            md:grid-cols-2
            lg:grid-cols-4
          "
        >
          {/* Brand */}
          <div className="lg:col-span-2">
            <button
              type="button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="
                flex
                items-center
                gap-3
                rounded-xl
                text-left
              "
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                <Image
                  src="/Logo.png"
                  alt="Pipsoul logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </div>

              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Pipsoul
              </span>
            </button>

            <p
              className="
                mt-5
                max-w-md
                text-sm
                leading-6
                text-gray-600
                dark:text-gray-400
              "
            >
              Trade. Reflect. Improve.
              <br />
              A focused trading journal built to help you understand your
              decisions, build better habits, and become a more consistent
              trader.
            </p>

            <button
              type="button"
              onClick={() => scrollToSection("preview")}
              className="
                mt-5
                inline-flex
                min-h-10
                items-center
                gap-2
                rounded-lg
                text-sm
                font-medium
                text-cyan-500
                transition-colors
                hover:text-cyan-400
              "
            >
              Explore Pipsoul
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Product
            </h3>

            <ul className="mt-4 space-y-1">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("features")}
                  className="
                    flex
                    min-h-10
                    items-center
                    text-sm
                    text-gray-600
                    dark:text-gray-400
                    transition-colors
                    hover:text-gray-900
                    dark:hover:text-white
                  "
                >
                  Features
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("why-pipsoul")}
                  className="
                    flex
                    min-h-10
                    items-center
                    text-sm
                    text-gray-600
                    dark:text-gray-400
                    transition-colors
                    hover:text-gray-900
                    dark:hover:text-white
                  "
                >
                  Why Pipsoul
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("how-it-works")}
                  className="
                    flex
                    min-h-10
                    items-center
                    text-sm
                    text-gray-600
                    dark:text-gray-400
                    transition-colors
                    hover:text-gray-900
                    dark:hover:text-white
                  "
                >
                  How It Works
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("preview")}
                  className="
                    flex
                    min-h-10
                    items-center
                    text-sm
                    text-gray-600
                    dark:text-gray-400
                    transition-colors
                    hover:text-gray-900
                    dark:hover:text-white
                  "
                >
                  Preview
                </button>
              </li>
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Get Started
            </h3>

            <ul className="mt-4 space-y-1">
              <li>
                <Link
                  href="/login"
                  className="
                    flex
                    min-h-10
                    items-center
                    text-sm
                    text-gray-600
                    dark:text-gray-400
                    transition-colors
                    hover:text-gray-900
                    dark:hover:text-white
                  "
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  href="/signup"
                  className="
                    flex
                    min-h-10
                    items-center
                    text-sm
                    text-gray-600
                    dark:text-gray-400
                    transition-colors
                    hover:text-gray-900
                    dark:hover:text-white
                  "
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="border-t border-gray-200 dark:border-white/10" />

        {/* Bottom Footer */}
        <div
          className="
            flex
            flex-col
            gap-3
            py-6
            text-sm
            sm:gap-4
            sm:py-7
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <p className="text-gray-500">
            © {new Date().getFullYear()} Pipsoul. All rights reserved.
          </p>

          <div className="flex items-center">
            <span className="text-gray-500">
              Trade. Reflect. Improve.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}