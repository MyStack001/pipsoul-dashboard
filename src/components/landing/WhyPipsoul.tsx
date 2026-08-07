"use client";

import { useEffect, useRef, useState } from "react";

export default function WhyPipsoul() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-pipsoul"
      className="relative overflow-hidden bg-[#020817] px-6 py-28"
    >
      {/* Background glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-20
          h-[420px]
          w-[700px]
          -translate-x-1/2
          rounded-full
          bg-cyan-500/10
          blur-[140px]
        "
      />

      <div className="relative mx-auto max-w-7xl">

        {/* Section Header */}
        <div
          className={`
            mx-auto
            max-w-3xl
            text-center
            transition-all
            duration-1000
            ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }
          `}
        >
          <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs font-medium text-cyan-400">
            Why Pipsoul
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Trading is more than{" "}
            <span className="text-cyan-400">
              numbers
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 md:text-lg">
            A winning trade doesn't always mean a good decision.
            Pipsoul helps you understand the decisions behind your
            trades so you can build better habits and become a more
            consistent trader.
          </p>
        </div>

        {/* Main Message */}
<div
  className={`
    mx-auto
    mt-20
    max-w-5xl
    transition-all
    delay-200
    duration-1000
    ${
      isVisible
        ? "translate-y-0 opacity-100"
        : "translate-y-10 opacity-0"
    }
  `}
>
  {/* Three Pillars */}
  <div className="grid gap-5 md:grid-cols-3">

    {/* Trade */}
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B1220]/80 p-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/20">
      <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-cyan-400/10 blur-[60px] transition-opacity duration-500 group-hover:bg-cyan-400/20" />

      <div className="relative">
        <span className="text-sm font-medium text-cyan-400">
          01
        </span>

        <h3 className="mt-4 text-2xl font-semibold text-white">
          Trade
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-400">
          Make informed decisions and keep every trade organized
          in one place.
        </p>
      </div>
    </div>

    {/* Reflect */}
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B1220]/80 p-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-purple-400/20">
      <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-purple-400/10 blur-[60px] transition-opacity duration-500 group-hover:bg-purple-400/20" />

      <div className="relative">
        <span className="text-sm font-medium text-purple-400">
          02
        </span>

        <h3 className="mt-4 text-2xl font-semibold text-white">
          Reflect
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-400">
          Understand your decisions, emotions, and habits behind
          every trade.
        </p>
      </div>
    </div>

    {/* Improve */}
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B1220]/80 p-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-green-400/20">
      <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-green-400/10 blur-[60px] transition-opacity duration-500 group-hover:bg-green-400/20" />

      <div className="relative">
        <span className="text-sm font-medium text-green-400">
          03
        </span>

        <h3 className="mt-4 text-2xl font-semibold text-white">
          Improve
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-400">
          Turn your trading history into insights that help you
          build better habits.
        </p>
      </div>
    </div>

  </div>

  {/* Closing statement */}
  <div className="mt-12 text-center">
    <p className="text-sm leading-6 text-gray-500 md:text-base">
      Because consistent trading starts with understanding
      yourself, not just the market.
    </p>
  </div>
</div>
</div>
    </section>
  );
}