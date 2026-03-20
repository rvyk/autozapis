"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/app/_components/dashboard/section-header";
import { InstruktorJazdyCalendar } from "./instruktor-jazdy-calendar";
import { InstruktorJazdyDayDetails } from "./instruktor-jazdy-day-details";
import { InstruktorJazdyHeaderActions } from "./instruktor-jazdy-header-actions";
import { InstruktorJazdySummary } from "./instruktor-jazdy-summary";
import type { CalendarRide } from "./instruktor-jazdy-types";
import { getMonthDays, groupRidesByDay } from "./instruktor-jazdy-utils";

const LOAD_ERROR = "Nie udalo sie pobrac harmonogramu jazd.";

export function InstruktorJazdyPageContent() {
  const [displayDate, setDisplayDate] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [plannedRides, setPlannedRides] = useState<CalendarRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRides() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/instructor/lessons", { cache: "no-store" });
        const payload = (await response.json().catch(() => null)) as {
          rides?: CalendarRide[];
        } | null;

        if (!response.ok || !payload?.rides) {
          setError(LOAD_ERROR);
          setPlannedRides([]);
          return;
        }

        setPlannedRides(payload.rides);
      } catch {
        setError(LOAD_ERROR);
        setPlannedRides([]);
      } finally {
        setLoading(false);
      }
    }

    void loadRides();
  }, []);

  const ridesByDay = useMemo(() => groupRidesByDay(plannedRides), [plannedRides]);

  const { days, leadingEmpty } = useMemo(
    () => getMonthDays(displayDate.getFullYear(), displayDate.getMonth()),
    [displayDate],
  );

  const selectedRides = selectedDateKey ? (ridesByDay.get(selectedDateKey) ?? []) : [];

  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <SectionHeader
        title="Moj harmonogram"
        description="Przegladaj kalendarz jazd i klikaj dzien, aby zobaczyc szczegoly zaplanowanych spotkan."
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

      <InstruktorJazdySummary plannedRidesCount={plannedRides.length} />

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <InstruktorJazdyCalendar
          displayDate={displayDate}
          days={days}
          leadingEmpty={leadingEmpty}
          selectedDateKey={selectedDateKey}
          ridesByDay={ridesByDay}
          loading={loading}
          onSelectDay={setSelectedDateKey}
        />

        <InstruktorJazdyDayDetails selectedDateKey={selectedDateKey} selectedRides={selectedRides} />
      </div>
    </div>
  );
}
