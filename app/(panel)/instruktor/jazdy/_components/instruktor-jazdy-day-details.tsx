"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPlDateFull, formatPlTime } from "@/app/_lib/date-format";
import type { CalendarRide } from "./instruktor-jazdy-types";

export function InstruktorJazdyDayDetails({
  selectedDateKey,
  selectedRides,
}: {
  selectedDateKey: string | null;
  selectedRides: CalendarRide[];
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">Szczegoly dnia</h2>

      {!selectedDateKey ? (
        <p className="mt-3 text-sm text-stone-500">Kliknij dzien w kalendarzu, aby zobaczyc zaplanowane jazdy.</p>
      ) : null}

      {selectedDateKey ? (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {formatPlDateFull(selectedDateKey)}
          </p>

          <div className="mt-3 space-y-3">
            {selectedRides.length === 0 ? <p className="text-sm text-stone-500">Brak jazd w tym dniu.</p> : null}

            {selectedRides.map((ride) => (
              <div key={ride.id} className="rounded-xl border border-stone-200 p-3">
                <p className="text-sm font-semibold text-stone-900">{ride.studentName}</p>
                <p className="text-xs text-stone-500">
                  {formatPlTime(ride.startsAt)} - {ride.durationHours}h
                </p>
                <p className="mt-1 text-sm text-stone-600">{ride.topic}</p>
                {ride.route ? <p className="mt-1 text-xs text-stone-500">Trasa: {ride.route}</p> : null}
                <div className="mt-2">
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/instruktor/kursanci/${ride.studentId}`}>Przejdz do profilu</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
