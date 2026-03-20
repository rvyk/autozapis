"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TrainingRide = {
  id: string;
  startsAt: string;
  durationHours: number;
  topic: string;
  route: string;
  status: "PLANOWANA" | "ZREALIZOWANA" | "ODWOLANA";
  instructorNote: string;
  routeScore: 1 | 2 | 3 | 4 | 5;
};

type TrainingStudent = {
  id: string;
  fullName: string;
  phone: string;
  category: "A" | "B";
  hoursTarget: number;
  rides: TrainingRide[];
};

function formatDateTime(value: string) {
  if (!value) return "Do umówienia";
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function InstruktorKursantDetailsPageContent({
  initialStudent,
}: {
  initialStudent: TrainingStudent;
}) {
  const [student, setStudent] = useState(initialStudent);
  const [saving, setSaving] = useState(false);
  const [savingRideId, setSavingRideId] = useState<string | null>(null);
  const [dirtyRideIds, setDirtyRideIds] = useState<Set<string>>(() => new Set());
  const [error, setError] = useState<string | null>(null);

  const sortedRides = useMemo(
    () =>
      [...student.rides].sort((a, b) => {
        if (!a.startsAt && !b.startsAt) return 0;
        if (!a.startsAt) return -1;
        if (!b.startsAt) return 1;
        return new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime();
      }),
    [student.rides],
  );

  const completedHours = useMemo(
    () =>
      student.rides.reduce((total, ride) => {
        if (ride.status === "ODWOLANA") return total;
        return total + Math.max(0, ride.durationHours);
      }, 0),
    [student.rides],
  );

  async function persistRide(nextRide: TrainingRide) {
    setSavingRideId(nextRide.id);
    setError(null);

    try {
      const response = await fetch(`/api/instructor/lessons/${nextRide.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextRide),
      });

      const payload = (await response.json().catch(() => null)) as {
        ride?: TrainingRide;
      } | null;

      if (!response.ok || !payload?.ride) {
        setError("Nie udało się zapisać jazdy.");
        return;
      }

      setStudent((current) => ({
        ...current,
        rides: current.rides.map((ride) =>
          ride.id === nextRide.id ? payload.ride ?? ride : ride,
        ),
      }));

      setDirtyRideIds((current) => {
        const next = new Set(current);
        next.delete(nextRide.id);
        return next;
      });
    } catch {
      setError("Nie udało się zapisać jazdy.");
    } finally {
      setSavingRideId(null);
    }
  }

  function updateRide(rideId: string, patch: Partial<TrainingRide>) {
    const nextRide = student.rides.find((ride) => ride.id === rideId);
    if (!nextRide) return;

    const merged = { ...nextRide, ...patch };

    setStudent((current) => ({
      ...current,
      rides: current.rides.map((ride) => (ride.id === rideId ? merged : ride)),
    }));
    setDirtyRideIds((current) => {
      const next = new Set(current);
      next.add(rideId);
      return next;
    });
  }

  function saveRide(rideId: string) {
    const ride = student.rides.find((currentRide) => currentRide.id === rideId);
    if (!ride) return;
    void persistRide(ride);
  }

  async function addRide() {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/instructor/students/${student.id}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startsAt: new Date().toISOString().slice(0, 16),
          durationHours: 1,
          topic: "Nowa jazda",
          route: "",
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        ride?: TrainingRide;
      } | null;

      if (!response.ok || !payload?.ride) {
        setError("Nie udało się dodać jazdy.");
        return;
      }

      setStudent((current) => ({
        ...current,
        rides: [payload.ride as TrainingRide, ...current.rides],
      }));
    } catch {
      setError("Nie udało się dodać jazdy.");
    } finally {
      setSaving(false);
    }
  }

  async function removeRide(rideId: string) {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/instructor/lessons/${rideId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        setError("Nie udało się usunąć jazdy.");
        return;
      }

      setStudent((current) => ({
        ...current,
        rides: current.rides.filter((ride) => ride.id !== rideId),
      }));
      setDirtyRideIds((current) => {
        const next = new Set(current);
        next.delete(rideId);
        return next;
      });
    } catch {
      setError("Nie udało się usunąć jazdy.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Profil kursanta
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">
            {student.fullName}
          </h1>
          <p className="mt-2 text-stone-500">
            kat. {student.category} • tel. {student.phone}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/instruktor/kursanci">Powrót do listy</Link>
          </Button>
          <Button size="sm" onClick={addRide} disabled={saving}>Dodaj jazdę</Button>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Postep godzin</p>
          <p className="mt-2 text-2xl font-bold text-stone-900">
            {completedHours}/{student.hoursTarget}h
          </p>
          <p className="mt-2 text-xs text-stone-500">Godziny sa liczone automatycznie z dodanych jazd (z wyjatkiem odwolanych).</p>
        </div>
      </div>

      <div className="space-y-4">
        {sortedRides.map((ride) => (
          <div key={ride.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  {formatDateTime(ride.startsAt)} • {ride.durationHours}h
                </p>
                <input
                  value={ride.topic}
                  onChange={(event) => updateRide(ride.id, { topic: event.target.value })}
                  className="mt-1 h-10 w-full rounded-lg border border-stone-300 px-3 text-sm font-semibold text-stone-900 outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={ride.status === "PLANOWANA" ? "primary" : "ghost"}
                  disabled={saving || savingRideId === ride.id}
                  onClick={() => updateRide(ride.id, { status: "PLANOWANA" })}
                >
                  Planowana
                </Button>
                <Button
                  size="sm"
                  variant={ride.status === "ZREALIZOWANA" ? "primary" : "ghost"}
                  disabled={saving || savingRideId === ride.id}
                  onClick={() => updateRide(ride.id, { status: "ZREALIZOWANA" })}
                >
                  Zrealizowana
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={saving || savingRideId === ride.id || !dirtyRideIds.has(ride.id)}
                  onClick={() => saveRide(ride.id)}
                >
                  {savingRideId === ride.id ? "Zapisywanie..." : "Zapisz zmiany"}
                </Button>
                <Button size="sm" variant="destructiveOutline" disabled={saving || savingRideId === ride.id} onClick={() => removeRide(ride.id)}>
                  Usuń
                </Button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Termin
                </label>
                <input
                  type="datetime-local"
                  value={ride.startsAt}
                  onChange={(event) => updateRide(ride.id, { startsAt: event.target.value })}
                  className="h-10 w-full rounded-lg border border-stone-300 px-3 text-sm outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Czas trwania (h)
                </label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  step={1}
                  value={ride.durationHours}
                  onChange={(event) => {
                    const parsed = Number(event.target.value);
                    const durationHours = Number.isFinite(parsed)
                      ? Math.min(8, Math.max(1, Math.floor(parsed)))
                      : 1;
                    updateRide(ride.id, { durationHours });
                  }}
                  className="h-10 w-full rounded-lg border border-stone-300 px-3 text-sm outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Trasa
                </label>
                <input
                  value={ride.route}
                  onChange={(event) => updateRide(ride.id, { route: event.target.value })}
                  className="h-10 w-full rounded-lg border border-stone-300 px-3 text-sm outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-stone-500">Ocena trasy</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => updateRide(ride.id, { routeScore: score as TrainingRide["routeScore"] })}
                    className={cn(
                      "h-8 w-8 rounded-full text-xs font-semibold transition-colors",
                      ride.routeScore >= score
                        ? "bg-red-100 text-red-700"
                        : "bg-stone-100 text-stone-500 hover:bg-stone-200",
                    )}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                Opinia po jeździe
              </label>
              <textarea
                rows={3}
                value={ride.instructorNote}
                onChange={(event) =>
                  updateRide(ride.id, { instructorNote: event.target.value })
                }
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-red-500"
                placeholder="Wpisz ocenę i zalecenia dla kursanta..."
              />
            </div>

            {dirtyRideIds.has(ride.id) ? (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                <p className="text-xs font-medium text-amber-700">Masz niezapisane zmiany w tej jezdzie.</p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
