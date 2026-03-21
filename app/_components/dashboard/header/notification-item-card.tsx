import { formatTimeAgo } from "./notifications.utils";
import type { NotificationItem } from "./notifications.types";

type NotificationItemCardProps = {
  item: NotificationItem;
  saving: boolean;
  onMarkAsRead: (id: string) => void;
};

export function NotificationItemCard({ item, saving, onMarkAsRead }: NotificationItemCardProps) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        item.isRead ? "border-stone-200 bg-white" : "border-red-200 bg-red-50/60"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-stone-900">{item.title}</p>
        {!item.isRead ? (
          <button
            type="button"
            className="text-[10px] font-semibold text-red-700 hover:text-red-800"
            onClick={() => onMarkAsRead(item.id)}
            disabled={saving}
          >
            Oznacz
          </button>
        ) : null}
      </div>
      <p className="mt-1 line-clamp-2 text-xs text-stone-600">{item.content}</p>
      <p className="mt-2 text-[11px] text-stone-500">{formatTimeAgo(item.createdAt)}</p>
    </div>
  );
}
