"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthProvider";

export type Profile = {
  id: string;
  name: string | null;
  bio: string | null;
  avatar_url: string | null;
  trading_style: string | null;
  account_type: string | null;
  experience: string | null;
};

type ProfileContextType = {
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
};

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  setProfile: () => {},
});

export function ProfileProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { session } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshProfile() {
    if (!session?.user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single();

    setProfile(data ?? null);
    setLoading(false);
  }

  useEffect(() => {
    refreshProfile();
  }, [session]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        refreshProfile,
        setProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);