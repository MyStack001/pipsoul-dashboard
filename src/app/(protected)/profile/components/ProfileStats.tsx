"use client";

import type { Profile } from "../page";

type ProfileStatsProps = {
  profile: Profile;
};

export default function ProfileStats({
  profile,
}: ProfileStatsProps) {
  return (
    <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl p-8">

      <h2 className="text-xl font-semibold text-black dark:text-white">
        Profile Summary
      </h2>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="rounded-xl bg-gray-100 dark:bg-white/5 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Style</p>
          <h3 className="text-lg font-bold text-black dark:text-white">
            {profile.trading_style || "Intraday"}
          </h3>
        </div>

        <div className="rounded-xl bg-gray-100 dark:bg-white/5 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Account</p>
          <h3 className="text-lg font-bold text-black dark:text-white">
            {profile.account_type || "Demo"}
          </h3>
        </div>

        <div className="rounded-xl bg-gray-100 dark:bg-white/5 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
          <h3 className="text-lg font-bold text-black dark:text-white">
            {profile.experience || "Beginner"}
          </h3>
        </div>

        <div className="rounded-xl bg-gray-100 dark:bg-white/5 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Bio</p>
          <h3 className="text-lg font-bold text-black dark:text-white">
            {profile.bio || "No bio yet"}
          </h3>
        </div>

      </div>

    </div>
  );
}