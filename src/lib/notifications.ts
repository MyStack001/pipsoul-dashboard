import { supabase } from "@/lib/supabase";

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: "info" | "success" | "warning" | "error" = "info"
) {
 
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      title,
      message,
      type,
    })
    .select();


  if (error) {
    console.error("Notification error:", error);
  }
}