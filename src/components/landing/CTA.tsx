"use client";

import { ArrowRight, Sparkles } from "lucide-react";

export default function FinalCTA() {
  return (
    <section
      id="cta"
      className="
        relative
        overflow-hidden
        bg-white
        dark:bg-[#020817]
        px-6
        py-32
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
          top-1/2
          h-[500px]
          w-[700px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-500/10
          blur-[150px]
        "
      />

      {/* Secondary glow */}
      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-1/2
          h-72
          w-72
          -translate-y-1/2
          rounded-full
          bg-cyan-400/5
          blur-[100px]
        "
      />

      <div className="relative mx-auto max-w-4xl text-center">

        {/* Badge */}
        <div
          className="
            mx-auto
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-cyan-400/20
            bg-cyan-400/5
            px-4
            py-2
            text-xs
            font-medium
            text-cyan-400
          "
        >
          <Sparkles className="h-3.5 w-3.5" />
          Start trading with purpose
        </div>

        {/* Heading */}
        <h2
          className="
            mt-7
            text-4xl
            font-bold
            leading-tight
            tracking-tight
            text-gray-900
            dark:text-white
            md:text-6xl
          "
        >
          Your next trade can be
          <span className="text-cyan-400"> your next lesson.</span>
        </h2>

        {/* Description */}
        <p
          className="
            mx-auto
            mt-6
            max-w-2xl
            text-base
            leading-7
            text-gray-600
            dark:text-gray-400
            md:text-lg
          "
        >
          Stop trading without understanding your decisions.
          Journal your trades, track your performance, and build
          the habits that lead to consistency.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

          {/* Primary CTA */}
          <a
            href="/signup"
            className="
              group
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-cyan-500
              px-7
              py-3.5
              text-sm
              font-semibold
              text-white
              shadow-[0_10px_40px_rgba(6,182,212,0.25)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-cyan-400
              hover:shadow-[0_15px_50px_rgba(6,182,212,0.35)]
            "
          >
            Get Started Free

            <ArrowRight
              className="
                h-4
                w-4
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </a>

          {/* Secondary CTA */}
          <a
            href="#features"
            className="
              inline-flex
              items-center
              justify-center
              rounded-xl
              border
              border-gray-200
              dark:border-white/10
              bg-gray-50
              dark:bg-white/[0.03]
              px-7
              py-3.5
              text-sm
              font-medium
              text-gray-700
              dark:text-gray-300
              backdrop-blur-xl
              transition-all
              duration-300
              hover:border-gray-300
              dark:hover:border-white/20
              hover:bg-gray-100
              dark:hover:bg-white/[0.06]
              hover:text-gray-900
              dark:hover:text-white
            "
          >
            Explore Features
          </a>

        </div>

        {/* Small reassurance */}
        <p className="mt-6 text-xs text-gray-500">
          Built for traders who want to trade, reflect, and improve.
        </p>

      </div>
    </section>
  );
}