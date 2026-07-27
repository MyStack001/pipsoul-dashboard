import { supabase } from "@/lib/supabase";
import { createNotification } from "@/lib/notifications";

export async function unlockAchievement(
  userId: string,
  key: string,
  title: string,
  description: string
) {
  const { data } = await supabase
    .from("achievements")
    .select("id")
    .eq("user_id", userId)
    .eq("achievement_key", key)
    .maybeSingle();

  if (data) return;

  await supabase.from("achievements").insert({
    user_id: userId,
    achievement_key: key,
    title,
    description,
  });

  await createNotification(
    userId,
    "🏆 Achievement Unlocked",
    `${title} — ${description}`,
    "success"
  );
}