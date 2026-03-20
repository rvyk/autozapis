"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/app/_components/dashboard/section-header";
import { InstruktorJazdyCalendar } from "./instruktor-jazdy-calendar";
import { InstruktorJazdyDayDetails } from "./instruktor-jazdy-day-details";
import { InstruktorJazdyHeaderActions } from "./instruktor-jazdy-header-actions";
import { InstruktorJazdySummary } from "./instruktor-jazdy-summary";
import type { CalendarItem, CalendarLecture, CalendarRide } from "./instruktor-jazdy-types";
import { getMonthDays, groupCalendarItemsByDay } from "./instruktor-jazdy-utils";

const LOAD_ERROR = "Nie udalo sie pobrac harmonogramu.";

export function InstruktorJazdyPageContent() {
  const [displayDate, setDisplayDate] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [plannedRides, setPlannedRides] = useState<CalendarRide[]>([]);
  const [plannedLectures, setPlannedLectures] = useState<CalendarLecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRides() {
      setLoading(true);
      setError(null);

      try {
        const [ridesResponse, lecturesResponse] = await Promise.all([
          fetch("/api/instructor/lessons", { cache: "no-store" }),
          fetch("/api/instructor/lectures", { cache: "no-store" }),
        ]);

        const ridesPayload = (await ridesResponse.json().catch(() => null)) as {
          rides?: CalendarRide[];
        } | null;

        const lecturesPayload = (await lecturesResponse.json().catch(() => null)) as {
          lectures?: {
            id: string;
            title: string;
            topicType: string;
            startsAt: string;
            durationMinutes: number;
          }[];
        } | null;

        if (!ridesResponse.ok || !ridesPayload?.rides || !lecturesResponse.ok || !lecturesPayload?.lectures) {
          setError(LOAD_ERROR);
          setPlannedRides([]);
          setPlannedLectures([]);
          return;
        }

        setPlannedRides(ridesPayload.rides);
        setPlannedLectures(
          lecturesPayload.lectures.map((lecture) => ({
            id: lecture.id,
            title: lecture.title,
            topicType: lecture.topicType,
            startsAt: lecture.startsAt,
            durationHours: Math.max(1, Math.round(lecture.durationMinutes / 60)),
          })),
        );
      } catch {
        setError(LOAD_ERROR);
        setPlannedRides([]);
        setPlannedLectures([]);
      } finally {
        setLoading(false);
      }
    }

    void loadRides();
  }, []);

  const calendarItems = useMemo<CalendarItem[]>(() => {
    const rideItems: CalendarItem[] = plannedRides.map((ride) => ({
      kind: "ride",
      id: ride.id,
      startsAt: ride.startsAt,
      label: ride.studentName,
      details: `${ride.durationHours}h`,
      href: `/instruktor/kursanci/${ride.studentId}`,
      subtitle: ride.topic,
    }));

    const lectureItems: CalendarItem[] = plannedLectures.map((lecture) => ({
      kind: "lecture",
      id: lecture.id,
      startsAt: lecture.startsAt,
      label: `Wyklad: ${lecture.title}`,
      details: `${lecture.durationHours}h`,
      href: "/instruktor/wyklady",
      subtitle: lecture.topicType,
    }));

    return [...rideItems, ...lectureItems];
  }, [plannedRides, plannedLectures]);

  const itemsByDay = useMemo(
    () => groupCalendarItemsByDay(calendarItems),
    [calendarItems],
  );

  const { days, leadingEmpty } = useMemo(
    () => getMonthDays(displayDate.getFullYear(), displayDate.getMonth()),
    [displayDate],
  );

  const selectedItems = selectedDateKey ? (itemsByDay.get(selectedDateKey) ?? []) : [];

  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <SectionHeader
        title="Moj harmonogram"
        description="Przegladaj kalendarz jazd i wykladow i klikaj dzien, aby zobaczyc szczegoly zaplanowanych spotkan."
        actions={
          <InstruktorJazdyHeaderActions
            onPrevious={() =>
              setDisplayDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
            }
            onNext={() =>
              setDisplayDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
            }
          />
        }
      />

      <InstruktorJazdySummary
        plannedRidesCount={plannedRides.length}
        plannedLecturesCount={plannedLectures.length}
      />

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <InstruktorJazdyCalendar
          displayDate={displayDate}
          days={days}
          leadingEmpty={leadingEmpty}
          selectedDateKey={selectedDateKey}
          itemsByDay={itemsByDay}
          loading={loading}
          onSelectDay={setSelectedDateKey}
        />

        <InstruktorJazdyDayDetails selectedDateKey={selectedDateKey} selectedItems={selectedItems} />
      </div>
    </div>
  );
}
