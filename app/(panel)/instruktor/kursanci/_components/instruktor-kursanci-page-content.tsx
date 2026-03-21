"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/app/_components/dashboard/section-header";
import { InstruktorKursanciAssignPanel } from "./instruktor-kursanci-assign-panel";
import { InstruktorKursanciFilterTabs } from "./instruktor-kursanci-filter-tabs";
import { InstruktorKursanciTable } from "./instruktor-kursanci-table";
import type {
  InstructorStudentFilter,
  StudentItem,
} from "./instruktor-kursanci-types";
import {
  getFilteredStudents,
  getFilteredUnassignedStudents,
} from "./instruktor-kursanci-utils";

const LOAD_ERROR = "Nie udało się pobrać kursantów. Spróbuj odświeżyć stronę.";
const ASSIGNMENT_ERROR = "Nie udało się zmienić przypisania kursanta.";

export function InstruktorKursanciPageContent() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<InstructorStudentFilter>("MOI");
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [assignQuery, setAssignQuery] = useState("");

  useEffect(() => {
    async function loadStudents() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/instructor/students", {
          cache: "no-store",
        });

        const payload = (await response.json().catch(() => null)) as {
          students?: StudentItem[];
        } | null;

        if (!response.ok || !payload?.students) {
          setError(LOAD_ERROR);
          setStudents([]);
          return;
        }

        setStudents(payload.students);
      } catch {
        setError(LOAD_ERROR);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    }

    void loadStudents();
  }, []);

  const filteredStudents = useMemo(
    () => getFilteredStudents(students, filter),
    [students, filter],
  );

  const filteredUnassigned = useMemo(
    () => getFilteredUnassignedStudents(students, assignQuery),
    [students, assignQuery],
  );

  async function toggleAssignment(student: StudentItem) {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/instructor/students/${student.id}/assignment`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: student.assignedToMe ? "UNASSIGN_FROM_ME" : "ASSIGN_TO_ME",
          }),
        },
      );

      const payload = (await response.json().catch(() => null)) as {
        assignedToMe?: boolean;
      } | null;

      if (!response.ok || typeof payload?.assignedToMe !== "boolean") {
        setError(ASSIGNMENT_ERROR);
        return;
      }

      setStudents((current) => {
        if (payload.assignedToMe) {
          return current.map((item) =>
            item.id === student.id
              ? {
                  ...item,
                  assignedToMe: true,
                  assignedToAnyone: true,
                }
              : item,
          );
        }

        return current.map((item) =>
          item.id === student.id
            ? { ...item, assignedToMe: false, assignedToAnyone: false }
            : item,
        );
      });
    } catch {
      setError(ASSIGNMENT_ERROR);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <SectionHeader
        title="Moi kursanci"
        description="Wejdź w profil kursanta, by planować jazdy, uzupełniać opinie i aktualizować godziny."
        actions={
          <InstruktorKursanciFilterTabs filter={filter} onChange={setFilter} />
        }
      />

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <InstruktorKursanciAssignPanel
        open={isAssignOpen}
        query={assignQuery}
        students={filteredUnassigned}
        saving={saving}
        onToggleOpen={() => setIsAssignOpen((current) => !current)}
        onQueryChange={setAssignQuery}
        onAssign={(student) => void toggleAssignment(student)}
      />

      <InstruktorKursanciTable
        students={filteredStudents}
        loading={loading}
        saving={saving}
        onToggleAssignment={(student) => void toggleAssignment(student)}
      />
    </div>
  );
}
