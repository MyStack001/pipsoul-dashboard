"use client";

import { useRef, useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/components/ProfileProvider";

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

const [highlight, setHighlight] = useState(false);

const handleEditProfile = () => {
  profileFormRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  setHighlight(true);
};

useEffect(() => {
  if (!highlight) return;

  const timer = setTimeout(() => {
    setHighlight(false);
  }, 1000);

  return () => clearTimeout(timer);
}, [highlight]);

  const profileFormRef = useRef<HTMLDivElement>(null);

  
  if (!profile) {
  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-pulse">
      <div className="h-48 rounded-2xl bg-gray-200 dark:bg-white/5" />
      <div className="h-32 rounded-2xl bg-gray-200 dark:bg-white/5" />
      <div className="h-96 rounded-2xl bg-gray-200 dark:bg-white/5" />
    </div>
  );
}
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <ProfileHeader
  profile={profile}
  email={session?.user.email ?? ""}
  setProfile={setProfile}
  onEditProfile={handleEditProfile}
/>

      <ProfileStats profile={profile} />

      <ProfileForm
  ref={profileFormRef}
  profile={profile}
  setProfile={setProfile}
  highlight={highlight}
/>
    </div>
  );
}