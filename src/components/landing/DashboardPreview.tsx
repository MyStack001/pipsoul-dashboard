"use client";

import { useEffect, useRef, useState } from "react";

export default function DashboardPreview() {
  const previewRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = previewRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={previewRef}
      id="preview"
      className="
        relative
        scroll-mt-24
        overflow-hidden
        bg-[#0B1120]
        py-16
        sm:py-20
        lg:py-28
        transition-colors
        duration-500
      "
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative">

          {/* Background Glow */}
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-16
              -z-10
              h-[280px]
              w-[280px]
              -translate-x-1/2
              rounded-full
              bg-cyan-400/20
              blur-[100px]
              sm:top-24
              sm:h-[380px]
              sm:w-[620px]
              sm:blur-[120px]
            "
          />

          {/* Browser Window */}
          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              bg-[#111827]
              shadow-2xl
              transition-all
              duration-500
              hover:-translate-y-2
              hover:shadow-[0_30px_80px_rgba(6,182,212,0.18)]
              sm:rounded-[28px]
              lg:rounded-[32px]
              dark:border-gray-200
              dark:bg-white
            "
          >

            {/* Browser Header */}
            <div
              className="
                flex
                items-center
                gap-2
                border-b
                border-white/10
                bg-[#0F172A]
                px-3
                py-3
                dark:border-gray-200
                dark:bg-gray-50
                sm:px-5
                sm:py-4
                lg:px-6
              "
            >
              {/* Browser dots */}
              <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-400 sm:h-3 sm:w-3" />
              <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-yellow-400 sm:h-3 sm:w-3" />
              <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-green-400 sm:h-3 sm:w-3" />

              {/* Address bar */}
              <div
                className="
                  ml-2
                  min-w-0
                  flex-1
                  truncate
                  rounded-lg
                  bg-[#111827]
                  px-3
                  py-1.5
                  text-[10px]
                  text-gray-500
                  dark:bg-white
                  dark:text-gray-400
                  sm:ml-4
                  sm:px-4
                  sm:py-2
                  sm:text-xs
                  lg:text-sm
                "
              >
                app.pipsoul.com/dashboard
              </div>
            </div>

            {/* Dashboard Preview */}
            <div
              className="
                flex
                min-h-[680px]
                items-start
                justify-center
                bg-gradient-to-br
                from-[#08111F]
                to-[#0F172A]
                transition-colors
                duration-500
                dark:from-gray-50
                dark:to-white
                sm:min-h-[760px]
                lg:h-[900px]
              "
            >
              <div className="flex h-full w-full">

                {/* Sidebar */}
                <div
                  className="
                    hidden
                    w-64
                    shrink-0
                    flex-col
                    justify-between
                    border-r
                    border-white/10
                    bg-[#08111F]
                    p-6
                    transition-colors
                    duration-500
                    dark:border-gray-200
                    dark:bg-gray-50
                    lg:flex
                  "
                >
                  <div>
                    <h2 className="text-2xl font-bold text-white dark:text-gray-900">
                      Pipsoul
                    </h2>

                    <p className="mt-1 text-xs text-cyan-400">
                      Trade. Reflect. Improve.
                    </p>

                    <div className="mt-10 space-y-3">
                      <div className="rounded-xl bg-cyan-500 px-4 py-3 font-medium text-white">
                        Dashboard
                      </div>

                      <div className="rounded-xl px-4 py-3 text-gray-400 dark:text-gray-500">
                        Trades
                      </div>

                      <div className="rounded-xl px-4 py-3 text-gray-400 dark:text-gray-500">
                        Journal
                      </div>

                      <div className="rounded-xl px-4 py-3 text-gray-400 dark:text-gray-500">
                        Analytics
                      </div>

                      <div className="rounded-xl px-4 py-3 text-gray-400 dark:text-gray-500">
                        Achievements
                      </div>

                      <div className="rounded-xl px-4 py-3 text-gray-400 dark:text-gray-500">
                        Profile
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#0F172A] p-4 dark:border-gray-200 dark:bg-white">
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Trading Streak
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-cyan-400">
                      14 Days
                    </h3>
                  </div>
                </div>

                {/* Main Dashboard */}
                <div
                  className="
                    min-w-0
                    flex-1
                    bg-[#08111F]
                    p-4
                    transition-colors
                    duration-500
                    dark:bg-white
                    sm:p-6
                    lg:p-8
                  "
                >

                  {/* Greeting */}
                  <div className="mb-6 sm:mb-8">
                    <h3 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl dark:text-gray-900">
                      Good afternoon, Trader 👋
                    </h3>

                    <p className="mt-2 text-sm text-gray-400 dark:text-gray-500 sm:text-base">
                      Ready to conquer the markets today?
                    </p>
                  </div>

                  {/* Stat Cards */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">

                    <div
                      className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-[#0F172A]
                        p-4
                        backdrop-blur-xl
                        animate-[fadeUp_0.7s_ease-out_0.1s_both]
                        dark:border-gray-200
                        dark:bg-white
                        sm:p-5
                      "
                    >
                      <p className="text-xs text-gray-400 dark:text-gray-500 sm:text-sm">
                        Total Profit
                      </p>

                      <h4 className="mt-2 text-lg font-bold text-green-500 sm:text-2xl">
                        +$4,850
                      </h4>
                    </div>

                    <div
                      className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-[#0F172A]
                        p-4
                        backdrop-blur-xl
                        animate-[fadeUp_0.7s_ease-out_0.2s_both]
                        dark:border-gray-200
                        dark:bg-white
                        sm:p-5
                      "
                    >
                      <p className="text-xs text-gray-400 dark:text-gray-500 sm:text-sm">
                        Win Rate
                      </p>

                      <h4 className="mt-2 text-lg font-bold text-cyan-500 sm:text-2xl">
                        86%
                      </h4>
                    </div>

                    <div
                      className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-[#0F172A]
                        p-4
                        backdrop-blur-xl
                        animate-[fadeUp_0.7s_ease-out_0.3s_both]
                        dark:border-gray-200
                        dark:bg-white
                        sm:p-5
                      "
                    >
                      <p className="text-xs text-gray-400 dark:text-gray-500 sm:text-sm">
                        Total Trades
                      </p>

                      <h4 className="mt-2 text-lg font-bold text-white sm:text-2xl dark:text-gray-900">
                        128
                      </h4>
                    </div>

                    <div
                      className="
                        rounded-2xl
                        border
                        border-white/10
                        bg-[#0F172A]
                        p-4
                        backdrop-blur-xl
                        animate-[fadeUp_0.7s_ease-out_0.4s_both]
                        dark:border-gray-200
                        dark:bg-white
                        sm:p-5
                      "
                    >
                      <p className="text-xs text-gray-400 dark:text-gray-500 sm:text-sm">
                        Drawdown
                      </p>

                      <h4 className="mt-2 text-lg font-bold text-red-500 sm:text-2xl">
                        -4.2%
                      </h4>
                    </div>

                  </div>

                  {/* Equity Curve */}
                  <div
                    className="
                      mt-6
                      h-52
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/10
                      bg-[#0F172A]
                      shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                      transition-colors
                      duration-500
                      dark:border-gray-200
                      dark:bg-gray-50
                      sm:mt-8
                      sm:h-56
                      sm:rounded-3xl
                    "
                  >
                    {/* Chart Header */}
                    <div className="flex items-center justify-between px-4 pt-4 sm:px-6 sm:pt-5">
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 sm:text-sm">
                          Equity Curve
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white sm:text-lg dark:text-gray-900">
                          Account Growth
                        </p>
                      </div>

                      <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-[10px] font-medium text-green-500 sm:px-3 sm:text-xs">
                        +18.4%
                      </span>
                    </div>

                    {/* Chart */}
                    <div className="relative mt-2 h-[135px] w-full overflow-hidden sm:mt-3 sm:h-[150px]">

                      {/* Grid */}
                      <div className="absolute inset-0 opacity-25 dark:opacity-30">
                        <div
                          className="
                            h-full
                            w-full
                            bg-[linear-gradient(to_right,#94a3b8_1px,transparent_1px),linear-gradient(to_bottom,#94a3b8_1px,transparent_1px)]
                            bg-[size:60px_45px]
                            sm:bg-[size:70px_50px]
                          "
                        />
                      </div>

                      {/* Equity Line */}
                      <svg
                        viewBox="0 0 1000 250"
                        className="absolute inset-0 h-full w-full"
                        preserveAspectRatio="none"
                      >
                        {/* Glow */}
                        <path
                          d="
                            M0 180
                            C80 150,120 120,180 130
                            S300 180,380 140
                            S500 110,560 120
                            S680 80,760 60
                            S860 120,920 90
                            S980 70,1000 40
                          "
                          fill="none"
                          stroke="#06b6d4"
                          strokeOpacity="0.2"
                          strokeWidth="14"
                          strokeLinecap="round"
                          pathLength="1"
                          strokeDasharray="1"
                          strokeDashoffset={isVisible ? "0" : "1"}
                          style={{
                            transition: "stroke-dashoffset 1.8s ease-out",
                          }}
                        />

                        {/* Main Line */}
                        <path
                          d="
                            M0 180
                            C80 150,120 120,180 130
                            S300 180,380 140
                            S500 110,560 120
                            S680 80,760 60
                            S860 120,920 90
                            S980 70,1000 40
                          "
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="4"
                          strokeLinecap="round"
                          pathLength="1"
                          strokeDasharray="1"
                          strokeDashoffset={isVisible ? "0" : "1"}
                          style={{
                            transition: "stroke-dashoffset 2.2s ease-out",
                          }}
                        />

                        {/* Green Highlight */}
                        <path
                          d="
                            M560 120
                            S680 80,760 60
                            S860 120,920 90
                            S980 70,1000 40
                          "
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="4"
                          strokeLinecap="round"
                          pathLength="1"
                          strokeDasharray="1"
                          strokeDashoffset={isVisible ? "0" : "1"}
                          style={{
                            transition:
                              "stroke-dashoffset 1.2s ease-out 1s",
                          }}
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Recent Trades */}
                  <div
                    className="
                      relative
                      mt-6
                      max-w-2xl
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/10
                      bg-[#0F172A]
                      shadow-[0_30px_80px_rgba(0,0,0,0.45)]
                      dark:border-gray-200
                      dark:bg-gray-50
                      sm:mt-8
                      sm:rounded-[28px]
                    "
                  >
                    {/* Header */}
                    <div
                      className="
                        border-b
                        border-white/10
                        px-4
                        py-3
                        sm:px-6
                        sm:py-4
                      "
                    >
                      <h4 className="text-sm font-semibold text-white sm:text-base dark:text-gray-900">
                        Recent Trades
                      </h4>
                    </div>

                    {/* Trades */}
                    <div className="divide-y divide-white/10 dark:divide-gray-200">

                      {/* Trade 1 */}
                      <div className="grid grid-cols-3 items-center px-4 py-3 sm:px-6 sm:py-4">
                        <div className="min-w-0 text-left">
                          <p className="truncate text-sm font-semibold text-white sm:text-base dark:text-gray-900">
                            GBPJPY
                          </p>

                          <p className="mt-1 truncate text-[10px] text-gray-400 sm:text-sm dark:text-gray-500">
                            London Session
                          </p>
                        </div>

                        <div className="flex justify-center">
                          <span
                            className="
                              rounded-lg
                              bg-green-500/15
                              px-2
                              py-1
                              text-[10px]
                              font-semibold
                              text-green-400
                              animate-[softPulse_2.5s_ease-in-out_infinite]
                              sm:px-3
                              sm:text-xs
                            "
                          >
                            BUY
                          </span>
                        </div>

                        <p className="text-right text-sm font-semibold text-green-400 sm:text-base">
                          +$120
                        </p>
                      </div>

                      {/* Trade 2 */}
                      <div className="grid grid-cols-3 items-center px-4 py-3 sm:px-6 sm:py-4">
                        <div className="min-w-0 text-left">
                          <p className="truncate text-sm font-semibold text-white sm:text-base dark:text-gray-900">
                            XAUUSD
                          </p>

                          <p className="mt-1 truncate text-[10px] text-gray-400 sm:text-sm dark:text-gray-500">
                            New York
                          </p>
                        </div>

                        <div className="flex justify-center">
                          <span
                            className="
                              rounded-lg
                              bg-red-500/15
                              px-2
                              py-1
                              text-[10px]
                              font-semibold
                              text-red-400
                              animate-[softPulse_2.5s_ease-in-out_infinite]
                              sm:px-3
                              sm:text-xs
                            "
                          >
                            SELL
                          </span>
                        </div>

                        <p className="text-right text-sm font-semibold text-red-400 sm:text-base">
                          -$48
                        </p>
                      </div>

                      {/* Trade 3 */}
                      <div className="grid grid-cols-3 items-center px-4 py-3 sm:px-6 sm:py-4">
                        <div className="min-w-0 text-left">
                          <p className="truncate text-sm font-semibold text-white sm:text-base dark:text-gray-900">
                            EURUSD
                          </p>

                          <p className="mt-1 truncate text-[10px] text-gray-400 sm:text-sm dark:text-gray-500">
                            London Session
                          </p>
                        </div>

                        <div className="flex justify-center">
                          <span
                            className="
                              rounded-lg
                              bg-green-500/15
                              px-2
                              py-1
                              text-[10px]
                              font-semibold
                              text-green-400
                              animate-[softPulse_2.5s_ease-in-out_infinite]
                              sm:px-3
                              sm:text-xs
                            "
                          >
                            BUY
                          </span>
                        </div>

                        <p className="text-right text-sm font-semibold text-green-400 sm:text-base">
                          +$86
                        </p>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Floating Card 1 — Win Rate */}
          <div
            className="
              pointer-events-none
              absolute
              -left-6
              top-[158px]
              z-20
              hidden
              w-[120px]
              rounded-2xl
              border
              border-white/10
              bg-[#0B1220]/95
              p-4
              shadow-[0_20px_50px_rgba(0,0,0,0.45)]
              backdrop-blur-xl
              transition-all
              duration-500
              animate-[float_5s_ease-in-out_infinite]
              dark:bg-white/95
              lg:block
            "
          >
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
              Win Rate
            </p>

            <h4 className="mt-2 text-2xl font-bold text-green-400">
              86%
            </h4>

            <p className="mt-1 text-[10px] font-medium text-cyan-400">
              Great! Improve.
            </p>
          </div>

          {/* Floating Card 2 — Latest Journal */}
          <div
            className="
              pointer-events-none
              absolute
              -right-8
              top-[176px]
              z-20
              hidden
              w-[190px]
              rounded-2xl
              border
              border-white/10
              bg-[#0B1220]/95
              p-5
              shadow-[0_20px_50px_rgba(0,0,0,0.45)]
              backdrop-blur-xl
              transition-all
              duration-500
              animate-[float_6s_ease-in-out_infinite]
              dark:bg-white/95
              lg:block
            "
          >
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
              Latest Journal
            </p>

            <div className="mt-2 flex items-center justify-between gap-3">
              <h4 className="text-sm font-semibold text-white dark:text-gray-900">
                GBPJPY Bias
              </h4>

              <span
                className="
                  rounded-md
                  bg-green-500/15
                  px-2
                  py-1
                  text-[10px]
                  font-semibold
                  text-green-400
                "
              >
                BUY
              </span>
            </div>
          </div>

          {/* Floating Card 3 — Achievement */}
          <div
            className="
              pointer-events-none
              absolute
              -left-6
              top-[570px]
              z-20
              hidden
              w-[205px]
              rounded-2xl
              border
              border-white/10
              bg-[#0B1220]/95
              p-5
              shadow-[0_20px_50px_rgba(0,0,0,0.45)]
              backdrop-blur-xl
              transition-all
              duration-500
              animate-[float_5s_ease-in-out_infinite]
              dark:bg-white/95
              lg:block
            "
          >
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
              Achievement
            </p>

            <h4 className="mt-2 text-sm font-semibold text-cyan-400">
              🔥 Consistency Streak
            </h4>

            <div className="mt-4 flex items-center gap-3">
              <div className="relative h-12 w-12">
                <svg
                  viewBox="0 0 36 36"
                  className="h-12 w-12 -rotate-90"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="rgba(148,163,184,0.18)"
                    strokeWidth="3"
                  />

                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="94.2"
                    strokeDashoffset="72.2"
                  />
                </svg>
              </div>

              <div>
                <p className="text-xl font-bold text-cyan-400">
                  7/30
                </p>

                <p className="text-[10px] text-gray-500">
                  Trading Streak
                </p>
              </div>
            </div>
          </div>

          {/* Floating Card 4 — Total P/L */}
          <div
            className="
              pointer-events-none
              absolute
              -right-8
              top-[600px]
              z-20
              hidden
              w-[140px]
              rounded-2xl
              border
              border-white/10
              bg-[#0B1220]/95
              p-5
              shadow-[0_20px_50px_rgba(0,0,0,0.45)]
              backdrop-blur-xl
              transition-all
              duration-500
              animate-[float_7s_ease-in-out_infinite]
              dark:bg-white/95
              lg:block
            "
          >
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
              Total P/L
            </p>

            <h4 className="mt-2 text-2xl font-bold text-green-400">
              +$4,850
            </h4>
          </div>

        </div>
      </div>
    </section>
  );
}