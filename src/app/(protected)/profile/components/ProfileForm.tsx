"use client";

import { useEffect, useState,
  type Dispatch,
  type SetStateAction,
 } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import type { Profile } from "../page";

type ProfileFormProps = {
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile | null>>;
};

export default function ProfileForm({
  profile,
  setProfile,
}: ProfileFormProps) {
  const { session } = useAuth();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [tradingStyle, setTradingStyle] = useState("Intraday");
  const [accountType, setAccountType] = useState("Demo");
  const [experience, setExperience] = useState("Beginner");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
  setName(profile.name || "");
  setBio(profile.bio || "");
  setTradingStyle(profile.trading_style || "Intraday");
  setAccountType(profile.account_type || "Demo");
  setExperience(profile.experience || "Beginner");
}, [profile]);

  async function saveProfile() {
  if (!session?.user) return;

  console.log({
    name,
    bio,
    tradingStyle,
    accountType,
    experience,
  });

  setSaving(true);

  const { error } = await supabase
    .from("users")
    .update({
      name,
      bio,
      trading_style: tradingStyle,
      account_type: accountType,
      experience,
    })
    .eq("id", session.user.id);

  setSaving(false);

  if (error) {
    console.error(error);
    alert(error.message);
  } else {
  setProfile({
    ...profile,
    name,
    bio,
    trading_style: tradingStyle,
    account_type: accountType,
    experience,
  });

  alert("Profile updated successfully!");
}
}

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl p-8 space-y-6">

      <h2 className="text-2xl font-bold">
        Personal Information
      </h2>

      <input
        className="w-full rounded-xl border p-3 bg-white dark:bg-gray-900"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select
        className="w-full rounded-xl border p-3 bg-white dark:bg-gray-900"
        value={tradingStyle}
        onChange={(e) => setTradingStyle(e.target.value)}
      >
        <option>Scalping</option>
        <option>Intraday</option>
        <option>Swing</option>
        <option>Position</option>
      </select>

      <select
        className="w-full rounded-xl border p-3 bg-white dark:bg-gray-900"
        value={accountType}
        onChange={(e) => setAccountType(e.target.value)}
      >
        <option>Demo</option>
        <option>Live</option>
        <option>Prop Firm</option>
      </select>

      <select
        className="w-full rounded-xl border p-3 bg-white dark:bg-gray-900"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
      >
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>

      <textarea
        rows={5}
        className="w-full rounded-xl border p-3 bg-white dark:bg-gray-900"
        placeholder="Tell us about yourself..."
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      <button
        onClick={saveProfile}
        disabled={saving}
        className="rounded-xl bg-cyan-500 px-6 py-3 text-white font-semibold hover:bg-cyan-600 transition"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

    </div>
  );
}