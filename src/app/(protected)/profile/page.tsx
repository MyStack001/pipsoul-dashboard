"use client";

import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/components/ProfileProvider";
import { useRef } from "react";

import ProfileHeader from "./components/ProfileHeader";
import ProfileStats from "./components/ProfileStats";
import ProfileForm from "./components/ProfileForm";

export type Profile = {
  id: string;
  name: string | null;
  strategy: string | null;
  avatar_url: string | null;
  trading_style: string | null;
  account_type: string |null;
  experience: string | null;
};

export default function ProfilePage() {
  const { session } = useAuth();

  const { profile, setProfile } = useProfile();
  const profileFormRef = useRef<HTMLDivElement>(null);

  
  if (!profile) return null;
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <ProfileHeader
  profile={profile}
  email={session?.user.email ?? ""}
  setProfile={setProfile}
  onEditProfile={() =>
    profileFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
/>

      <ProfileStats profile={profile} />

      <ProfileForm
  ref={profileFormRef}
  profile={profile}
  setProfile={setProfile}
/>
    </div>
  );
}