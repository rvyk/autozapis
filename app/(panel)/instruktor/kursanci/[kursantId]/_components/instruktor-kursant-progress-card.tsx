"use client";

export function InstruktorKursantProgressCard({
  completedHours,
  hoursTarget,
}: {
  completedHours: number;
  hoursTarget: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Postep godzin</p>
        <p className="mt-2 text-2xl font-bold text-stone-900">
          {completedHours}/{hoursTarget}h
        </p>
        <p className="mt-2 text-xs text-stone-500">
          Godziny sa liczone automatycznie tylko z jazd oznaczonych jako zrealizowane.
        </p>
      </div>
    </div>
  );
}
