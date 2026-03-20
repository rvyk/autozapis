"use client";

import { useMemo, useState } from "react";
import { InstruktorKursantDetailsHeader } from "./instruktor-kursant-details-header";
import { InstruktorKursantEmptyRides } from "./instruktor-kursant-empty-rides";
import { InstruktorKursantProgressCard } from "./instruktor-kursant-progress-card";
import { InstruktorKursantRideCard } from "./instruktor-kursant-ride-card";
import type {
  TrainingRide,
  TrainingStudent,
} from "./instruktor-kursant-details-types";
import {
  getCompletedHours,
  sortRidesDescending,
} from "./instruktor-kursant-details-utils";

const SAVE_RIDE_ERROR = "Nie udało się zapisać jazdy.";
const ADD_RIDE_ERROR = "Nie udało się dodać jazdy.";
const REMOVE_RIDE_ERROR = "Nie udało się usunąć jazdy.";

export function InstruktorKursantDetailsPageContent({
  initialStudent,
}: {
  initialStudent: TrainingStudent;
}) {
  const [student, setStudent] = useState(initialStudent);
  const [saving, setSaving] = useState(false);
  const [savingRideId, setSavingRideId] = useState<string | null>(null);
  const [dirtyRideIds, setDirtyRideIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [error, setError] = useState<string | null>(null);

  const sortedRides = useMemo(
    () => sortRidesDescending(student.rides),
    [student.rides],
  );
  const completedHours = useMemo(
    () => getCompletedHours(student.rides),
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
        setError(SAVE_RIDE_ERROR);
        return;
      }

      setStudent((current) => ({
        ...current,
        rides: current.rides.map((ride) =>
          ride.id === nextRide.id ? (payload.ride ?? ride) : ride,
        ),
      }));

      setDirtyRideIds((current) => {
        const next = new Set(current);
        next.delete(nextRide.id);
        return next;
      });
    } catch {
      setError(SAVE_RIDE_ERROR);
    } finally {
      setSavingRideId(null);
    }
  }

  function updateRide(rideId: string, patch: Partial<TrainingRide>) {
    const existingRide = student.rides.find((ride) => ride.id === rideId);
    if (!existingRide) return;

    const mergedRide = { ...existingRide, ...patch };

    setStudent((current) => ({
      ...current,
      rides: current.rides.map((ride) =>
        ride.id === rideId ? mergedRide : ride,
      ),
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
      const response = await fetch(
        `/api/instructor/students/${student.id}/lessons`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startsAt: new Date().toISOString().slice(0, 16),
            durationHours: 1,
            topic: "Nowa jazda",
            route: "",
          }),
        },
      );

      const payload = (await response.json().catch(() => null)) as {
        ride?: TrainingRide;
      } | null;

      if (!response.ok || !payload?.ride) {
        setError(ADD_RIDE_ERROR);
        return;
      }

      setStudent((current) => ({
        ...current,
        rides: [payload.ride as TrainingRide, ...current.rides],
      }));
    } catch {
      setError(ADD_RIDE_ERROR);
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
        setError(REMOVE_RIDE_ERROR);
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
      setError(REMOVE_RIDE_ERROR);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <InstruktorKursantDetailsHeader
        student={student}
        saving={saving}
        onAddRide={() => void addRide()}
      />

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <InstruktorKursantProgressCard
        completedHours={completedHours}
        hoursTarget={student.hoursTarget}
      />

      <div className="space-y-4">
        {sortedRides.length === 0 ? (
          <InstruktorKursantEmptyRides
            saving={saving}
            onAddRide={() => void addRide()}
          />
        ) : null}

        {sortedRides.map((ride) => (
          <InstruktorKursantRideCard
            key={ride.id}
            ride={ride}
            saving={saving}
            savingRideId={savingRideId}
            dirty={dirtyRideIds.has(ride.id)}
            onUpdateRide={updateRide}
            onSaveRide={(rideId) => saveRide(rideId)}
            onRemoveRide={(rideId) => void removeRide(rideId)}
          />
        ))}
      </div>
    </div>
  );
}
