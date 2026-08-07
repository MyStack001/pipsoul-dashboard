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
  className="relative mx-auto max-w-7xl scroll-mt-24 px-6 pb-28"
>
      <div className="relative">
        <div
  className="
    absolute
    left-1/2
    top-24
    -z-10
    h-[380px]
    w-[620px]
    -translate-x-1/2
    rounded-full
    bg-cyan-400/20
    blur-[120px]
  "
/>

        {/* Browser Window */}
        <div
          className="
  overflow-hidden
  rounded-[32px]
  border
  border-gray-200
  dark:border-white/10
  bg-white
  dark:bg-[#111827]
  shadow-2xl
  transition-all
  duration-500
  hover:-translate-y-2
  hover:shadow-[0_30px_80px_rgba(6,182,212,0.18)]
"
        >

          {/* Browser Header */}
          <div
            className="
              flex
              items-center
              gap-2
              border-b
              border-gray-200
              dark:border-white/10
              bg-gray-50
              dark:bg-[#0F172A]
              px-6
              py-4
            "
          >
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />

            <div
              className="
                ml-5
                rounded-lg
                bg-white
                dark:bg-[#111827]
                px-4
                py-2
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              app.pipsoul.com/dashboard
            </div>
          </div>

          {/* Placeholder */}
          <div
            className="
  flex
  h-[900px]
  items-start
  justify-center
  bg-gradient-to-br
  from-[#08111F]
  to-[#0F172A]
"
          >
           <div className="flex h-full w-full">

            {/* Sidebar */}
<div
  className="
    hidden
    w-64
    border-r
    border-white/10
    bg-[#08111F]
    lg:flex
    flex-col
    justify-between
    p-6
  "
>

  <div>

    <h2 className="text-2xl font-bold text-white">
      Pipsoul
    </h2>

    <p className="mt-1 text-xs text-cyan-400">
      Trade. Reflect. Improve.
    </p>

    <div className="mt-10 space-y-3">

      <div className="rounded-xl bg-cyan-500 px-4 py-3 font-medium text-white">
        Dashboard
      </div>

      <div className="rounded-xl px-4 py-3 text-gray-400">
        Trades
      </div>

      <div className="rounded-xl px-4 py-3 text-gray-400">
        Journal
      </div>

      <div className="rounded-xl px-4 py-3 text-gray-400">
        Analytics
      </div>

      <div className="rounded-xl px-4 py-3 text-gray-400">
        Achievements
      </div>

      <div className="rounded-xl px-4 py-3 text-gray-400">
        Profile
      </div>

    </div>

  </div>

  <div className="rounded-2xl bg-[#0F172A] p-4">
    <p className="text-sm text-gray-400">
      Trading Streak
    </p>

    <h3 className="mt-2 text-3xl font-bold text-cyan-400">
      14 Days
    </h3>
  </div>

</div>

<div className="flex-1 bg-[#08111F] p-8">

  {/* Greeting */}
  <div className="mb-8">
    <h3 className="text-3xl font-bold text-white">
  Good afternoon, Trader 👋
</h3>

<p className="mt-2 text-gray-400">
  Ready to conquer the markets today?
</p>
  </div>

  {/* Preview Stat Cards */}
  <div className="grid grid-cols-2 gap-5 md:grid-cols-4">

    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0F172A] p-5 backdrop-blur-xl
    animate-[fadeUp_0.7s_ease-out_0.1s_both]">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Total Profit
      </p>

      <h4 className="mt-2 text-2xl font-bold text-green-500">
        +$4,850
      </h4>
    </div>

    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0F172A] p-5 backdrop-blur-xl
    animate-[fadeUp_0.7s_ease-out_0.2s_both]">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Win Rate
      </p>

      <h4 className="mt-2 text-2xl font-bold text-cyan-500">
        86%
      </h4>
    </div>

    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0F172A] p-5 backdrop-blur-xl
    animate-[fadeUp_0.7s_ease-out_0.3s_both]">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Total Trades
      </p>

      <h4 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
        128
      </h4>
    </div>

    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0F172A] p-5 backdrop-blur-xl
    animate-[fadeUp_0.7s_ease-out_0.4s_both]">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Drawdown
      </p>

      <h4 className="mt-2 text-2xl font-bold text-red-500">
        -4.2%
      </h4>
    </div>

  </div>

  {/* Placeholder for Equity Chart */}
  {/* Equity Curve Card */}
<div
  className="
  mt-8
  h-56
  overflow-hidden
  rounded-3xl
  border
  border-white/10
  bg-[#0F172A]
  shadow-[0_20px_60px_rgba(0,0,0,0.25)]
"
>
  {/* Chart Header */}
  <div className="flex items-center justify-between px-6 pt-5">
    <div>
      <p className="text-sm text-gray-400">
  Equity Curve
</p>

<p className="mt-1 text-lg font-semibold text-white">
  Account Growth
</p>
    </div>

    <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
      +18.4%
    </span>
  </div>

  {/* Chart */}
  <div className="relative mt-3 h-[150px] w-full overflow-hidden">
    
    {/* Grid */}
<div className="absolute inset-0 opacity-25 dark:opacity-30">
  <div
    className="
      h-full
      w-full
      bg-[linear-gradient(to_right,#94a3b8_1px,transparent_1px),linear-gradient(to_bottom,#94a3b8_1px,transparent_1px)]
      bg-[size:70px_50px]
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

      {/* Green highlight */}
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
    transition: "stroke-dashoffset 1.2s ease-out 1s",
  }}
/>
    </svg>

  </div>
</div>

{/* Recent Trades */}
<div
  className="
    relative
    mt-8
    max-w-2xl
    overflow-hidden
    rounded-[28px]
    border
    border-white/10
    bg-[#0F172A]
    shadow-[0_30px_80px_rgba(0,0,0,0.45)]
  "
>
  {/* Header */}
  <div
    className="
      border-b
      border-white/10
      px-6
      py-4
    "
  >
    <h4 className="text-base font-semibold text-white">
      Recent Trades
    </h4>
  </div>

  {/* Trades */}
  <div className="divide-y divide-white/10">

    {/* Trade 1 */}
    <div
      className="
        grid
        grid-cols-3
        items-center
        px-6
        py-4
      "
    >
      {/* Pair */}
      <div className="text-left">
        <p className="font-semibold text-white">
          GBPJPY
        </p>

        <p className="mt-1 text-sm text-gray-400">
          London Session
        </p>
      </div>

      {/* BUY */}
      <div className="flex justify-center">
        <span
          className="
            rounded-lg
            bg-green-500/15
            px-3
            py-1
            text-xs
            font-semibold
            text-green-400
            animate-[softPulse_2.5s_ease-in-out_infinite]
          "
        >
          BUY
        </span>
      </div>

      {/* P/L */}
      <p className="text-right font-semibold text-green-400">
        +$120
      </p>
    </div>


    {/* Trade 2 */}
    <div
      className="
        grid
        grid-cols-3
        items-center
        px-6
        py-4
      "
    >
      {/* Pair */}
      <div className="text-left">
        <p className="font-semibold text-white">
          XAUUSD
        </p>

        <p className="mt-1 text-sm text-gray-400">
          New York
        </p>
      </div>

      {/* SELL */}
      <div className="flex justify-center">
        <span
          className="
            rounded-lg
            bg-red-500/15
            px-3
            py-1
            text-xs
            font-semibold
            text-red-400
            animate-[softPulse_2.5s_ease-in-out_infinite]
          "
        >
          SELL
        </span>
      </div>

      {/* P/L */}
      <p className="text-right font-semibold text-red-400">
        -$48
      </p>
    </div>


    {/* Trade 3 */}
    <div
      className="
        grid
        grid-cols-3
        items-center
        px-6
        py-4
      "
    >
      {/* Pair */}
      <div className="text-left">
        <p className="font-semibold text-white">
          EURUSD
        </p>

        <p className="mt-1 text-sm text-gray-400">
          London Session
        </p>
      </div>

      {/* BUY */}
      <div className="flex justify-center">
        <span
          className="
            rounded-lg
            bg-green-500/15
            px-3
            py-1
            text-xs
            font-semibold
            text-green-400
            animate-[softPulse_2.5s_ease-in-out_infinite]
          "
        >
          BUY
        </span>
      </div>

      {/* P/L */}
      <p className="text-right font-semibold text-green-400">
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
    lg:block
  "
>
  <p className="text-xs font-medium text-gray-400">
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
    lg:block
  "
>
  <p className="text-xs font-medium text-gray-400">
    Latest Journal
  </p>

  <div className="mt-2 flex items-center justify-between gap-3">
    <h4 className="text-sm font-semibold text-white">
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
    lg:block
  "
>
  <p className="text-xs font-medium text-gray-400">
    Achievement
  </p>

  <h4 className="mt-2 text-sm font-semibold text-cyan-400">
    🔥 Consistency Streak
  </h4>

  <div className="mt-4 flex items-center gap-3">

    {/* Progress Ring */}
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
    lg:block
  "
>
  <p className="text-xs font-medium text-gray-400">
    Total P/L
  </p>

  <h4 className="mt-2 text-2xl font-bold text-green-400">
    +$4,850
  </h4>
</div>

      </div>
    </section>
  );
}