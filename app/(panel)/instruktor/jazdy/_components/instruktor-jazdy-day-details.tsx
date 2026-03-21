"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPlDateFull, formatPlTime } from "@/app/_lib/date-format";
import type { CalendarItem } from "./instruktor-jazdy-types";

export function InstruktorJazdyDayDetails({
  selectedDateKey,
  selectedItems,
}: {
  selectedDateKey: string | null;
  selectedItems: CalendarItem[];
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">Szczegoly dnia</h2>

      {!selectedDateKey ? (
        <p className="mt-3 text-sm text-stone-500">
          Kliknij dzień w kalendarzu, aby zobaczyć zaplanowane jazdy.
        </p>
      ) : null}

      {selectedDateKey ? (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {formatPlDateFull(selectedDateKey)}
          </p>

          <div className="mt-3 space-y-3">
            {selectedItems.length === 0 ? (
              <p className="text-sm text-stone-500">
                Brak zaplanowanych zajec w tym dniu.
              </p>
            ) : null}

            {selectedItems.map((item) => (
              <div
                key={`${item.kind}-${item.id}`}
                className="rounded-xl border border-stone-200 p-3"
              >
                <p className="text-sm font-semibold text-stone-900">
                  {item.label}
                </p>
                <p className="text-xs text-stone-500">
                  {formatPlTime(item.startsAt)} - {item.details}
                </p>
                {item.subtitle ? (
                  <p className="mt-1 text-sm text-stone-600">{item.subtitle}</p>
                ) : null}
                <div className="mt-2">
                  <Button asChild size="sm" variant="secondary">
                    <Link href={item.href}>
                      {item.kind === "ride"
                        ? "Przejdz do profilu"
                        : "Przejdz do wykladow"}
                    </Link>
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
