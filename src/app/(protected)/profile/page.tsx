"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

import ProfileHeader from "./components/ProfileHeader";
import ProfileStats from "./components/ProfileStats";
import ProfileForm from "./components/ProfileForm";

export type Profile = {
  id: string;
  name: string | null;
  bio: string | null;
  avatar_url: string | null;
  trading_style: string | null;
  account_type: string |null;
  experience: string | null;
};

export default function ProfilePage() {
  const { session } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) return;

const userId = session.user.id;

async function loadProfile() {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

      if (data) {
        setProfile(data);
      }

      setLoading(false);
    }

    loadProfile();
  }, [session]);

  if (loading || !profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <ProfileHeader
  profile={profile}
  email={session?.user.email ?? ""}
  setProfile={setProfile}
/>

      <ProfileStats profile={profile} />

      <ProfileForm
        profile={profile}
        setProfile={setProfile}
      />
    </div>
  );
}