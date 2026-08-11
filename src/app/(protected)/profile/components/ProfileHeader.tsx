"use client";

import {
  useMemo,
  useRef,
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
  onEditProfile: () => void;
};

export default function ProfileHeader({
  profile,
  email,
  setProfile,
  onEditProfile,
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
      <div
        className="
          flex
          flex-col
          gap-6
          md:flex-row
          md:items-center
          md:justify-between
          md:gap-8
        "
      >
        {/* Left Side */}
        <div
          className="
            flex
            min-w-0
            items-center
            gap-4
            sm:gap-6
          "
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="
                flex
                h-20
                w-20
                items-center
                justify-center
                overflow-hidden
                rounded-full
                bg-cyan-500
                text-2xl
                font-bold
                text-white
                sm:h-24
                sm:w-24
                sm:text-3xl
              "
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <button
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="
                absolute
                -bottom-1
                -right-1
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-cyan-500
                text-white
                shadow-lg
                transition
                hover:bg-cyan-600
                active:scale-95
              "
              aria-label="Change profile picture"
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

          {/* Profile Info */}
          <div className="min-w-0">
            <h1
              className="
                break-words
                text-2xl
                font-bold
                leading-tight
                text-black
                dark:text-white
                sm:text-3xl
              "
            >
              {profile.name?.trim() ||
                "Complete your profile"}
            </h1>

            <p
              className="
                mt-1
                truncate
                text-sm
                text-gray-500
                dark:text-gray-400
                sm:text-base
              "
            >
              {email}
            </p>

            <div
              className="
                mt-3
                flex
                flex-wrap
                gap-2
                sm:mt-4
              "
            >
              <span
                className="
                  rounded-full
                  bg-cyan-500/10
                  px-3
                  py-1
                  text-xs
                  text-cyan-500
                  sm:text-sm
                "
              >
                {profile.trading_style ||
                  "Intraday"}
              </span>

              <span
                className="
                  rounded-full
                  bg-green-500/10
                  px-3
                  py-1
                  text-xs
                  text-green-500
                  sm:text-sm
                "
              >
                {profile.account_type ||
                  "Demo"}
              </span>

              <span
                className="
                  rounded-full
                  bg-purple-500/10
                  px-3
                  py-1
                  text-xs
                  text-purple-500
                  sm:text-sm
                "
              >
                {profile.experience ||
                  "Beginner"}
              </span>
            </div>

            <p
              className="
                mt-3
                text-xs
                text-gray-500
                dark:text-gray-400
                sm:mt-5
                sm:text-sm
              "
            >
              Building consistency, one trade
              at a time.
            </p>
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={onEditProfile}
          className="
            w-full
            rounded-xl
            bg-cyan-500
            px-5
            py-3
            text-sm
            font-medium
            text-white
            transition
            hover:bg-cyan-600
            active:scale-[0.98]
            md:w-auto
            md:shrink-0
          "
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}