"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

type Profile = {
  name: string | null;
  trading_style: string | null;
  account_type: string | null;
  experience: string | null;
};

export default function ProfileHeader() {
  const { session, loading } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!session?.user) return;
    const userId = session.user.id;

    async function fetchProfile() {
      const { data } = await supabase
        .from("users")
        .select("name, trading_style, account_type, experience")
        .eq("id", userId)
        .single();

      if (data) {
        setProfile(data);
      }
    }

    fetchProfile();
  }, [session]);

  const initials = useMemo(() => {
    if (profile?.name?.trim()) {
      return profile.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }

    return session?.user.email?.charAt(0).toUpperCase() ?? "?";
  }, [profile, session]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl p-8">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl p-8">
      <div className="flex flex-col items-center text-center gap-5">

        <div className="w-24 h-24 rounded-full bg-cyan-500 flex items-center justify-center text-3xl font-bold text-white">
          {initials}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">
            {profile?.name?.trim() || "Complete your profile"}
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {session?.user.email}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">

            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-600 dark:text-cyan-400">
              {profile?.trading_style || "Intraday"}
            </span>

            <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-600 dark:text-green-400">
              {profile?.account_type || "Demo"}
            </span>

            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-sm text-purple-600 dark:text-purple-400">
              {profile?.experience || "Beginner"}
            </span>

          </div>
        </div>

      </div>
    </div>
  );
}