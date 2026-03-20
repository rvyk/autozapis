"use client";

import { Button } from "@/components/ui/button";
import type { StudentItem } from "./instruktor-kursanci-types";

export function InstruktorKursanciAssignPanel({
  open,
  query,
  students,
  saving,
  onToggleOpen,
  onQueryChange,
  onAssign,
}: {
  open: boolean;
  query: string;
  students: StudentItem[];
  saving: boolean;
  onToggleOpen: () => void;
  onQueryChange: (query: string) => void;
  onAssign: (student: StudentItem) => void;
}) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50/60 p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-red-900">Przypisz kursanta</p>
          <p className="text-xs text-red-800/80">
            Przy wiekszej liczbie osob skorzystaj z wyszukiwarki i listy przewijanej.
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={onToggleOpen}>
          {open ? "Ukryj liste" : "Otworz liste kursantow"}
        </Button>
      </div>

      {open ? (
        <div className="mt-3 rounded-xl border border-red-100 bg-white p-3">
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Szukaj po imieniu lub telefonie"
            className="h-10 w-full rounded-lg border border-stone-300 px-3 text-sm outline-none focus:border-red-500"
          />

          <div className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-1">
            {students.length === 0 ? (
              <p className="text-xs font-medium text-stone-500">Brak kursantow do przypisania.</p>
            ) : null}

            {students.map((student) => (
              <div
                key={`assign-${student.id}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-semibold text-stone-900">{student.fullName}</p>
                  <p className="text-xs text-stone-500">tel. {student.phone} • kat. {student.category}</p>
                </div>
                <Button size="sm" disabled={saving} onClick={() => onAssign(student)}>
                  Przypisz
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
