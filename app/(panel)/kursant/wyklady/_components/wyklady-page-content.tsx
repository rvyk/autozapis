"use client";

import { useMemo } from "react";
import { SectionHeader } from "@/app/_components/dashboard/section-header";
import { formatPlDateTimeMedium } from "@/app/_lib/date-format";
import type { AttendanceStatus, LectureItem } from "./wyklady-types";

function getStatusLabel(status: AttendanceStatus) {
  if (status === "PRESENT") return "Obecny";
  if (status === "ABSENT") return "Nieobecny";
  return "Zapisany";
}

function getStatusClass(status: AttendanceStatus) {
  if (status === "PRESENT") return "bg-green-100 text-green-800";
  if (status === "ABSENT") return "bg-stone-100 text-stone-700";
  return "border border-red-200 bg-red-50 text-red-700";
}

export function WykladyPageContent({
  lectures,
  theoryHoursDone,
  theoryHoursRequired,
}: {
  lectures: LectureItem[];
  theoryHoursDone: number;
  theoryHoursRequired: number;
}) {
  const orderedLectures = useMemo(
    () =>
      [...lectures].sort(
        (a, b) =>
          new Date(a.session.startsAt).getTime() -
          new Date(b.session.startsAt).getTime(),
      ),
    [lectures],
  );

  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <SectionHeader
        title="Harmonogram wykładów"
        description="Bierz udział w zajęciach teoretycznych i buduj postęp godzin teorii."
      />

      <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Postęp teorii
        </p>
        <p className="mt-2 text-2xl font-bold text-stone-900">
          {theoryHoursDone}/{theoryHoursRequired}h
        </p>
        <p className="mt-1 text-xs text-stone-500">
          Zaliczane są tylko wykłady oznaczone przez instruktora jako obecne.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {orderedLectures.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
            <p className="text-sm font-medium text-stone-900">
              Brak zapisanych wykładów.
            </p>
            <p className="mt-1 text-sm text-stone-500">
              Poczekaj na przypisanie przez instruktora.
            </p>
          </div>
        ) : null}

        {orderedLectures.map((lecture) => (
          <div
            key={lecture.attendanceId}
            className="group flex flex-col justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center"
          >
            <div className="w-full sm:w-2/3">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
                {lecture.session.topicType}
              </span>
              <h3 className="text-lg font-semibold text-stone-900">
                {lecture.session.title}
              </h3>
              <p className="mt-1 text-sm text-stone-500">
                {formatPlDateTimeMedium(lecture.session.startsAt)} (
                {Math.floor(lecture.session.durationMinutes / 60)}h)
              </p>
            </div>

            <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(lecture.status)}`}
              >
                {getStatusLabel(lecture.status)}
              </span>
              <span className="rounded-full border border-stone-200 px-2.5 py-1 text-xs font-medium text-stone-600">
                Zaliczone: {Math.floor(lecture.creditedMinutes / 60)}h
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
