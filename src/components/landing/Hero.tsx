"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">

        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      </div>

      <div className="mx-auto max-w-7xl px-6 pt-20 pb-24">

        {/* Heading */}
        <div className="mx-auto max-w-4xl text-center">

          <span
            className="
              inline-flex
              items-center
              rounded-full
              border
              border-cyan-500/20
              bg-cyan-500/10
              px-4
              py-2
              text-sm
              font-medium
              text-cyan-600
              dark:text-cyan-400
            "
          >
            Built for disciplined traders
          </span>

          <h1
            className="
              mt-8
              text-5xl
              font-extrabold
              tracking-tight
              text-gray-900
              dark:text-white
              md:text-7xl
            "
          >
            Journal Every Trade.
            <br />
            Improve Every Decision.
          </h1>

          <p
            className="
              mx-auto
              mt-8
              max-w-2xl
              text-lg
              leading-8
              text-gray-600
              dark:text-gray-300
            "
          >
            Build consistency through intelligent trade journaling,
            emotional tracking, performance analytics and powerful
            insights—all beautifully organised in one workspace.
          </p>

          {/* Buttons */}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">

            <Link
              href="/signup"
              className="
                rounded-xl
                bg-cyan-500
                px-7
                py-4
                font-semibold
                text-white
                transition-all
                hover:bg-cyan-600
                hover:-translate-y-0.5
                hover:shadow-xl
                hover:shadow-cyan-500/20
              "
            >
              Get Started Free
            </Link>

            <Link
              href="/login"
              className="
                rounded-xl
                border
                border-gray-300
                dark:border-white/10
                bg-white/70
                dark:bg-white/5
                px-7
                py-4
                font-semibold
                text-gray-800
                dark:text-white
                backdrop-blur-xl
                transition-all
                hover:border-cyan-500
              "
            >
              Sign In
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}