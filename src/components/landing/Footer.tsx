"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#020817]">
      {/* Background glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-[300px]
          w-[600px]
          -translate-x-1/2
          rounded-full
          bg-cyan-500/5
          blur-[120px]
        "
      />

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Main Footer */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
                  text-lg
                  font-bold
                  text-white
                  shadow-[0_0_30px_rgba(6,182,212,0.2)]
                "
              >
                P
              </div>

              <span className="text-xl font-bold text-white">
                Pipsoul
              </span>
            </button>

            <p className="mt-5 max-w-md text-sm leading-6 text-gray-400">
              Trade. Reflect. Improve.
              <br />
              A focused trading journal built to help you understand your
              decisions, build better habits, and become a more consistent
              trader.
            </p>

            <button
              onClick={() => scrollToSection("preview")}
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-cyan-400
                transition-colors
                hover:text-cyan-300
              "
            >
              Explore Pipsoul
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Product
            </h3>

            <ul className="mt-5 space-y-4">
              <li>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Features
                </button>
              </li>

              <li>
                <button
                  onClick={() => scrollToSection("why-pipsoul")}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Why Pipsoul
                </button>
              </li>

              <li>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  How It Works
                </button>
              </li>

              <li>
                <button
                  onClick={() => scrollToSection("preview")}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Preview
                </button>
              </li>
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Get Started
            </h3>

            <ul className="mt-5 space-y-4">
              <li>
                <Link
                  href="/login"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  href="/signup"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="border-t border-white/10" />

        {/* Bottom Footer */}
        <div className="flex flex-col gap-4 py-7 text-sm md:flex-row md:items-center md:justify-between">
          <p className="text-gray-500">
            © {new Date().getFullYear()} Pipsoul. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-gray-500">
              Trade. Reflect. Improve.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}