"use client";

export function InstruktorJazdySummary({
  plannedRidesCount,
  plannedLecturesCount,
}: {
  plannedRidesCount: number;
  plannedLecturesCount: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-700">
        Zaplanowane jazdy: {plannedRidesCount}
      </span>
      <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-700">
        Zaplanowane wyklady: {plannedLecturesCount}
      </span>
      <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
        Kliknij dzien, aby zobaczyc szczegoly
      </span>
    </div>
  );
}
