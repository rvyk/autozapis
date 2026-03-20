"use client";

import { Button } from "@/components/ui/button";
import { formatPlDateTimeMedium } from "@/app/_lib/date-format";
import type { AttendanceStatus, LectureItem } from "./instruktor-wyklady-types";
import { getAttendanceStatusLabel } from "./instruktor-wyklady-utils";

export function InstruktorWykladyList({
  lectures,
  loading,
  saving,
  onUpdateAttendance,
}: {
  lectures: LectureItem[];
  loading: boolean;
  saving: boolean;
  onUpdateAttendance: (
    lectureId: string,
    attendanceId: string,
    status: AttendanceStatus,
  ) => void;
}) {
  return (
    <div className="space-y-4">
      {loading ? <p className="text-sm text-stone-500">Ladowanie wykladow...</p> : null}

      {!loading && lectures.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
          <p className="text-sm font-medium text-stone-900">Brak zaplanowanych wykladow.</p>
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
              {formatPlDateTimeMedium(lecture.startsAt)} ({Math.floor(lecture.durationMinutes / 60)}h)
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
                      {getAttendanceStatusLabel(attendee.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant={attendee.status === "PRESENT" ? "primary" : "ghost"}
                          onClick={() => onUpdateAttendance(lecture.id, attendee.attendanceId, "PRESENT")}
                          disabled={saving}
                        >
                          Obecny
                        </Button>
                        <Button
                          size="sm"
                          variant={attendee.status === "ABSENT" ? "primary" : "ghost"}
                          onClick={() => onUpdateAttendance(lecture.id, attendee.attendanceId, "ABSENT")}
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
  );
}
