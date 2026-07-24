"use client";

import { useEffect, useState,
  type Dispatch,
  type SetStateAction,
 } from "react";
 import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import type { Profile } from "../page";
import CustomSelect from "@/components/ui/CustomSelect";


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

    toast.error(error.message);
  } else {
  setProfile({
    ...profile,
    name,
    bio,
    trading_style: tradingStyle,
    account_type: accountType,
    experience,
  });

  toast.success("Profile updated successfully!");
}
}

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl p-8 space-y-8">

      <div className="space-y-2">
  <h2 className="text-2xl font-bold text-black dark:text-white">
    Personal Information
  </h2>

  <p className="text-sm text-gray-500 dark:text-gray-400">
    Manage how your trading profile appears across Pipsoul.
  </p>
</div>

     <div className="space-y-2">
  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
    Full Name
  </label>

  <input
    className="
      w-full
      rounded-xl
      border
      border-gray-300 dark:border-white/10
      bg-white dark:bg-[#111827]
      text-black dark:text-white
      placeholder:text-gray-400 dark:placeholder:text-gray-500
      p-3
      focus:outline-none
      focus:ring-2
      focus:ring-cyan-500
    "
    placeholder="Enter your full name"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
</div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
      Trading Style
    </label>

    <CustomSelect
  value={tradingStyle}
  onChange={setTradingStyle}
  options={[
    "Scalping",
    "Intraday",
    "Swing",
    "Position",
  ]}
/>
  </div>

  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
      Account Type
    </label>

    <select
      className="
        w-full
        rounded-xl
        border
        border-gray-300 dark:border-white/10
        bg-white dark:bg-[#111827]
        text-black dark:text-white
        p-3
        focus:outline-none
        focus:ring-2
        focus:ring-cyan-500
      "
      value={accountType}
      onChange={(e) => setAccountType(e.target.value)}
    >
      <option>Demo</option>
      <option>Live</option>
      <option>Prop Firm</option>
    </select>
  </div>

</div>

      <div className="space-y-2">
  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
    Trading Experience
  </label>

  <select
    className="
      w-full
      rounded-xl
      border
      border-gray-300 dark:border-white/10
      bg-white dark:bg-[#111827]
      text-black dark:text-white
      p-3
      focus:outline-none
      focus:ring-2
      focus:ring-cyan-500
    "
    value={experience}
    onChange={(e) => setExperience(e.target.value)}
  >
    <option>Beginner</option>
    <option>Intermediate</option>
    <option>Advanced</option>
  </select>
</div>

      <div className="space-y-2">
  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
    Bio
  </label>

  <textarea
    rows={5}
    className="
      w-full
      rounded-xl
      border
      border-gray-300 dark:border-white/10
      bg-white dark:bg-[#111827]
      text-black dark:text-white
      placeholder:text-gray-400 dark:placeholder:text-gray-500
      p-3
      focus:outline-none
      focus:ring-2
      focus:ring-cyan-500
      resize-none
    "
    placeholder="Tell us about yourself..."
    value={bio}
    onChange={(e) => setBio(e.target.value)}
  />
</div>

      <div className="flex justify-end pt-2">
  <button
    onClick={saveProfile}
    disabled={saving}
    className="
      flex
      items-center
      justify-center
      rounded-xl
      bg-cyan-500
      px-8
      py-3
      font-semibold
      text-white
      transition-all
      duration-300
      hover:bg-cyan-600
      hover:shadow-lg
      hover:shadow-cyan-500/20
      active:scale-95
      disabled:opacity-60
      disabled:cursor-not-allowed
    "
  >
    {saving ? "Saving Changes..." : "Save Changes"}
  </button>
</div>

    </div>
  );
}