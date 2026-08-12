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
      className="
        relative
        overflow-hidden
        bg-white
        dark:bg-[#020817]
        px-4
        py-20
        transition-colors
        duration-500
        sm:px-6
        sm:py-24
      "
    >
      {/* Background glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-8
          h-[320px]
          w-[520px]
          -translate-x-1/2
          rounded-full
          bg-cyan-500/10
          blur-[120px]
          sm:top-10
          sm:h-[420px]
          sm:w-[720px]
          sm:blur-[150px]
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
          <span
            className="
              inline-flex
              items-center
              rounded-full
              border
              border-cyan-400/20
              bg-cyan-400/5
              px-3.5
              py-1.5
              text-xs
              font-medium
              text-cyan-400
              sm:px-4
              sm:py-2
            "
          >
            How it works
          </span>

          <h2
            className="
              mt-5
              text-3xl
              font-bold
              leading-tight
              tracking-tight
              text-gray-900
              sm:mt-6
              sm:text-4xl
              md:text-5xl
              dark:text-white
            "
          >
            Turn every trade into{" "}
            <span className="text-cyan-400">
              progress
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-2xl
              text-sm
              leading-6
              text-gray-600
              sm:mt-5
              sm:text-base
              sm:leading-7
              md:text-lg
              dark:text-gray-400
            "
          >
            Pipsoul gives you a simple workflow for recording your
            trades, understanding your decisions, and improving with
            every session.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-12 sm:mt-16 lg:mt-20">

          {/* Connecting line */}
          <div
            className="
              absolute
              left-[12.5%]
              right-[12.5%]
              top-10
              hidden
              h-px
              bg-gradient-to-r
              from-cyan-400/20
              via-gray-300
              to-green-400/20
              lg:block
              dark:via-white/10
            "
          />

          <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-full
                        border
                        bg-gray-50
                        dark:bg-[#08111F]
                        shadow-[0_0_30px_rgba(6,182,212,0.08)]
                        transition-all
                        duration-500
                        group-hover:scale-110
                        sm:h-20
                        sm:w-20
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
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className="
                      mt-5
                      rounded-3xl
                      border
                      border-gray-200
                      dark:border-white/10
                      bg-gray-50
                      dark:bg-[#0B1220]/80
                      p-6
                      text-center
                      backdrop-blur-xl
                      transition-all
                      duration-500
                      group-hover:-translate-y-2
                      group-hover:border-gray-300
                      dark:group-hover:border-white/20
                      group-hover:bg-white
                      dark:group-hover:bg-[#0F172A]
                      sm:mt-6
                      sm:p-7
                    "
                  >
                    <span
                      className={`
                        text-[11px]
                        font-semibold
                        tracking-[0.18em]
                        sm:text-xs
                        sm:tracking-[0.2em]
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

                    <h3
                      className="
                        mt-3
                        text-lg
                        font-semibold
                        text-gray-900
                        sm:mt-4
                        sm:text-xl
                        dark:text-white
                      "
                    >
                      {step.title}
                    </h3>

                    <p
                      className="
                        mt-2.5
                        text-sm
                        leading-6
                        text-gray-600
                        sm:mt-3
                        dark:text-gray-400
                      "
                    >
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
            mt-12
            text-center
            transition-all
            delay-500
            duration-1000
            sm:mt-16
            ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }
          `}
        >
          <p
            className="
              mx-auto
              max-w-xl
              text-sm
              leading-6
              text-gray-500
              sm:text-base
              sm:leading-7
              dark:text-gray-500
            "
          >
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