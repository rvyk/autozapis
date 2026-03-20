"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

type NotificationItem = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
};

function formatTimeAgo(value: string) {
  const date = new Date(value);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes} min temu`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} godz. temu`;
  }

  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function DashboardHeader() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const pathname = usePathname();
  const canShowNotifications =
    pathname?.startsWith("/kursant") || pathname?.startsWith("/instruktor");

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const bellContainerRef = useRef<HTMLDivElement | null>(null);

  const userInitials = user?.firstName
    ? `${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ""}`
    : "AU";

  const unreadCount = useMemo(
    () =>
      notifications.reduce((total, item) => total + (item.isRead ? 0 : 1), 0),
    [notifications],
  );

  useEffect(() => {
    if (!canShowNotifications) return;

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
  }, [canShowNotifications]);

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!bellContainerRef.current) return;
      if (bellContainerRef.current.contains(event.target as Node)) return;
      setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener("mousedown", onDocumentClick);
      return () => document.removeEventListener("mousedown", onDocumentClick);
    }
  }, [isOpen]);

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
      const response = await fetch(
        `/api/notifications/${announcementId}/read`,
        {
          method: "PATCH",
        },
      );

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

  return (
    <header className="relative z-50 w-full border-b border-red-100/50 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-stone-900 transition-colors hover:text-red-600"
          >
            Auto<span className="text-red-600">Zapis</span>
          </Link>
          <div className="hidden h-6 w-px bg-stone-200 sm:block" />
          <p className="hidden text-sm font-medium text-stone-500 sm:block">
            System obsługi Ośrodka Szkolenia Kierowców
          </p>
        </div>

        <div className="flex items-center gap-4">
          {canShowNotifications ? (
            <div className="relative" ref={bellContainerRef}>
              <button
                type="button"
                className="relative rounded-full p-2 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600"
                onClick={() => setIsOpen((current) => !current)}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
                  />
                </svg>
                {unreadCount > 0 ? (
                  <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full border border-white bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                ) : null}
              </button>

              {isOpen ? (
                <div className="absolute right-0 z-100 mt-2 w-92 rounded-2xl border border-stone-200 bg-white p-3 shadow-xl">
                  <div className="mb-2 flex items-center justify-between gap-2 px-1">
                    <p className="text-sm font-semibold text-stone-900">
                      Ogłoszenia
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => void markAllAsRead()}
                      disabled={saving || unreadCount === 0}
                    >
                      Oznacz wszystko jako przeczytane
                    </Button>
                  </div>

                  {error ? (
                    <p className="mb-2 rounded-lg border border-red-200 bg-red-50 px-2 py-1.5 text-xs text-red-700">
                      {error}
                    </p>
                  ) : null}

                  <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                    {loading ? (
                      <p className="px-1 py-2 text-sm text-stone-500">
                        Ładowanie...
                      </p>
                    ) : null}

                    {!loading && notifications.length === 0 ? (
                      <p className="px-1 py-2 text-sm text-stone-500">
                        Brak ogłoszeń.
                      </p>
                    ) : null}

                    {!loading
                      ? notifications.map((item) => (
                          <div
                            key={item.id}
                            className={`rounded-xl border p-3 ${
                              item.isRead
                                ? "border-stone-200 bg-white"
                                : "border-red-200 bg-red-50/60"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-stone-900">
                                {item.title}
                              </p>
                              {!item.isRead ? (
                                <button
                                  type="button"
                                  className="text-[10px] font-semibold text-red-700 hover:text-red-800"
                                  onClick={() => void markAsRead(item.id)}
                                  disabled={saving}
                                >
                                  Oznacz
                                </button>
                              ) : null}
                            </div>
                            <p className="mt-1 line-clamp-2 text-xs text-stone-600">
                              {item.content}
                            </p>
                            <p className="mt-2 text-[11px] text-stone-500">
                              {formatTimeAgo(item.createdAt)}
                            </p>
                          </div>
                        ))
                      : null}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="h-6 w-px bg-stone-200" />

          <div className="flex items-center gap-3">
            <div className="hidden flex-col items-end sm:flex">
              <span className="text-sm font-semibold text-stone-900">
                {user?.firstName
                  ? `${user.firstName} ${user.lastName || ""}`
                  : "Użytkownik"}
              </span>
              <span className="text-xs text-stone-500 hover:text-red-600">
                <button onClick={() => signOut({ redirectUrl: "/" })}>
                  Wyloguj się
                </button>
              </span>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 font-semibold text-red-700 ring-2 ring-white">
              {userInitials}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
