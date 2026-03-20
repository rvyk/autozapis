"use client";

import { useMemo, useState } from "react";
import { SectionHeader } from "@/app/_components/dashboard/section-header";
import { Button } from "@/components/ui/button";
import { AnnouncementCard } from "./announcement-card";
import { AnnouncementDialog } from "./announcement-dialog";
import { AnnouncementEmptyState } from "./announcement-empty-state";
import {
  DEFAULT_FORM,
  type Announcement,
  type AnnouncementForm,
} from "./ogloszenia-types";

export function OgloszeniaPageContent({
  initialAnnouncements,
}: {
  initialAnnouncements: Announcement[];
}) {
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(initialAnnouncements);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AnnouncementForm>(DEFAULT_FORM);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editingAnnouncement = useMemo(
    () => announcements.find((item) => item.id === editingId) ?? null,
    [announcements, editingId],
  );

  function closeDialog() {
    setIsCreateOpen(false);
    setEditingId(null);
    setForm(DEFAULT_FORM);
    setError(null);
  }

  function openCreate() {
    setEditingId(null);
    setForm(DEFAULT_FORM);
    setError(null);
    setIsCreateOpen(true);
  }

  function openEdit(announcement: Announcement) {
    setIsCreateOpen(false);
    setEditingId(announcement.id);
    setForm({
      title: announcement.title,
      target: announcement.target,
      content: announcement.content,
    });
    setError(null);
  }

  function validateForm() {
    if (!form.title.trim() || !form.target || !form.content.trim()) {
      setError("Uzupełnij tytuł, odbiorców i treść wiadomości.");
      return false;
    }

    return true;
  }

  async function saveCreate() {
    setError(null);
    if (!validateForm()) return;

    setPending(true);
    try {
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = (await response.json().catch(() => null)) as {
        announcement?: Announcement;
      } | null;

      if (!response.ok || !payload?.announcement) {
        setError("Nie udało się dodać ogłoszenia. Spróbuj ponownie.");
        return;
      }

      setAnnouncements((current) => [
        payload.announcement as Announcement,
        ...current,
      ]);
      closeDialog();
    } catch {
      setError("Nie udało się dodać ogłoszenia. Spróbuj ponownie.");
    } finally {
      setPending(false);
    }
  }

  async function saveEdit() {
    if (!editingId) return;

    setError(null);
    if (!validateForm()) return;

    setPending(true);
    try {
      const response = await fetch(`/api/announcements/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = (await response.json().catch(() => null)) as {
        announcement?: Announcement;
      } | null;

      if (!response.ok || !payload?.announcement) {
        setError("Nie udało się zaktualizować ogłoszenia. Spróbuj ponownie.");
        return;
      }

      const updatedAnnouncement = payload.announcement;
      setAnnouncements((current) =>
        current.map((item) =>
          item.id === updatedAnnouncement.id
            ? (updatedAnnouncement as Announcement)
            : item,
        ),
      );
      closeDialog();
    } catch {
      setError("Nie udało się zaktualizować ogłoszenia. Spróbuj ponownie.");
    } finally {
      setPending(false);
    }
  }

  async function deleteAnnouncement(announcementId: string) {
    if (pending) return;

    const shouldDelete = window.confirm(
      "Na pewno usunąć to ogłoszenie? Tej operacji nie można cofnąć.",
    );
    if (!shouldDelete) return;

    setPending(true);
    setError(null);

    try {
      const response = await fetch(`/api/announcements/${announcementId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setError("Nie udało się usunąć ogłoszenia. Spróbuj ponownie.");
        return;
      }

      setAnnouncements((current) =>
        current.filter((item) => item.id !== announcementId),
      );
      if (editingId === announcementId) {
        closeDialog();
      }
    } catch {
      setError("Nie udało się usunąć ogłoszenia. Spróbuj ponownie.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <SectionHeader
        title="Ogłoszenia"
        description="Wysyłaj wiadomości i powiadomienia do swoich kursantów."
        actions={
          <Button onClick={openCreate} variant="primary">
            Utwórz nową wiadomość
          </Button>
        }
      />

      <div className="flex flex-col gap-6">
        {announcements.length === 0 ? <AnnouncementEmptyState /> : null}

        {announcements.map((post) => (
          <AnnouncementCard
            key={post.id}
            post={post}
            pending={pending}
            onEdit={openEdit}
            onDelete={(announcementId) =>
              void deleteAnnouncement(announcementId)
            }
          />
        ))}
      </div>

      <AnnouncementDialog
        mode="create"
        open={isCreateOpen}
        form={form}
        pending={pending}
        error={error}
        onClose={closeDialog}
        onChange={setForm}
        onSubmit={() => void saveCreate()}
      />

      <AnnouncementDialog
        mode="edit"
        open={Boolean(editingAnnouncement)}
        form={form}
        pending={pending}
        error={error}
        onClose={closeDialog}
        onChange={setForm}
        onSubmit={() => void saveEdit()}
      />
    </div>
  );
}
