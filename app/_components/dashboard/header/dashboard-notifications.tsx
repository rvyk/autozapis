import { useEffect, useRef, useState } from "react";
import { NotificationsBellButton } from "./notifications-bell-button";
import { NotificationsDropdown } from "./notifications-dropdown";
import { useNotifications } from "./use-notifications";

export function DashboardNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const bellContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    loading,
    saving,
    error,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications(true);

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

  return (
    <div className="relative" ref={bellContainerRef}>
      <NotificationsBellButton
        unreadCount={unreadCount}
        onToggle={() => setIsOpen((current) => !current)}
      />

      {isOpen ? (
        <NotificationsDropdown
          loading={loading}
          saving={saving}
          error={error}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={(id) => void markAsRead(id)}
          onMarkAllAsRead={() => void markAllAsRead()}
        />
      ) : null}
    </div>
  );
}
