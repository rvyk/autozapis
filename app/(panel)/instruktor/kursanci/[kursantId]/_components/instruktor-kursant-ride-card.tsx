"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TrainingRide } from "./instruktor-kursant-details-types";
import { formatDateTime } from "./instruktor-kursant-details-utils";

export function InstruktorKursantRideCard({
  ride,
  saving,
  savingRideId,
  dirty,
  onUpdateRide,
  onSaveRide,
  onRemoveRide,
}: {
  ride: TrainingRide;
  saving: boolean;
  savingRideId: string | null;
  dirty: boolean;
  onUpdateRide: (rideId: string, patch: Partial<TrainingRide>) => void;
  onSaveRide: (rideId: string) => void;
  onRemoveRide: (rideId: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {formatDateTime(ride.startsAt)} • {ride.durationHours}h
          </p>
          <input
            value={ride.topic}
            onChange={(event) =>
              onUpdateRide(ride.id, { topic: event.target.value })
            }
            className="mt-1 h-10 w-full rounded-lg border border-stone-300 px-3 text-sm font-semibold text-stone-900 outline-none focus:border-red-500"
          />
        </div>

        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:w-auto lg:grid-cols-none lg:auto-cols-max lg:grid-flow-col lg:items-center">
          <Button
            size="sm"
            variant={ride.status === "PLANOWANA" ? "primary" : "ghost"}
            disabled={saving || savingRideId === ride.id}
            onClick={() => onUpdateRide(ride.id, { status: "PLANOWANA" })}
            className="w-full lg:w-auto"
          >
            Planowana
          </Button>
          <Button
            size="sm"
            variant={ride.status === "ZREALIZOWANA" ? "primary" : "ghost"}
            disabled={saving || savingRideId === ride.id}
            onClick={() => onUpdateRide(ride.id, { status: "ZREALIZOWANA" })}
            className="w-full lg:w-auto"
          >
            Zrealizowana
          </Button>
          <Button
            size="sm"
            variant={ride.status === "ODWOLANA" ? "destructiveOutline" : "ghost"}
            disabled={saving || savingRideId === ride.id}
            onClick={() => onUpdateRide(ride.id, { status: "ODWOLANA" })}
            className="w-full lg:w-auto"
          >
            Odwolana
          </Button>
          <Button
            size="sm"
            variant="secondary"
            disabled={saving || savingRideId === ride.id || !dirty}
            onClick={() => onSaveRide(ride.id)}
            className="w-full lg:w-auto"
          >
            {savingRideId === ride.id ? "Zapisywanie..." : "Zapisz zmiany"}
          </Button>
          <Button
            size="sm"
            variant="destructiveOutline"
            disabled={saving || savingRideId === ride.id}
            onClick={() => onRemoveRide(ride.id)}
            className="w-full lg:w-auto"
          >
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
            onChange={(event) =>
              onUpdateRide(ride.id, { startsAt: event.target.value })
            }
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
              onUpdateRide(ride.id, { durationHours });
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
            onChange={(event) =>
              onUpdateRide(ride.id, { route: event.target.value })
            }
            className="h-10 w-full rounded-lg border border-stone-300 px-3 text-sm outline-none focus:border-red-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-stone-500">
          Ocena trasy
        </p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              type="button"
              onClick={() =>
                onUpdateRide(ride.id, {
                  routeScore: score as TrainingRide["routeScore"],
                })
              }
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
          Opinia po jezdzie
        </label>
        <textarea
          rows={3}
          value={ride.instructorNote}
          onChange={(event) =>
            onUpdateRide(ride.id, { instructorNote: event.target.value })
          }
          className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-red-500"
          placeholder="Wpisz ocene i zalecenia dla kursanta..."
        />
      </div>

      {dirty ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
          <p className="text-xs font-medium text-amber-700">
            Masz niezapisane zmiany w tej jezdzie.
          </p>
        </div>
      ) : null}
    </div>
  );
}
