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

      <h2 className="text-xl font-semibold">
        Trading Summary
      </h2>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="rounded-xl bg-gray-100 dark:bg-white/5 p-4">
          <p className="text-sm text-gray-500">Style</p>
          <h3 className="text-lg font-bold">
            {profile.trading_style || "Intraday"}
          </h3>
        </div>

        <div className="rounded-xl bg-gray-100 dark:bg-white/5 p-4">
          <p className="text-sm text-gray-500">Account</p>
          <h3 className="text-lg font-bold">
            {profile.account_type || "Demo"}
          </h3>
        </div>

        <div className="rounded-xl bg-gray-100 dark:bg-white/5 p-4">
          <p className="text-sm text-gray-500">Experience</p>
          <h3 className="text-lg font-bold">
            {profile.experience || "Beginner"}
          </h3>
        </div>

        <div className="rounded-xl bg-gray-100 dark:bg-white/5 p-4">
          <p className="text-sm text-gray-500">Bio</p>
          <h3 className="text-lg font-bold truncate">
            {profile.bio || "No bio yet"}
          </h3>
        </div>

      </div>

    </div>
  );
}