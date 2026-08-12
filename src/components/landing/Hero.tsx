"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">

        <div
          className="
            absolute
            top-20
            left-10
            h-48
            w-48
            sm:h-72
            sm:w-72
            rounded-full
            bg-cyan-500/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            right-0
            top-40
            h-64
            w-64
            sm:h-96
            sm:w-96
            rounded-full
            bg-blue-500/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            bottom-0
            left-1/2
            h-64
            w-64
            sm:h-80
            sm:w-80
            -translate-x-1/2
            rounded-full
            bg-cyan-400/10
            blur-3xl
          "
        />

      </div>

      <div
        className="
          mx-auto
          max-w-7xl
          px-4
          sm:px-6
          pt-14
          sm:pt-20
          pb-16
          sm:pb-24
        "
      >

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
              px-3
              sm:px-4
              py-1.5
              sm:py-2
              text-xs
              sm:text-sm
              font-medium
              text-cyan-600
              dark:text-cyan-400
            "
          >
            Built for disciplined traders
          </span>

          <h1
            className="
              mt-6
              sm:mt-8
              text-4xl
              sm:text-5xl
              font-extrabold
              tracking-tight
              leading-[1.1]
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
              mt-6
              sm:mt-8
              max-w-2xl
              text-base
              sm:text-lg
              leading-7
              sm:leading-8
              text-gray-600
              dark:text-gray-300
            "
          >
            Build consistency through intelligent trade journaling,
            emotional tracking, performance analytics and powerful
            insights—all beautifully organised in one workspace.
          </p>

          {/* Buttons */}
          <div
            className="
              mt-8
              sm:mt-10
              flex
              flex-col
              sm:flex-row
              items-center
              justify-center
              gap-3
              sm:gap-4
            "
          >

            <Link
              href="/signup"
              className="
                w-full
                sm:w-auto
                rounded-xl
                bg-cyan-500
                px-7
                py-3.5
                sm:py-4
                text-center
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
                w-full
                sm:w-auto
                rounded-xl
                border
                border-gray-300
                dark:border-white/10
                bg-white/70
                dark:bg-white/5
                px-7
                py-3.5
                sm:py-4
                text-center
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