"use client";

import type { Profile } from "../page";

type ProfileStatsProps = {
  profile: Profile;
};

export default function ProfileStats({
  profile,
}: ProfileStatsProps) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-gray-200
        bg-white/70
        p-5
        backdrop-blur-xl
        dark:border-white/10
        dark:bg-white/5
        sm:p-8
      "
    >
      <h2
        className="
          text-xl
          font-semibold
          text-black
          dark:text-white
        "
      >
        Profile Summary
      </h2>

      <div
        className="
          mt-5
          grid
          grid-cols-2
          gap-3
          sm:mt-6
          sm:gap-4
          md:grid-cols-4
        "
      >
        <div
          className="
            min-w-0
            rounded-xl
            bg-gray-100
            p-3
            dark:bg-white/5
            sm:p-4
          "
        >
          <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            Style
          </p>

          <h3
            className="
              mt-1
              break-words
              text-sm
              font-bold
              text-black
              dark:text-white
              sm:text-lg
            "
          >
            {profile.trading_style ||
              "Intraday"}
          </h3>
        </div>

        <div
          className="
            min-w-0
            rounded-xl
            bg-gray-100
            p-3
            dark:bg-white/5
            sm:p-4
          "
        >
          <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            Account
          </p>

          <h3
            className="
              mt-1
              break-words
              text-sm
              font-bold
              text-black
              dark:text-white
              sm:text-lg
            "
          >
            {profile.account_type ||
              "Demo"}
          </h3>
        </div>

        <div
          className="
            min-w-0
            rounded-xl
            bg-gray-100
            p-3
            dark:bg-white/5
            sm:p-4
          "
        >
          <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            Experience
          </p>

          <h3
            className="
              mt-1
              break-words
              text-sm
              font-bold
              text-black
              dark:text-white
              sm:text-lg
            "
          >
            {profile.experience ||
              "Beginner"}
          </h3>
        </div>

        <div
          className="
            min-w-0
            rounded-xl
            bg-gray-100
            p-3
            dark:bg-white/5
            sm:p-4
          "
        >
          <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            Strategy
          </p>

          <h3
            className="
              mt-1
              break-words
              text-sm
              font-bold
              text-black
              dark:text-white
              sm:text-lg
            "
          >
            {profile.strategy ||
              "No strategy yet"}
          </h3>
        </div>
      </div>
    </div>
  );
}