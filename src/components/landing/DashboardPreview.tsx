"use client";

export default function DashboardPreview() {
  return (
    <section
      id="preview"
      className="relative mx-auto max-w-7xl px-6 pb-28"
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
              h-[520px]
              items-center
              justify-center
              bg-gradient-to-br
              from-cyan-50
              to-white
              dark:from-[#0B1120]
              dark:to-[#111827]
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

<div className="flex-1 p-8">

  {/* Greeting */}
  <div className="mb-8">
    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
      Good afternoon, Trader 👋
    </h3>

    <p className="mt-2 text-gray-500 dark:text-gray-400">
      Ready to conquer the markets today?
    </p>
  </div>

  {/* Preview Stat Cards */}
  <div className="grid grid-cols-2 gap-5 md:grid-cols-4">

    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0F172A] p-5 backdrop-blur-xl">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Total Profit
      </p>

      <h4 className="mt-2 text-2xl font-bold text-green-500">
        +$4,850
      </h4>
    </div>

    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0F172A] p-5 backdrop-blur-xl">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Win Rate
      </p>

      <h4 className="mt-2 text-2xl font-bold text-cyan-500">
        86%
      </h4>
    </div>

    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0F172A] p-5 backdrop-blur-xl">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Total Trades
      </p>

      <h4 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
        128
      </h4>
    </div>

    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0F172A] p-5 backdrop-blur-xl">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Drawdown
      </p>

      <h4 className="mt-2 text-2xl font-bold text-red-500">
        -4.2%
      </h4>
    </div>

  </div>

  {/* Placeholder for Equity Chart */}
  <div className="mt-8 h-64 rounded-3xl border border-dashed border-cyan-300/40 dark:border-cyan-500/20 bg-white/60 dark:bg-[#0F172A]/70 backdrop-blur-xl flex items-center justify-center">

    <div className="relative h-full w-full overflow-hidden rounded-3xl">

  {/* Grid */}
  <div className="absolute inset-0 opacity-15">
    <div className="h-full w-full bg-[linear-gradient(to_right,#64748b22_1px,transparent_1px),linear-gradient(to_bottom,#64748b22_1px,transparent_1px)] bg-[size:70px_70px]" />
  </div>

  {/* Equity Line */}
  <svg
    viewBox="0 0 1000 250"
    className="absolute inset-0 h-full w-full"
    preserveAspectRatio="none"
  >
    <path
      d="M0 180
         C80 150,120 120,180 130
         S300 180,380 140
         S500 110,560 120
         S680 80,760 60
         S860 120,920 90
         S980 70,1000 40"
      fill="none"
      stroke="#06b6d4"
      strokeWidth="4"
      strokeLinecap="round"
    />

    <path
      d="M0 185
         C80 155,120 125,180 135
         S300 185,380 145
         S500 115,560 125
         S680 85,760 65
         S860 125,920 95
         S980 75,1000 45"
      fill="none"
      stroke="#22c55e"
      strokeOpacity="0.35"
      strokeWidth="10"
      strokeLinecap="round"
    />
  </svg>

</div>
</div>

{/* Recent Trades */}
<div
  className="
  mt-8
  max-w-3xl
    relative
    overflow-hidden
    rounded-[32px]
    border
    border-gray-200
    dark:border-white/10
    bg-white
    dark:bg-[#111827]
    shadow-[0_40px_120px_rgba(2,6,23,0.18)]
    dark:shadow-[0_50px_120px_rgba(0,0,0,0.65)]
    transition-transform
    duration-500
    hover:-translate-y-2
  "
>

  <div className="border-b border-gray-200 dark:border-white/10 px-6 py-4">
    <h4 className="font-semibold text-gray-900 dark:text-white">
      Recent Trades
    </h4>
  </div>

  <div className="divide-y divide-gray-200 dark:divide-white/10">

    <div className="flex items-center justify-between px-6 py-4">
      <div>
        <p className="font-semibold text-gray-900 dark:text-white">
          GBPJPY
        </p>
        <p className="text-sm text-gray-500">
          London Session
        </p>
      </div>

      <span className="rounded-full bg-green-500/15 px-3 py-1 text-sm font-medium text-green-500">
        BUY
      </span>

      <p className="font-semibold text-green-500">
        +$120
      </p>
    </div>

    <div className="flex items-center justify-between px-6 py-4">
      <div>
        <p className="font-semibold text-gray-900 dark:text-white">
          XAUUSD
        </p>
        <p className="text-sm text-gray-500">
          New York
        </p>
      </div>

      <span className="rounded-full bg-red-500/15 px-3 py-1 text-sm font-medium text-red-500">
        SELL
      </span>

      <p className="font-semibold text-red-500">
        -$48
      </p>
    </div>

    <div className="flex items-center justify-between px-6 py-4">
      <div>
        <p className="font-semibold text-gray-900 dark:text-white">
          EURUSD
        </p>
        <p className="text-sm text-gray-500">
          London Session
        </p>
      </div>

      <span className="rounded-full bg-green-500/15 px-3 py-1 text-sm font-medium text-green-500">
        BUY
      </span>

      <p className="font-semibold text-green-500">
        +$86
      </p>
    </div>

  </div>

</div>
</div>
 </div>
</div>
</div>

        {/* Floating Card 1 */}
        <div
          className="
            absolute
            -left-6
            top-12
            hidden
            rounded-2xl
            border
            border-gray-200
            dark:border-white/10
            bg-white/90
            dark:bg-[#111827]/90
            p-5
            shadow-xl
            backdrop-blur-xl
            transition-all
            duration-500
            hover:-translate-y-2
            hover:shadow-2xl
            lg:block
          "
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Win Rate
          </p>

          <h4 className="mt-2 text-3xl font-bold text-green-500">
            86%
          </h4>
        </div>

        {/* Floating Card 2 */}
        <div
          className="
            absolute
            -right-6
            top-24
            hidden
            rounded-2xl
            border
            border-gray-200
            dark:border-white/10
            bg-white/90
            dark:bg-[#111827]/90
            p-5
            shadow-xl
            backdrop-blur-xl
            transition-all
            duration-500
            hover:-translate-y-2
            hover:shadow-2xl
            lg:block
          "
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Latest Journal
          </p>

          <h4 className="mt-2 font-bold text-gray-900 dark:text-white">
            GBPJPY BUY
          </h4>
        </div>

        {/* Floating Card 3 */}
        <div
          className="
            absolute
            bottom-10
            -left-10
            hidden
            rounded-2xl
            border
            border-gray-200
            dark:border-white/10
            bg-white/90
            dark:bg-[#111827]/90
            p-5
            shadow-xl
            backdrop-blur-xl
            transition-all
            duration-500
            hover:-translate-y-2
            hover:shadow-2xl
            lg:block
          "
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Achievement
          </p>

          <h4 className="mt-2 font-bold text-cyan-500">
            🔥 Consistency Streak
          </h4>
        </div>

        {/* Floating Card 4 */}
        <div
          className="
            absolute
            bottom-6
            -right-8
            hidden
            rounded-2xl
            border
            border-gray-200
            dark:border-white/10
            bg-white/90
            dark:bg-[#111827]/90
            p-5
            shadow-xl
            backdrop-blur-xl
            transition-all
            duration-500
            hover:-translate-y-2
            hover:shadow-2xl
            lg:block
          "
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total P/L
          </p>

          <h4 className="mt-2 text-2xl font-bold text-green-500">
            +$4,850
          </h4>
        </div>

      </div>
    </section>
  );
}