"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  COURSE_FILTERS,
  EMPTY_COURSE_DRAFT,
  type CourseDraft,
  type CourseFilter,
  type CourseItem,
  type CourseStatus,
} from "./kursy-types";
import {
  categoryToLabel,
  filterToLabel,
  filterToStatus,
  formatPrice,
  formatStartDate,
  getErrorMessage,
  getSpotsLabel,
  statusToClass,
  statusToLabel,
} from "./kursy-utils";

function CourseDialog({
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

function splitDuration(duration: string): Pick<CourseDraft, "durationValue" | "durationUnit"> {
  const normalized = duration.trim();
  const match = normalized.match(/^(\d+)\s*(dni|tygodnie|godziny)$/i);

  if (!match) {
    return { durationValue: normalized, durationUnit: "tygodnie" };
  }

  return {
    durationValue: match[1],
    durationUnit: match[2].toLowerCase() as CourseDraft["durationUnit"],
  };
}

export function KursyPageContent({ initialCourses }: { initialCourses: CourseItem[] }) {
  const [courses, setCourses] = useState<CourseItem[]>(initialCourses);
  const [filter, setFilter] = useState<CourseFilter>("WSZYSTKIE");
  const [draft, setDraft] = useState<CourseDraft>(EMPTY_COURSE_DRAFT);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [pendingCourseId, setPendingCourseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredCourses = useMemo(() => {
    const statusFilter = filterToStatus(filter);
    if (!statusFilter) return courses;
    return courses.filter((course) => course.status === statusFilter);
  }, [courses, filter]);

  const stats = useMemo(() => {
    let nabor = 0;
    let planowane = 0;
    let stala = 0;

    for (const course of courses) {
      if (course.status === "NABOR") nabor += 1;
      if (course.status === "PLANOWANY") planowane += 1;
      if (course.status === "STALA_OFERTA") stala += 1;
    }

    return {
      all: courses.length,
      nabor,
      planowane,
      stala,
    };
  }, [courses]);

  function getFilterCount(currentFilter: CourseFilter) {
    if (currentFilter === "NABOR") return stats.nabor;
    if (currentFilter === "PLANOWANE") return stats.planowane;
    if (currentFilter === "STALA_OFERTA") return stats.stala;
    return stats.all;
  }

  function validateDraft() {
    if (!draft.durationValue.trim()) {
      setError("Podaj czas trwania kursu.");
      return false;
    }

    return true;
  }

  function buildPayloadFromDraft() {
    return {
      ...draft,
      duration: `${draft.durationValue.trim()} ${draft.durationUnit}`.trim(),
      pricePln: Number(draft.pricePln),
      enrolled: draft.enrolled.trim() === "" ? 0 : Number(draft.enrolled),
      capacity: draft.capacity === "" ? null : Number(draft.capacity),
    };
  }

  async function createCourse() {
    setError(null);

    if (!validateDraft()) {
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch("/api/admin/kursy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayloadFromDraft()),
      });

      const payload = (await response.json().catch(() => null)) as {
        course?: CourseItem;
        error?: string;
      } | null;

      if (!response.ok || !payload?.course) {
        setError(getErrorMessage(payload?.error ?? null));
        return;
      }

      setCourses((current) => [payload.course as CourseItem, ...current]);
      setDraft(EMPTY_COURSE_DRAFT);
      setIsCreateOpen(false);
    } catch {
      setError(getErrorMessage(null));
    } finally {
      setIsCreating(false);
    }
  }

  async function saveEditCourse() {
    if (!editingCourseId) return;

    setError(null);

    if (!validateDraft()) {
      return;
    }

    setIsSavingEdit(true);

    try {
      const response = await fetch(`/api/admin/kursy/${editingCourseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayloadFromDraft()),
      });

      const payload = (await response.json().catch(() => null)) as {
        course?: CourseItem;
        error?: string;
      } | null;

      if (!response.ok || !payload?.course) {
        setError(getErrorMessage(payload?.error ?? null));
        return;
      }

      const updated = payload.course as CourseItem;
      setCourses((current) =>
        current.map((course) => (course.id === updated.id ? updated : course)),
      );
      setEditingCourseId(null);
      setDraft(EMPTY_COURSE_DRAFT);
    } catch {
      setError(getErrorMessage(null));
    } finally {
      setIsSavingEdit(false);
    }
  }

  async function deleteCourse(courseId: string) {
    const confirmed = window.confirm("Na pewno usunąć ten kurs?");
    if (!confirmed) return;

    setError(null);
    setPendingCourseId(courseId);

    try {
      const response = await fetch(`/api/admin/kursy/${courseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(getErrorMessage(payload?.error ?? null));
        return;
      }

      setCourses((current) => current.filter((course) => course.id !== courseId));

      if (editingCourseId === courseId) {
        setEditingCourseId(null);
        setDraft(EMPTY_COURSE_DRAFT);
      }
    } catch {
      setError(getErrorMessage(null));
    } finally {
      setPendingCourseId(null);
    }
  }

  function openCreateDialog() {
    setError(null);
    setDraft(EMPTY_COURSE_DRAFT);
    setEditingCourseId(null);
    setIsCreateOpen(true);
  }

  function closeCreateDialog() {
    setIsCreateOpen(false);
    setError(null);
  }

  function openEditDialog(course: CourseItem) {
    const durationParts = splitDuration(course.duration);

    setDraft({
      title: course.title,
      category: course.category,
      startDate: course.startDate ? course.startDate.slice(0, 10) : "",
      durationValue: durationParts.durationValue,
      durationUnit: durationParts.durationUnit,
      pricePln: String(course.pricePln),
      enrolled: String(course.enrolled),
      capacity: course.capacity === null ? "" : String(course.capacity),
      status: course.status,
    });
    setIsCreateOpen(false);
    setEditingCourseId(course.id);
    setError(null);
  }

  function closeEditDialog() {
    setEditingCourseId(null);
    setError(null);
  }

  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Kursy szkoleniowe</h1>
          <p className="mt-2 text-stone-500">Zarządzaj ofertą, cennikiem i dostępnością kursów na prawo jazdy.</p>
        </div>
        <div>
          <Button onClick={openCreateDialog} disabled={Boolean(pendingCourseId)}>
            Dodaj nowy kurs
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-stone-200 pb-4">
        {COURSE_FILTERS.map((option) => {
          const isActive = filter === option;

          return (
            <Button
              key={option}
              variant="ghost"
              size="sm"
              onClick={() => setFilter(option)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium",
                isActive
                  ? "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
                  : "text-stone-500 hover:bg-stone-100 hover:text-stone-900",
              )}
            >
              <span>{filterToLabel(option)}</span>
              <span
                className={cn(
                  "ml-2 inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                  isActive
                    ? "bg-red-200/90 text-red-900"
                    : "bg-stone-200 text-stone-700",
                )}
              >
                {getFilterCount(option)}
              </span>
            </Button>
          );
        })}
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-4">
        {filteredCourses.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-500 shadow-sm">
            Brak kursów dla wybranego filtra.
          </div>
        ) : null}

        {filteredCourses.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-stone-500">
                <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold">Kurs</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Kategoria</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Start</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Czas trwania</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Cena</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Zapisanych</th>
                    <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                    <th scope="col" className="px-6 py-4 text-right font-semibold">Akcje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredCourses.map((course) => {
                    return (
                      <tr key={course.id} className="transition-colors hover:bg-stone-50/50">
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-stone-900">{course.title}</td>
                        <td className="whitespace-nowrap px-6 py-4">{categoryToLabel(course.category)}</td>
                        <td className="whitespace-nowrap px-6 py-4">{formatStartDate(course.startDate)}</td>
                        <td className="whitespace-nowrap px-6 py-4">{course.duration}</td>
                        <td className="whitespace-nowrap px-6 py-4">{formatPrice(course.pricePln)}</td>
                        <td className="whitespace-nowrap px-6 py-4">{getSpotsLabel(course)}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={cn(
                              "inline-flex min-w-25 items-center justify-center rounded-full px-2.5 py-1 text-xs font-medium",
                              statusToClass(course.status),
                            )}
                          >
                            {statusToLabel(course.status)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              disabled={Boolean(pendingCourseId)}
                              onClick={() => openEditDialog(course)}
                            >
                              Edytuj
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-800"
                              disabled={Boolean(pendingCourseId)}
                              onClick={() => deleteCourse(course.id)}
                            >
                              Usuń
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>

      <CourseDialog
        mode="create"
        open={isCreateOpen}
        draft={draft}
        pending={isCreating}
        error={error}
        onClose={closeCreateDialog}
        onChange={setDraft}
        onSubmit={createCourse}
      />

      <CourseDialog
        mode="edit"
        open={Boolean(editingCourseId)}
        draft={draft}
        pending={isSavingEdit}
        error={error}
        onClose={closeEditDialog}
        onChange={setDraft}
        onSubmit={saveEditCourse}
      />
    </div>
  );
}
