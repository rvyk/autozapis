import { useEffect, useMemo, useState } from "react";
import type { NotificationItem } from "./notifications.types";

type UseNotificationsResult = {
  loading: boolean;
  saving: boolean;
  error: string | null;
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (announcementId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

export function useNotifications(enabled: boolean): UseNotificationsResult {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const unreadCount = useMemo(
    () => notifications.reduce((total, item) => total + (item.isRead ? 0 : 1), 0),
    [notifications],
  );

  useEffect(() => {
    if (!enabled) return;

    async function loadNotifications() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/notifications", {
          cache: "no-store",
        });
        const payload = (await response.json().catch(() => null)) as {
          notifications?: NotificationItem[];
        } | null;

        if (!response.ok || !payload?.notifications) {
          setError("Nie udało się pobrać ogłoszeń.");
          setNotifications([]);
          return;
        }

        setNotifications(payload.notifications);
      } catch {
        setError("Nie udało się pobrać ogłoszeń.");
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }

    void loadNotifications();
  }, [enabled]);

  async function markAsRead(announcementId: string) {
    setSaving(true);
    setError(null);

    const previous = notifications;
    setNotifications((current) =>
      current.map((item) =>
        item.id === announcementId ? { ...item, isRead: true } : item,
      ),
    );

    try {
      const response = await fetch(`/api/notifications/${announcementId}/read`, {
        method: "PATCH",
      });

      if (!response.ok) {
        setNotifications(previous);
        setError("Nie udało się oznaczyć jako przeczytane.");
      }
    } catch {
      setNotifications(previous);
      setError("Nie udało się oznaczyć jako przeczytane.");
    } finally {
      setSaving(false);
    }
  }

  async function markAllAsRead() {
    setSaving(true);
    setError(null);

    const previous = notifications;
    setNotifications((current) =>
      current.map((item) => ({ ...item, isRead: true })),
    );

    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "PATCH",
      });

      if (!response.ok) {
        setNotifications(previous);
        setError("Nie udało się oznaczyć wszystkich ogłoszeń.");
      }
    } catch {
      setNotifications(previous);
      setError("Nie udało się oznaczyć wszystkich ogłoszeń.");
    } finally {
      setSaving(false);
    }
  }

  return {
    loading,
    saving,
    error,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}
