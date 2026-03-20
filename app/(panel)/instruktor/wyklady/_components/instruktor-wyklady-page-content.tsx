"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/app/_components/dashboard/section-header";
import { Button } from "@/components/ui/button";

type StudentOption = {
  id: string;
  fullName: string;
  phone: string;
  theoryHoursDone: number;
  theoryHoursRequired: number;
  completedTheory: boolean;
};

type AttendanceStatus = "ENROLLED" | "PRESENT" | "ABSENT";

type LectureItem = {
  id: string;
  title: string;
  topicType: string;
  startsAt: string;
  durationMinutes: number;
  notes: string;
  attendees: {
    attendanceId: string;
    status: AttendanceStatus;
    creditedMinutes: number;
    student: {
      id: string;
      fullName: string;
      phone: string;
    };
  }[];
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
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

  const [title, setTitle] = useState("");
  const [topicType, setTopicType] = useState("Teoria podstawowa");
  const [startsAt, setStartsAt] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("120");
  const [notes, setNotes] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  async function loadLectures() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/instructor/lectures", { cache: "no-store" });
      const payload = (await response.json().catch(() => null)) as {
        lectures?: LectureItem[];
      } | null;

      if (!response.ok || !payload?.lectures) {
        setError("Nie udało się pobrać wykładów.");
        setLectures([]);
        return;
      }

      setLectures(payload.lectures);
    } catch {
      setError("Nie udało się pobrać wykładów.");
      setLectures([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadLectures();
  }, []);

  const selectedSet = useMemo(() => new Set(selectedStudentIds), [selectedStudentIds]);
  const studentsWithoutCompletedTheory = useMemo(
    () => students.filter((student) => !student.completedTheory),
    [students],
  );

  const allIncompleteSelected =
    studentsWithoutCompletedTheory.length > 0 &&
    studentsWithoutCompletedTheory.every((student) => selectedSet.has(student.id));

  function toggleSelectAllIncomplete() {
    if (allIncompleteSelected) {
      setSelectedStudentIds((current) =>
        current.filter(
          (id) => !studentsWithoutCompletedTheory.some((student) => student.id === id),
        ),
      );
      return;
    }

    setSelectedStudentIds((current) => {
      const next = new Set(current);
      for (const student of studentsWithoutCompletedTheory) {
        next.add(student.id);
      }
      return [...next];
    });
  }

  async function createLecture() {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/instructor/lectures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          topicType,
          startsAt,
          durationMinutes: Number(durationMinutes),
          notes,
          studentIds: selectedStudentIds,
        }),
      });

      if (!response.ok) {
        setError("Nie udało się utworzyć wykładu.");
        return;
      }

      setTitle("");
      setTopicType("Teoria podstawowa");
      setStartsAt("");
      setDurationMinutes("120");
      setNotes("");
      setSelectedStudentIds([]);
      await loadLectures();
    } catch {
      setError("Nie udało się utworzyć wykładu.");
    } finally {
      setSaving(false);
    }
  }

  async function updateAttendance(lectureId: string, attendanceId: string, status: AttendanceStatus) {
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
        setError("Nie udało się zapisać obecności.");
        return;
      }

      await loadLectures();
    } catch {
      setError("Nie udało się zapisać obecności.");
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

      <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-stone-900">Nowy wykład</p>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
              Temat wykładu
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Np. Skrzyżowania i pierwszeństwo"
              className="h-10 w-full rounded-lg border border-stone-300 px-3 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
              Typ wykładu
            </label>
            <input
              value={topicType}
              onChange={(event) => setTopicType(event.target.value)}
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
              value={startsAt}
              onChange={(event) => setStartsAt(event.target.value)}
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
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(event.target.value)}
              className="h-10 w-full rounded-lg border border-stone-300 px-3 text-sm"
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
            Notatki
          </label>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            placeholder="Opcjonalny opis dla uczestników"
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
              onClick={toggleSelectAllIncomplete}
              disabled={studentsWithoutCompletedTheory.length === 0}
            >
              {allIncompleteSelected
                ? "Odznacz nieukończonych"
                : "Zaznacz nieukończonych"}
            </Button>
          </div>
          <p className="mt-2 text-xs text-stone-500">
            Nieukończone wykłady: {studentsWithoutCompletedTheory.length}
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {students.map((student) => {
              const checked = selectedSet.has(student.id);
              return (
                <label key={student.id} className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setSelectedStudentIds((current) => [...current, student.id]);
                      } else {
                        setSelectedStudentIds((current) => current.filter((id) => id !== student.id));
                      }
                    }}
                  />
                  <span>
                    {student.fullName}
                    <span className="ml-2 text-xs text-stone-500">
                      ({student.theoryHoursDone}/{student.theoryHoursRequired}h)
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <Button onClick={() => void createLecture()} disabled={saving}>
            Dodaj wykład
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? <p className="text-sm text-stone-500">Ładowanie wykładów...</p> : null}

        {!loading && lectures.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
            <p className="text-sm font-medium text-stone-900">Brak zaplanowanych wykładów.</p>
          </div>
        ) : null}

        {lectures.map((lecture) => (
          <div key={lecture.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-red-600">{lecture.topicType}</p>
                <h3 className="text-lg font-semibold text-stone-900">{lecture.title}</h3>
              </div>
              <p className="text-sm text-stone-500">
                {formatDateTime(lecture.startsAt)} ({Math.floor(lecture.durationMinutes / 60)}h)
              </p>
            </div>

            {lecture.notes ? <p className="mt-2 text-sm text-stone-600">{lecture.notes}</p> : null}

            <div className="mt-4 overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-xs uppercase text-stone-500">
                  <tr>
                    <th className="px-4 py-3">Kursant</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Akcje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {lecture.attendees.map((attendee) => (
                    <tr key={attendee.attendanceId}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-stone-900">{attendee.student.fullName}</p>
                        <p className="text-xs text-stone-500">tel. {attendee.student.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-stone-600">
                        {attendee.status === "PRESENT"
                          ? "Obecny"
                          : attendee.status === "ABSENT"
                            ? "Nieobecny"
                            : "Zapisany"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant={attendee.status === "PRESENT" ? "primary" : "ghost"}
                            onClick={() => void updateAttendance(lecture.id, attendee.attendanceId, "PRESENT")}
                            disabled={saving}
                          >
                            Obecny
                          </Button>
                          <Button
                            size="sm"
                            variant={attendee.status === "ABSENT" ? "primary" : "ghost"}
                            onClick={() => void updateAttendance(lecture.id, attendee.attendanceId, "ABSENT")}
                            disabled={saving}
                          >
                            Nieobecny
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
