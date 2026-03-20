"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  EMPTY_COURSE_DRAFT,
  type CourseDraft,
  type CourseFilter,
  type CourseItem,
} from "./kursy-types";
import {
  filterToStatus,
  getErrorMessage,
} from "./kursy-utils";
import { CourseDialog } from "./course-dialog";
import { KursyFilterTabs } from "./kursy-filter-tabs";
import { KursyTable } from "./kursy-table";

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

      <KursyFilterTabs filter={filter} stats={stats} onChange={setFilter} />

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
          <KursyTable
            courses={filteredCourses}
            pending={Boolean(pendingCourseId)}
            onEdit={openEditDialog}
            onDelete={deleteCourse}
          />
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
