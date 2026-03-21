import { Button } from "@/components/ui/button";
import type { NotificationItem } from "./notifications.types";
import { NotificationItemCard } from "./notification-item-card";

type NotificationsDropdownProps = {
  loading: boolean;
  saving: boolean;
  error: string | null;
  notifications: NotificationItem[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
};

export function NotificationsDropdown({
  loading,
  saving,
  error,
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationsDropdownProps) {
  return (
    <div className="absolute right-0 z-100 mt-2 w-92 rounded-2xl border border-stone-200 bg-white p-3 shadow-xl">
      <div className="mb-2 flex items-center justify-between gap-2 px-1">
        <p className="text-sm font-semibold text-stone-900">Ogłoszenia</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={onMarkAllAsRead}
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
        {loading ? <p className="px-1 py-2 text-sm text-stone-500">Ładowanie...</p> : null}

        {!loading && notifications.length === 0 ? (
          <p className="px-1 py-2 text-sm text-stone-500">Brak ogłoszeń.</p>
        ) : null}

        {!loading
          ? notifications.map((item) => (
              <NotificationItemCard
                key={item.id}
                item={item}
                saving={saving}
                onMarkAsRead={onMarkAsRead}
              />
            ))
          : null}
      </div>
    </div>
  );
}
