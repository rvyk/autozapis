"use client";

import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import type { Announcement, AnnouncementForm } from "./ogloszenia-types";
import { TARGET_OPTIONS } from "./ogloszenia-types";

export function AnnouncementDialog({
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
              {mode === "create" ? "Nowe ogloszenie" : "Edytuj ogloszenie"}
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              {mode === "create"
                ? "Napisz wiadomosc i opublikuj ja w panelu kursanta."
                : "Zmien tresc wiadomosci i zapisz aktualizacje."}
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
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-800" htmlFor={`${mode}-announcement-title`}>
              Tytul
            </label>
            <input
              id={`${mode}-announcement-title`}
              value={form.title}
              onChange={(event) => onChange({ ...form, title: event.target.value })}
              maxLength={120}
              className="h-11 w-full rounded-xl border border-stone-300 px-3 text-sm text-stone-900 outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
              placeholder="Np. Zmiana terminu jazd"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-800" htmlFor={`${mode}-announcement-target`}>
              Odbiorcy
            </label>
            <select
              id={`${mode}-announcement-target`}
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
            <label className="text-sm font-medium text-stone-800" htmlFor={`${mode}-announcement-content`}>
              Tresc
            </label>
            <textarea
              id={`${mode}-announcement-content`}
              value={form.content}
              onChange={(event) => onChange({ ...form, content: event.target.value })}
              maxLength={5000}
              rows={7}
              className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-sm leading-relaxed text-stone-900 outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
              placeholder="Opisz co sie zmienilo i kogo dotyczy komunikat..."
            />
          </div>

          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" onClick={onClose} variant="secondary" disabled={pending}>
              Anuluj
            </Button>
            <Button type="button" onClick={onSubmit} variant="primary" disabled={pending}>
              {pending
                ? "Zapisywanie..."
                : mode === "create"
                  ? "Opublikuj ogloszenie"
                  : "Zapisz zmiany"}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
