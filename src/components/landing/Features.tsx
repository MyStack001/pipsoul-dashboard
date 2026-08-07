"use client";

import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Brain,
  Bell,
  Trophy,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description:
      "Track your profit, win rate, drawdown, and account growth so you always know where you stand.",
    accent: "cyan",
  },
  {
    icon: BookOpen,
    title: "Trade Journal",
    description:
      "Record the setup, reasoning, execution, and outcome behind every trade in one organized journal.",
    accent: "green",
  },
  {
    icon: Brain,
    title: "Trading Psychology",
    description:
      "Capture your emotions and mindset before and after each trade to understand how they affect your decisions.",
    accent: "purple",
  },
  {
    icon: TrendingUp,
    title: "Advanced Analytics",
    description:
      "Turn your trading history into meaningful insights and discover patterns in your performance.",
    accent: "cyan",
  },
  {
    icon: Trophy,
    title: "Achievements",
    description:
      "Build consistency through milestones that recognize your progress as a trader.",
    accent: "yellow",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Stay aware of important trading activity without constantly checking your journal.",
    accent: "green",
  },
];

export default function Features() {
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
      id="features"
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
            max-w-2xl
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
            Everything in one place
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Everything you need to{" "}
            <span className="text-cyan-400">
              trade smarter
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-400 md:text-lg">
            Pipsoul brings your trading performance, journal, psychology,
            and progress into one focused workspace.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  border-white/10
                  bg-[#0B1220]/80
                  p-7
                  backdrop-blur-xl
                  transition-all
                  duration-700
                  hover:-translate-y-2
                  hover:border-white/20
                  hover:bg-[#0F172A]
                  ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }
                `}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {/* Hover glow */}
                <div
                  className={`
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-40
                    w-40
                    rounded-full
                    blur-[70px]
                    transition-opacity
                    duration-500
                    opacity-0
                    group-hover:opacity-100
                    ${
                      feature.accent === "cyan"
                        ? "bg-cyan-400/20"
                        : feature.accent === "green"
                        ? "bg-green-400/20"
                        : feature.accent === "purple"
                        ? "bg-purple-400/20"
                        : "bg-yellow-400/20"
                    }
                  `}
                />

                {/* Icon */}
                <div
                  className={`
                    relative
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    transition-transform
                    duration-500
                    group-hover:scale-110
                    ${
                      feature.accent === "cyan"
                        ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-400"
                        : feature.accent === "green"
                        ? "border-green-400/20 bg-green-400/10 text-green-400"
                        : feature.accent === "purple"
                        ? "border-purple-400/20 bg-purple-400/10 text-purple-400"
                        : "border-yellow-400/20 bg-yellow-400/10 text-yellow-400"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="relative mt-6">
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom accent */}
                <div
                  className={`
                    absolute
                    bottom-0
                    left-7
                    right-7
                    h-px
                    opacity-0
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                    ${
                      feature.accent === "cyan"
                        ? "bg-cyan-400/50"
                        : feature.accent === "green"
                        ? "bg-green-400/50"
                        : feature.accent === "purple"
                        ? "bg-purple-400/50"
                        : "bg-yellow-400/50"
                    }
                  `}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}