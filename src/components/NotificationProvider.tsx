"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  refresh: () => Promise<void>;
  markAsRead: () => Promise<void>;
};

const NotificationContext =
  createContext<NotificationContextType | undefined>(
    undefined
  );

export function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { session } = useAuth();

  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  async function refresh() {
    if (!session?.user) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", {
        ascending: false,
      });

    setNotifications(data ?? []);
  }

  async function markAsRead() {
    if (!session?.user) return;

    await supabase
      .from("notifications")
      .update({
        is_read: true,
      })
      .eq("user_id", session.user.id)
      .eq("is_read", false);

    refresh();
  }

  useEffect(() => {
  if (!session?.user) return;

  refresh();

  const channel = supabase
    .channel(`notifications-${session.user.id}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${session.user.id}`,
      },
      () => {
        refresh();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [session]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount: notifications.filter(
          (n) => !n.is_read
        ).length,
        refresh,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
}