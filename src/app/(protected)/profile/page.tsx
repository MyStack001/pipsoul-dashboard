"use client";

import ProfileHeader from "./components/ProfileHeader";
import ProfileStats from "./components/ProfileStats";
import ProfileForm from "./components/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <ProfileHeader />
      <ProfileStats />
      <ProfileForm />
    </div>
  );
}