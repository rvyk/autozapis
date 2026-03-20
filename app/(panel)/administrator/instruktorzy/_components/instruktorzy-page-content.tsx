"use client";

import { useMemo, useState } from "react";
import { InstruktorzyAddForm } from "./instruktorzy-add-form";
import { InstruktorzyFilterTabs } from "./instruktorzy-filter-tabs";
import { InstruktorzyTable } from "./instruktorzy-table";
import type {
  InstructorFilter,
  InstructorListItem,
  InstructorStatus,
} from "./instruktorzy-types";
import { getErrorMessage } from "./instruktorzy-utils";

export function InstruktorzyPageContent({
  initialInstructors,
}: {
  initialInstructors: InstructorListItem[];
}) {
  const [instructors, setInstructors] = useState<InstructorListItem[]>(
    initialInstructors,
  );
  const [filter, setFilter] = useState<InstructorFilter>("WSZYSCY");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newInstructorEmail, setNewInstructorEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => {
    let active = 0;
    let inactive = 0;

    for (const instructor of instructors) {
      if (instructor.status === "AKTYWNY") {
        active += 1;
      } else {
        inactive += 1;
      }
    }

    return {
      all: instructors.length,
      active,
      inactive,
    };
  }, [instructors]);

  const filteredInstructors = useMemo(() => {
    if (filter === "AKTYWNI") {
      return instructors.filter((item) => item.status === "AKTYWNY");
    }

    if (filter === "NIEAKTYWNI") {
      return instructors.filter((item) => item.status === "NIEAKTYWNY");
    }

    return instructors;
  }, [instructors, filter]);

  async function toggleInstructorStatus(instructor: InstructorListItem) {
    setError(null);
    setPendingId(instructor.id);

    const nextStatus: InstructorStatus =
      instructor.status === "AKTYWNY" ? "NIEAKTYWNY" : "AKTYWNY";

    try {
      const response = await fetch(
        `/api/admin/instruktorzy/${instructor.id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        },
      );

      const payload = (await response.json().catch(() => null)) as {
        instruktor?: { status: InstructorStatus };
        error?: string;
      } | null;

      if (!response.ok || !payload?.instruktor) {
        setError(getErrorMessage(payload?.error ?? null));
        return;
      }

      setInstructors((current) =>
        current.map((item) =>
          item.id === instructor.id
            ? { ...item, status: payload.instruktor?.status ?? item.status }
            : item,
        ),
      );
    } catch {
      setError(getErrorMessage(null));
    } finally {
      setPendingId(null);
    }
  }

  async function addInstructor() {
    setError(null);

    if (!newInstructorEmail.trim()) {
      setError("Podaj poprawny adres e-mail.");
      return;
    }

    setIsAdding(true);

    try {
      const response = await fetch("/api/admin/instruktorzy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newInstructorEmail }),
      });

      const payload = (await response.json().catch(() => null)) as {
        instructor?: InstructorListItem;
        error?: string;
      } | null;

      if (!response.ok || !payload?.instructor) {
        setError(getErrorMessage(payload?.error ?? null));
        return;
      }

      setInstructors((current) => [payload.instructor as InstructorListItem, ...current]);
      setNewInstructorEmail("");
    } catch {
      setError(getErrorMessage(null));
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Instruktorzy
          </h1>
          <p className="mt-2 text-stone-500">
            Zarzadzaj zespolem instruktorow prowadzacych jazdy i wyklady.
          </p>
        </div>
        <div className="text-sm text-stone-500">
          Aktywni: {stats.active} / {stats.all}
        </div>
      </div>

      <InstruktorzyAddForm
        email={newInstructorEmail}
        pending={isAdding}
        disabled={Boolean(pendingId)}
        onEmailChange={setNewInstructorEmail}
        onSubmit={addInstructor}
      />

      <InstruktorzyFilterTabs
        filter={filter}
        stats={stats}
        onChange={setFilter}
      />

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <InstruktorzyTable
        instructors={filteredInstructors}
        pendingId={pendingId}
        onToggleStatus={toggleInstructorStatus}
      />
    </div>
  );
}
