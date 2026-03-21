"use client";

import { Button } from "@/components/ui/button";
import type {
  LectureFormState,
  StudentOption,
} from "./instruktor-wyklady-types";

export function InstruktorWykladyFormCard({
  form,
  students,
  incompleteCount,
  allIncompleteSelected,
  saving,
  onChange,
  onToggleSelectAllIncomplete,
  onToggleStudent,
  onSubmit,
}: {
  form: LectureFormState;
  students: StudentOption[];
  incompleteCount: number;
  allIncompleteSelected: boolean;
  saving: boolean;
  onChange: (nextForm: LectureFormState) => void;
  onToggleSelectAllIncomplete: () => void;
  onToggleStudent: (studentId: string, checked: boolean) => void;
  onSubmit: () => void;
}) {
  const selectedSet = new Set(form.selectedStudentIds);

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-stone-900">Nowy wyklad</p>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
            Temat wykładu
          </label>
          <input
            value={form.title}
            onChange={(event) =>
              onChange({ ...form, title: event.target.value })
            }
            placeholder="Np. Skrzyżowania i pierwszeństwo"
            className="h-10 w-full rounded-lg border border-stone-300 px-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
            Typ wykładu
          </label>
          <input
            value={form.topicType}
            onChange={(event) =>
              onChange({ ...form, topicType: event.target.value })
            }
            placeholder="Np. Teoria podstawowa"
            className="h-10 w-full rounded-lg border border-stone-300 px-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
            Termin
          </label>
          <input
            type="datetime-local"
            value={form.startsAt}
            onChange={(event) =>
              onChange({ ...form, startsAt: event.target.value })
            }
            className="h-10 w-full rounded-lg border border-stone-300 px-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
            Czas trwania (min)
          </label>
          <input
            type="number"
            min={30}
            step={30}
            value={form.durationMinutes}
            onChange={(event) =>
              onChange({ ...form, durationMinutes: event.target.value })
            }
            className="h-10 w-full rounded-lg border border-stone-300 px-3 text-sm"
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
          Notatki
        </label>
        <textarea
          value={form.notes}
          onChange={(event) => onChange({ ...form, notes: event.target.value })}
          rows={3}
          placeholder="Opcjonalny opis dla uczestnikow"
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="mt-3 rounded-xl border border-stone-200 p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Kursanci
          </p>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={onToggleSelectAllIncomplete}
            disabled={incompleteCount === 0}
          >
            {allIncompleteSelected
              ? "Odznacz nieukończonych"
              : "Zaznacz nieukończonych"}
          </Button>
        </div>

        <p className="mt-2 text-xs text-stone-500">
          Nieukończone wykłady: {incompleteCount}
        </p>

        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {students.map((student) => (
            <label
              key={student.id}
              className="group flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 px-3 py-2 text-sm transition-colors hover:border-red-200 hover:bg-red-50/40"
            >
              <input
                type="checkbox"
                checked={selectedSet.has(student.id)}
                onChange={(event) =>
                  onToggleStudent(student.id, event.target.checked)
                }
                className="h-4 w-4 rounded border-stone-300 text-red-600 accent-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1"
              />
              <span className="text-stone-800 group-hover:text-stone-900">
                {student.fullName}
                <span className="ml-2 text-xs text-stone-500">
                  ({student.theoryHoursDone}/{student.theoryHoursRequired}h)
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <Button onClick={onSubmit} disabled={saving}>
          Dodaj wykład
        </Button>
      </div>
    </div>
  );
}
