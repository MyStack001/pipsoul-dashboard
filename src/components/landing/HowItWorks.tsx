"use client";

import { useEffect, useRef, useState } from "react";
import {
  PlusCircle,
  BookOpen,
  BarChart3,
  TrendingUp,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: PlusCircle,
    title: "Add your trade",
    description:
      "Record the pair, direction, entry, exit, risk, and result so every trade has a clear history.",
    accent: "cyan",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Journal the decision",
    description:
      "Capture your setup, reasoning, emotions, and execution while the experience is still fresh.",
    accent: "purple",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Analyze your performance",
    description:
      "Review your results, patterns, win rate, drawdown, and other insights across your trading history.",
    accent: "green",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Improve over time",
    description:
      "Use what you learn to build better habits, make more intentional decisions, and trade with greater consistency.",
    accent: "yellow",
  },
];

export default function HowItWorks() {
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
      id="how-it-works"
      className="relative overflow-hidden bg-[#020817] px-6 py-28"
    >
      {/* Background glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-10
          h-[420px]
          w-[720px]
          -translate-x-1/2
          rounded-full
          bg-cyan-500/10
          blur-[150px]
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
            How it works
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Turn every trade into{" "}
            <span className="text-cyan-400">
              progress
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 md:text-lg">
            Pipsoul gives you a simple workflow for recording your
            trades, understanding your decisions, and improving with
            every session.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-20">

          {/* Connecting line */}
          <div className="absolute left-[12.5%] right-[12.5%] top-10 hidden h-px bg-gradient-to-r from-cyan-400/20 via-white/10 to-green-400/20 lg:block" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className={`
                    group
                    relative
                    transition-all
                    duration-700
                    ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                    }
                  `}
                  style={{
                    transitionDelay: `${index * 120}ms`,
                  }}
                >
                  {/* Step number / icon */}
                  <div className="relative z-10 flex justify-center">
                    <div
                      className={`
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-full
                        border
                        bg-[#08111F]
                        shadow-[0_0_30px_rgba(6,182,212,0.08)]
                        transition-all
                        duration-500
                        group-hover:scale-110
                        ${
                          step.accent === "cyan"
                            ? "border-cyan-400/30 text-cyan-400 group-hover:border-cyan-400/60 group-hover:shadow-[0_0_35px_rgba(6,182,212,0.18)]"
                            : step.accent === "purple"
                            ? "border-purple-400/30 text-purple-400 group-hover:border-purple-400/60"
                            : step.accent === "green"
                            ? "border-green-400/30 text-green-400 group-hover:border-green-400/60"
                            : "border-yellow-400/30 text-yellow-400 group-hover:border-yellow-400/60"
                        }
                      `}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className="
                      mt-6
                      rounded-3xl
                      border
                      border-white/10
                      bg-[#0B1220]/80
                      p-7
                      text-center
                      backdrop-blur-xl
                      transition-all
                      duration-500
                      group-hover:-translate-y-2
                      group-hover:border-white/20
                      group-hover:bg-[#0F172A]
                    "
                  >
                    <span
                      className={`
                        text-xs
                        font-semibold
                        tracking-[0.2em]
                        ${
                          step.accent === "cyan"
                            ? "text-cyan-400"
                            : step.accent === "purple"
                            ? "text-purple-400"
                            : step.accent === "green"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }
                      `}
                    >
                      STEP {step.number}
                    </span>

                    <h3 className="mt-4 text-xl font-semibold text-white">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom statement */}
        <div
          className={`
            mt-16
            text-center
            transition-all
            delay-500
            duration-1000
            ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }
          `}
        >
          <p className="text-sm text-gray-500 md:text-base">
            One trade at a time. One insight at a time.{" "}
            <span className="text-cyan-400">
              Better trading starts with better reflection.
            </span>
          </p>
        </div>

      </div>
    </section>
  );
}