"use client";

import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import type { CourseDraft, CourseItem, CourseStatus } from "./kursy-types";

export function CourseDialog({
  mode,
  open,
  draft,
  pending,
  error,
  onClose,
  onChange,
  onSubmit,
}: {
  mode: "create" | "edit";
  open: boolean;
  draft: CourseDraft;
  pending: boolean;
  error: string | null;
  onClose: () => void;
  onChange: (next: CourseDraft) => void;
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

      <div className="relative mx-auto my-10 w-full max-w-3xl rounded-3xl border border-red-100/80 bg-white p-6 shadow-[0_24px_80px_-30px_rgba(220,38,38,0.4)] animate-in zoom-in-95 fade-in duration-200">
        <div className="mb-6 flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">
              {mode === "create" ? "Dodaj nowy kurs" : "Edytuj kurs"}
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              {mode === "create"
                ? "Uzupełnij dane kursu i opublikuj go w ofercie ośrodka."
                : "Zmień parametry kursu i zapisz aktualizację."}
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

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-800" htmlFor={`${mode}-course-title`}>
              Nazwa kursu
            </label>
            <input
              id={`${mode}-course-title`}
              value={draft.title}
              onChange={(event) =>
                onChange({ ...draft, title: event.target.value })
              }
              placeholder="Np. Prawo jazdy kat. B"
              className="h-11 w-full rounded-xl border border-stone-300 px-3 text-sm outline-none focus:border-red-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-800" htmlFor={`${mode}-course-category`}>
              Kategoria
            </label>
            <select
              id={`${mode}-course-category`}
              value={draft.category}
              onChange={(event) =>
                onChange({
                  ...draft,
                  category: event.target.value as CourseItem["category"],
                })
              }
              className="h-11 w-full rounded-xl border border-stone-300 px-3 text-sm outline-none focus:border-red-500"
            >
              <option value="A">Kategoria A</option>
              <option value="B">Kategoria B</option>
              <option value="DOSZKALANIE">Doszkalanie</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-800" htmlFor={`${mode}-course-start-date`}>
              Data startu
            </label>
            <input
              id={`${mode}-course-start-date`}
              type="date"
              value={draft.startDate}
              onChange={(event) =>
                onChange({ ...draft, startDate: event.target.value })
              }
              className="h-11 w-full rounded-xl border border-stone-300 px-3 text-sm outline-none focus:border-red-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-800" htmlFor={`${mode}-course-duration-value`}>
              Czas trwania (liczba)
            </label>
            <input
              id={`${mode}-course-duration-value`}
              value={draft.durationValue}
              onChange={(event) =>
                onChange({ ...draft, durationValue: event.target.value })
              }
              placeholder="Np. 3"
              className="h-11 w-full rounded-xl border border-stone-300 px-3 text-sm outline-none focus:border-red-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-800" htmlFor={`${mode}-course-duration-unit`}>
              Jednostka czasu
            </label>
            <select
              id={`${mode}-course-duration-unit`}
              value={draft.durationUnit}
              onChange={(event) =>
                onChange({
                  ...draft,
                  durationUnit: event.target.value as CourseDraft["durationUnit"],
                })
              }
              className="h-11 w-full rounded-xl border border-stone-300 px-3 text-sm outline-none focus:border-red-500"
            >
              <option value="dni">dni</option>
              <option value="tygodnie">tygodnie</option>
              <option value="godziny">godziny</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-800" htmlFor={`${mode}-course-price`}>
              Cena (PLN)
            </label>
            <input
              id={`${mode}-course-price`}
              value={draft.pricePln}
              onChange={(event) =>
                onChange({ ...draft, pricePln: event.target.value })
              }
              placeholder="Np. 3200"
              className="h-11 w-full rounded-xl border border-stone-300 px-3 text-sm outline-none focus:border-red-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-800" htmlFor={`${mode}-course-enrolled`}>
              Zapisanych
            </label>
            <input
              id={`${mode}-course-enrolled`}
              value={draft.enrolled}
              onChange={(event) =>
                onChange({ ...draft, enrolled: event.target.value })
              }
              placeholder="Domyślnie 0"
              className="h-11 w-full rounded-xl border border-stone-300 px-3 text-sm outline-none focus:border-red-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-800" htmlFor={`${mode}-course-capacity`}>
              Limit miejsc
            </label>
            <input
              id={`${mode}-course-capacity`}
              value={draft.capacity}
              onChange={(event) =>
                onChange({ ...draft, capacity: event.target.value })
              }
              placeholder="Puste = nielimitowane"
              className="h-11 w-full rounded-xl border border-stone-300 px-3 text-sm outline-none focus:border-red-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-800" htmlFor={`${mode}-course-status`}>
              Status kursu
            </label>
            <select
              id={`${mode}-course-status`}
              value={draft.status}
              onChange={(event) =>
                onChange({ ...draft, status: event.target.value as CourseStatus })
              }
              className="h-11 w-full rounded-xl border border-stone-300 px-3 text-sm outline-none focus:border-red-500"
            >
              <option value="NABOR">Trwa nabór</option>
              <option value="PLANOWANY">Planowany</option>
              <option value="STALA_OFERTA">Stała oferta</option>
            </select>
          </div>
        </div>

        {error ? (
          <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
        ) : null}

        <div className="mt-5 flex items-center justify-end gap-3">
          <Button type="button" onClick={onClose} variant="secondary" disabled={pending}>
            Anuluj
          </Button>
          <Button type="button" onClick={onSubmit} disabled={pending}>
            {pending
              ? "Zapisywanie..."
              : mode === "create"
                ? "Dodaj kurs"
                : "Zapisz zmiany"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
