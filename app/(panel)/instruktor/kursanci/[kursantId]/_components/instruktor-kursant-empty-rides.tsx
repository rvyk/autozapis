"use client";

import { Button } from "@/components/ui/button";

export function InstruktorKursantEmptyRides({
  saving,
  onAddRide,
}: {
  saving: boolean;
  onAddRide: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-10 text-center shadow-sm">
      <p className="text-base font-semibold text-stone-900">Brak jazd dla tego kursanta</p>
      <p className="mt-2 text-sm text-stone-500">
        Dodaj pierwsza jazde, aby ustawic termin, trase i liczbe godzin.
      </p>
      <div className="mt-5 flex justify-center">
        <Button size="sm" onClick={onAddRide} disabled={saving}>
          Dodaj pierwsza jazde
        </Button>
      </div>
    </div>
  );
}
