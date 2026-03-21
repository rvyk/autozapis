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
    <div className="fixed inset-x-3 top-18 z-100 rounded-2xl border border-stone-200 bg-white p-3 shadow-xl sm:absolute sm:top-auto sm:right-0 sm:left-auto sm:mt-2 sm:w-[23rem]">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
        <p className="text-sm font-semibold text-stone-900">Ogłoszenia</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-auto px-2 py-1 text-left text-xs whitespace-normal sm:whitespace-nowrap"
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

      <div className="max-h-[min(70dvh,26rem)] space-y-2 overflow-y-auto pr-1 sm:max-h-96">
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
