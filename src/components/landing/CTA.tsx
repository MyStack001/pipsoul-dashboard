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
        px-4
        py-24
        sm:px-6
        sm:py-28
        md:py-32
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
          h-[320px]
          w-[320px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-500/10
          blur-[100px]
          sm:h-[420px]
          sm:w-[520px]
          sm:blur-[130px]
          md:h-[500px]
          md:w-[700px]
          md:blur-[150px]
        "
      />

      {/* Secondary glow */}
      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-1/2
          h-60
          w-60
          -translate-y-1/2
          rounded-full
          bg-cyan-400/5
          blur-[90px]
          sm:h-72
          sm:w-72
          sm:blur-[100px]
        "
      />

      <div
        className="
          relative
          mx-auto
          max-w-4xl
          text-center
        "
      >
        {/* Badge */}
        <div
          className="
            mx-auto
            inline-flex
            max-w-full
            items-center
            justify-center
            gap-2
            rounded-full
            border
            border-cyan-400/20
            bg-cyan-400/5
            px-3.5
            py-2
            text-[11px]
            font-medium
            text-cyan-400
            sm:px-4
            sm:text-xs
          "
        >
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          <span>Start trading with purpose</span>
        </div>

        {/* Heading */}
        <h2
          className="
            mt-6
            text-3xl
            font-bold
            leading-[1.15]
            tracking-tight
            text-gray-900
            dark:text-white
            sm:mt-7
            sm:text-4xl
            md:text-6xl
          "
        >
          Your next trade can be
          <span className="text-cyan-400">
            {" "}
            your next lesson.
          </span>
        </h2>

        {/* Description */}
        <p
          className="
            mx-auto
            mt-5
            max-w-xl
            text-sm
            leading-6
            text-gray-600
            dark:text-gray-400
            sm:mt-6
            sm:text-base
            sm:leading-7
            md:max-w-2xl
            md:text-lg
          "
        >
          Stop trading without understanding your decisions.
          Journal your trades, track your performance, and build
          the habits that lead to consistency.
        </p>

        {/* CTA Buttons */}
        <div
          className="
            mt-8
            flex
            w-full
            flex-col
            items-center
            justify-center
            gap-3
            sm:mt-10
            sm:flex-row
            sm:gap-4
          "
        >
          {/* Primary CTA */}
          <a
            href="/signup"
            className="
              group
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-cyan-500
              px-6
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
              sm:w-auto
              sm:px-7
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
              w-full
              items-center
              justify-center
              rounded-xl
              border
              border-gray-200
              dark:border-white/10
              bg-gray-50
              dark:bg-white/[0.03]
              px-6
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
              sm:w-auto
              sm:px-7
            "
          >
            Explore Features
          </a>
        </div>

        {/* Small reassurance */}
        <p
          className="
            mx-auto
            mt-5
            max-w-xs
            text-[11px]
            leading-5
            text-gray-500
            sm:mt-6
            sm:max-w-none
            sm:text-xs
          "
        >
          Built for traders who want to trade, reflect, and improve.
        </p>
      </div>
    </section>
  );
}