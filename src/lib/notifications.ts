import { supabase } from "@/lib/supabase";

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: "info" | "success" | "warning" | "error" = "info"
) {
  const { error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      title,
      message,
      type,
    });

  if (error) {
    console.error(error);
  }
}