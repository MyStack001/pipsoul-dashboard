"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

export type Profile = {
  id: string;
  name: string | null;
  bio: string | null;
  avatar_url: string | null;
  trading_style: string | null;
  account_type: string | null;
  experience: string | null;
};

export function useProfile() {
  const { session } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile() {
    if (!session?.user) return;

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (data) {
      setProfile(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchProfile();
  }, [session]);

  return {
    profile,
    loading,
    setProfile,
    refreshProfile: fetchProfile,
  };
}