"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CalendarRide = {
  id: string;
  studentId: string;
  studentName: string;
  startsAt: string;
  topic: string;
  route: string;
  durationHours: number;
  status?: "PLANOWANA" | "ZREALIZOWANA" | "ODWOLANA";
};

function getMonthDays(year: number, month: number) {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const days: Date[] = [];

  for (let day = 1; day <= end.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }

  const leadingEmpty = (start.getDay() + 6) % 7;

  return { days, leadingEmpty };
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "full",
  }).format(new Date(value));
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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
        const response = await fetch("/api/instructor/lessons", {
          cache: "no-store",
        });

        const payload = (await response.json().catch(() => null)) as {
          rides?: CalendarRide[];
        } | null;

        if (!response.ok || !payload?.rides) {
          setError("Nie udalo sie pobrac harmonogramu jazd.");
          setPlannedRides([]);
          return;
        }

        setPlannedRides(payload.rides);
      } catch {
        setError("Nie udalo sie pobrac harmonogramu jazd.");
        setPlannedRides([]);
      } finally {
        setLoading(false);
      }
    }

    void loadRides();
  }, []);

  const ridesByDay = useMemo(() => {
    const map = new Map<string, CalendarRide[]>();

    for (const ride of plannedRides) {
      const key = toDateKey(new Date(ride.startsAt));
      const existing = map.get(key) ?? [];
      existing.push(ride);
      map.set(key, existing);
    }

    for (const [key, value] of map.entries()) {
      map.set(
        key,
        [...value].sort(
          (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
        ),
      );
    }

    return map;
  }, [plannedRides]);

  const { days, leadingEmpty } = useMemo(
    () => getMonthDays(displayDate.getFullYear(), displayDate.getMonth()),
    [displayDate],
  );

  const selectedRides = selectedDateKey ? (ridesByDay.get(selectedDateKey) ?? []) : [];

  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Moj harmonogram</h1>
          <p className="mt-2 text-stone-500">
            Przegladaj kalendarz jazd i klikaj dzien, aby zobaczyc szczegoly zaplanowanych spotkan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setDisplayDate(
                (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
              )
            }
          >
            Poprzedni
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setDisplayDate(
                (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
              )
            }
          >
            Nastepny
          </Button>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900">{formatMonthLabel(displayDate)}</h2>

          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-stone-500">
            {["Pon", "Wt", "Sr", "Czw", "Pt", "Sob", "Nd"].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-2">
            {Array.from({ length: leadingEmpty }).map((_, index) => (
              <div key={`empty-${index}`} className="h-22 rounded-xl bg-stone-50" />
            ))}

            {days.map((day) => {
              const key = toDateKey(day);
              const rides = ridesByDay.get(key) ?? [];
              const isSelected = selectedDateKey === key;
              const isToday = key === toDateKey(new Date());

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDateKey(key)}
                  className={cn(
                    "h-22 rounded-xl border p-2 text-left transition-colors",
                    isSelected
                      ? "border-red-300 bg-red-50"
                      : "border-stone-200 bg-white hover:bg-stone-50",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        isToday ? "text-red-700" : "text-stone-700",
                      )}
                    >
                      {day.getDate()}
                    </span>
                    {rides.length > 0 ? (
                      <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">
                        {rides.length}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 space-y-1">
                    {rides.slice(0, 2).map((ride) => (
                      <p key={ride.id} className="truncate text-[11px] text-stone-600">
                        {formatTime(ride.startsAt)} {ride.studentName}
                      </p>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {loading ? <p className="mt-3 text-sm text-stone-500">Ladowanie jazd...</p> : null}
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900">Szczegoly dnia</h2>
          {!selectedDateKey ? (
            <p className="mt-3 text-sm text-stone-500">
              Kliknij dzien w kalendarzu, aby zobaczyc zaplanowane jazdy.
            </p>
          ) : null}

          {selectedDateKey ? (
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                {formatDate(selectedDateKey)}
              </p>

              <div className="mt-3 space-y-3">
                {selectedRides.length === 0 ? (
                  <p className="text-sm text-stone-500">Brak jazd w tym dniu.</p>
                ) : null}

                {selectedRides.map((ride) => (
                  <div key={ride.id} className="rounded-xl border border-stone-200 p-3">
                    <p className="text-sm font-semibold text-stone-900">{ride.studentName}</p>
                    <p className="text-xs text-stone-500">
                      {formatTime(ride.startsAt)} - {ride.durationHours}h
                    </p>
                    <p className="mt-1 text-sm text-stone-600">{ride.topic}</p>
                    {ride.route ? (
                      <p className="mt-1 text-xs text-stone-500">Trasa: {ride.route}</p>
                    ) : null}
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
      </div>
    </div>
  );
}
