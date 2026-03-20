"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/app/_components/dashboard/section-header";
import { InstruktorWykladyFormCard } from "./instruktor-wyklady-form-card";
import { InstruktorWykladyList } from "./instruktor-wyklady-list";
import {
  DEFAULT_LECTURE_FORM,
  type AttendanceStatus,
  type LectureFormState,
  type LectureItem,
  type StudentOption,
} from "./instruktor-wyklady-types";
import {
  getStudentsWithoutCompletedTheory,
  toggleAllIncompleteStudentsSelection,
  toggleStudentInSelection,
} from "./instruktor-wyklady-utils";

const LOAD_LECTURES_ERROR = "Nie udało się pobrać wykładów.";
const CREATE_LECTURE_ERROR = "Nie udało się utworzyć wykładu.";
const ATTENDANCE_ERROR = "Nie udało się zapisać obecności.";

function mapCreateLectureError(errorCode: string | undefined) {
  if (errorCode === "NO_STUDENTS") {
    return "Wybierz przynajmniej jednego kursanta przed dodaniem wykładu.";
  }

  if (errorCode === "INVALID_PAYLOAD") {
    return "Uzupełnij wszystkie wymagane pola wykładu (temat, typ, termin, czas).";
  }

  return CREATE_LECTURE_ERROR;
}

export function InstruktorWykladyPageContent({
  students,
}: {
  students: StudentOption[];
}) {
  const [lectures, setLectures] = useState<LectureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<LectureFormState>(DEFAULT_LECTURE_FORM);

  const studentsWithoutCompletedTheory = useMemo(
    () => getStudentsWithoutCompletedTheory(students),
    [students],
  );

  const allIncompleteSelected = useMemo(() => {
    const selectedSet = new Set(form.selectedStudentIds);
    return (
      studentsWithoutCompletedTheory.length > 0 &&
      studentsWithoutCompletedTheory.every((student) =>
        selectedSet.has(student.id),
      )
    );
  }, [studentsWithoutCompletedTheory, form.selectedStudentIds]);

  async function loadLectures() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/instructor/lectures", {
        cache: "no-store",
      });
      const payload = (await response.json().catch(() => null)) as {
        lectures?: LectureItem[];
      } | null;

      if (!response.ok || !payload?.lectures) {
        setError(LOAD_LECTURES_ERROR);
        setLectures([]);
        return;
      }

      setLectures(payload.lectures);
    } catch {
      setError(LOAD_LECTURES_ERROR);
      setLectures([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadLectures();
  }, []);

  async function createLecture() {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/instructor/lectures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          topicType: form.topicType,
          startsAt: form.startsAt,
          durationMinutes: Number(form.durationMinutes),
          notes: form.notes,
          studentIds: form.selectedStudentIds,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(mapCreateLectureError(payload?.error));
        return;
      }

      setForm(DEFAULT_LECTURE_FORM);
      await loadLectures();
    } catch {
      setError(CREATE_LECTURE_ERROR);
    } finally {
      setSaving(false);
    }
  }

  async function updateAttendance(
    lectureId: string,
    attendanceId: string,
    status: AttendanceStatus,
  ) {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/instructor/lectures/${lectureId}/attendance/${attendanceId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );

      if (!response.ok) {
        setError(ATTENDANCE_ERROR);
        return;
      }

      await loadLectures();
    } catch {
      setError(ATTENDANCE_ERROR);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <SectionHeader
        title="Wykłady"
        description="Planuj wykłady teoretyczne i zaznaczaj obecność kursantów."
      />

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <InstruktorWykladyFormCard
        form={form}
        students={students}
        incompleteCount={studentsWithoutCompletedTheory.length}
        allIncompleteSelected={allIncompleteSelected}
        saving={saving}
        onChange={setForm}
        onToggleSelectAllIncomplete={() =>
          setForm((current) => ({
            ...current,
            selectedStudentIds: toggleAllIncompleteStudentsSelection(
              current.selectedStudentIds,
              studentsWithoutCompletedTheory,
            ),
          }))
        }
        onToggleStudent={(studentId, checked) =>
          setForm((current) => ({
            ...current,
            selectedStudentIds: toggleStudentInSelection(
              current.selectedStudentIds,
              studentId,
              checked,
            ),
          }))
        }
        onSubmit={() => void createLecture()}
      />

      <InstruktorWykladyList
        lectures={lectures}
        loading={loading}
        saving={saving}
        onUpdateAttendance={(lectureId, attendanceId, status) =>
          void updateAttendance(lectureId, attendanceId, status)
        }
      />
    </div>
  );
}
