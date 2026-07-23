"use client";

import { useMemo, useRef,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
 } from "react";
import type { Profile } from "../page";
import { Camera } from "lucide-react";
import { supabase } from "@/lib/supabase";


type ProfileHeaderProps = {
  profile: Profile;
  email: string;
  setProfile: Dispatch<SetStateAction<Profile | null>>;
};
export default function ProfileHeader({
  profile,
  email,
  setProfile,
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  async function uploadAvatar(
  event: ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0];

  if (!file) return;

  const fileExt = file.name.split(".").pop();
  const fileName = `${profile.id}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, {
      upsert: true,
    });

  if (uploadError) {
    alert(uploadError.message);
    return;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);

  const { error } = await supabase
    .from("users")
    .update({
      avatar_url: publicUrl,
    })
    .eq("id", profile.id);

  if (error) {
    alert(error.message);
    return;
  }

  setProfile({
    ...profile,
    avatar_url: publicUrl,
  });

  event.target.value = "";

  alert("Profile picture updated successfully!");
}

  const initials = useMemo(() => {
    if (profile.name?.trim()) {
      return profile.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }

    return email.charAt(0).toUpperCase() || "?";
  }, [profile, email]);

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl p-8">
      <div className="flex flex-col items-center text-center gap-5">

        <div className="relative">

  <div className="w-24 h-24 rounded-full bg-cyan-500 flex items-center justify-center text-3xl font-bold text-white overflow-hidden">

    {profile?.avatar_url ? (
      <img
        src={profile.avatar_url}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    ) : (
      initials
    )}

  </div>

  <button
  onClick={() => fileInputRef.current?.click()}
  className="
    absolute
    -bottom-1
    -right-1
    w-9
    h-9
    rounded-full
    bg-cyan-500
    hover:bg-cyan-600
    text-white
    flex
    items-center
    justify-center
    shadow-lg
    transition
  "
>
  <Camera size={18} />
</button>
<input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  className="hidden"
  onChange={uploadAvatar}
/>

</div>

        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">
            {profile.name?.trim() || "Complete your profile"}
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {email}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-2">

            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-600 dark:text-cyan-400">
              {profile.trading_style || "Intraday"}
            </span>

            <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-600 dark:text-green-400">
              {profile.account_type || "Demo"}
            </span>

            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-sm text-purple-600 dark:text-purple-400">
              {profile.experience || "Beginner"}
            </span>

          </div>
        </div>

      </div>
    </div>
  );
}