"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

type Announcement = {
  id: string;
  title: string;
  content: string;
  target:
    | "ALL_KURSANCI"
    | "KURSANCI_KAT_A"
    | "KURSANCI_KAT_B"
    | "KURSANCI_OCZEKUJACY"
    | "INSTRUKTORZY";
  authorName: string;
  createdAt: string;
  updatedAt: string;
};

type AnnouncementForm = {
  title: string;
  target: Announcement["target"];
  content: string;
};

const TARGET_OPTIONS = [
  { value: "ALL_KURSANCI", label: "Wszyscy kursanci" },
  { value: "KURSANCI_KAT_B", label: "Kursanci kat. B" },
  { value: "KURSANCI_KAT_A", label: "Kursanci kat. A" },
  { value: "KURSANCI_OCZEKUJACY", label: "Kursanci oczekujący" },
  { value: "INSTRUKTORZY", label: "Instruktorzy" },
] as const;

const TARGET_LABELS: Record<Announcement["target"], string> = {
  ALL_KURSANCI: "Wszyscy kursanci",
  KURSANCI_KAT_A: "Kursanci kat. A",
  KURSANCI_KAT_B: "Kursanci kat. B",
  KURSANCI_OCZEKUJACY: "Kursanci oczekujący",
  INSTRUKTORZY: "Instruktorzy",
};

const DEFAULT_FORM: AnnouncementForm = {
  title: "",
  target: TARGET_OPTIONS[0].value,
  content: "",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function AnnouncementDialog({
  mode,
  open,
  form,
  pending,
  error,
  onClose,
  onChange,
  onSubmit,
}: {
  mode: "create" | "edit";
  open: boolean;
  form: AnnouncementForm;
  pending: boolean;
  error: string | null;
  onClose: () => void;
  onChange: (next: AnnouncementForm) => void;
  onSubmit: () => void;
}) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-120 overflow-y-auto p-4">
      <Button
        type="button"
        aria-label="Zamknij"
        onClick={onClose}
        variant="ghost"
        className="absolute inset-0 h-auto w-auto rounded-none bg-stone-950/45 backdrop-blur-[2px] hover:bg-stone-950/45"
      />

      <div className="relative mx-auto my-10 w-full max-w-2xl rounded-3xl border border-red-100/80 bg-white p-6 shadow-[0_24px_80px_-30px_rgba(220,38,38,0.4)] animate-in zoom-in-95 fade-in duration-200">
        <div className="mb-6 flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">
              {mode === "create" ? "Nowe ogłoszenie" : "Edytuj ogłoszenie"}
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              {mode === "create"
                ? "Napisz wiadomość i opublikuj ją w panelu kursanta."
                : "Zmień treść wiadomości i zapisz aktualizację."}
            </p>
          </div>

          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
            aria-label="Zamknij okno"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label
              className="text-sm font-medium text-stone-800"
              htmlFor="announcement-title"
            >
              Tytuł
            </label>
            <input
              id="announcement-title"
              value={form.title}
              onChange={(event) =>
                onChange({ ...form, title: event.target.value })
              }
              maxLength={120}
              className="h-11 w-full rounded-xl border border-stone-300 px-3 text-sm text-stone-900 outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
              placeholder="Np. Zmiana terminu jazd"
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="text-sm font-medium text-stone-800"
              htmlFor="announcement-target"
            >
              Odbiorcy
            </label>
            <select
              id="announcement-target"
              value={form.target}
              onChange={(event) =>
                onChange({
                  ...form,
                  target: event.target.value as Announcement["target"],
                })
              }
              className="h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-900 outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
            >
              {TARGET_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              className="text-sm font-medium text-stone-800"
              htmlFor="announcement-content"
            >
              Treść
            </label>
            <textarea
              id="announcement-content"
              value={form.content}
              onChange={(event) =>
                onChange({ ...form, content: event.target.value })
              }
              maxLength={5000}
              rows={7}
              className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm leading-relaxed text-stone-900 outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
              placeholder="Opisz co się zmieniło i kogo dotyczy komunikat..."
            />
          </div>

          {error ? (
            <p className="text-sm font-medium text-red-600">{error}</p>
          ) : null}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              disabled={pending}
            >
              Anuluj
            </Button>
            <Button
              type="button"
              onClick={onSubmit}
              variant="primary"
              disabled={pending}
            >
              {pending
                ? "Zapisywanie..."
                : mode === "create"
                  ? "Opublikuj ogłoszenie"
                  : "Zapisz zmiany"}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

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

  async function saveCreate() {
    setError(null);

    if (!form.title.trim() || !form.target || !form.content.trim()) {
      setError("Uzupełnij tytuł, odbiorców i treść wiadomości.");
      return;
    }

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

      const createdAnnouncement = payload.announcement;

      setAnnouncements((current) => [createdAnnouncement, ...current]);
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

    if (!form.title.trim() || !form.target || !form.content.trim()) {
      setError("Uzupełnij tytuł, odbiorców i treść wiadomości.");
      return;
    }

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
          item.id === updatedAnnouncement.id ? updatedAnnouncement : item,
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

    if (!shouldDelete) {
      return;
    }

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
        setIsCreateOpen(false);
        setEditingId(null);
        setForm(DEFAULT_FORM);
      }
    } catch {
      setError("Nie udało się usunąć ogłoszenia. Spróbuj ponownie.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Ogłoszenia
          </h1>
          <p className="mt-2 text-stone-500">
            Wysyłaj wiadomości i powiadomienia do swoich kursantów.
          </p>
        </div>
        <div>
          <Button onClick={openCreate} variant="primary">
            Utwórz nową wiadomość
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {announcements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
            <p className="text-sm font-medium text-stone-700">
              Nie masz jeszcze żadnych ogłoszeń.
            </p>
            <p className="mt-1 text-sm text-stone-500">
              Kliknij &quot;Utwórz nową wiadomość&quot;, aby dodać pierwszy
              komunikat.
            </p>
          </div>
        ) : null}

        {announcements.map((post) => (
          <article
            key={post.id}
            className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  {post.title}
                </h3>
                <div className="mt-1 flex items-center gap-3 text-sm text-stone-500">
                  <span className="font-medium text-stone-700">
                    {post.authorName}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-stone-300" />
                  <span>{formatDate(post.createdAt)}</span>
                  {post.updatedAt !== post.createdAt ? (
                    <>
                      <span className="h-1 w-1 rounded-full bg-stone-300" />
                      <span className="text-xs">
                        edytowano {formatDate(post.updatedAt)}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                  Odbiorcy: {TARGET_LABELS[post.target]}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-lg border-stone-200 px-3 py-1.5 text-xs hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                  onClick={() => openEdit(post)}
                >
                  Edytuj
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-lg px-3 py-1.5 text-xs disabled:opacity-60"
                  onClick={() => deleteAnnouncement(post.id)}
                  disabled={pending}
                >
                  Usuń
                </Button>
              </div>
            </div>

            <div className="pt-2 text-sm leading-relaxed text-stone-600">
              {post.content}
            </div>
          </article>
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
        onSubmit={saveCreate}
      />

      <AnnouncementDialog
        mode="edit"
        open={Boolean(editingAnnouncement)}
        form={form}
        pending={pending}
        error={error}
        onClose={closeDialog}
        onChange={setForm}
        onSubmit={saveEdit}
      />
    </div>
  );
}
