"use client";

import { Button } from "@/components/ui/button";
import type { LectureFormState, StudentOption } from "./instruktor-wyklady-types";

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
            Temat wykladu
          </label>
          <input
            value={form.title}
            onChange={(event) => onChange({ ...form, title: event.target.value })}
            placeholder="Np. Skrzyzowania i pierwszenstwo"
            className="h-10 w-full rounded-lg border border-stone-300 px-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
            Typ wykladu
          </label>
          <input
            value={form.topicType}
            onChange={(event) => onChange({ ...form, topicType: event.target.value })}
            placeholder="Np. Teoria podstawowa"
            className="h-10 w-full rounded-lg border border-stone-300 px-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Termin</label>
          <input
            type="datetime-local"
            value={form.startsAt}
            onChange={(event) => onChange({ ...form, startsAt: event.target.value })}
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
            onChange={(event) => onChange({ ...form, durationMinutes: event.target.value })}
            className="h-10 w-full rounded-lg border border-stone-300 px-3 text-sm"
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">Notatki</label>
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
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Kursanci</p>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={onToggleSelectAllIncomplete}
            disabled={incompleteCount === 0}
          >
            {allIncompleteSelected ? "Odznacz nieukonczonych" : "Zaznacz nieukonczonych"}
          </Button>
        </div>

        <p className="mt-2 text-xs text-stone-500">Nieukonczone wyklady: {incompleteCount}</p>

        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {students.map((student) => (
            <label
              key={student.id}
              className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={selectedSet.has(student.id)}
                onChange={(event) => onToggleStudent(student.id, event.target.checked)}
              />
              <span>
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
          Dodaj wyklad
        </Button>
      </div>
    </div>
  );
}
