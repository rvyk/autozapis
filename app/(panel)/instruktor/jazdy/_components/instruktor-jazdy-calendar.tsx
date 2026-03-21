"use client";

import { cn } from "@/lib/utils";
import { formatPlMonthYear, formatPlTime } from "@/app/_lib/date-format";
import type { CalendarItem } from "./instruktor-jazdy-types";
import { toDateKey } from "./instruktor-jazdy-utils";

export function InstruktorJazdyCalendar({
  displayDate,
  days,
  leadingEmpty,
  selectedDateKey,
  itemsByDay,
  loading,
  onSelectDay,
}: {
  displayDate: Date;
  days: Date[];
  leadingEmpty: number;
  selectedDateKey: string | null;
  itemsByDay: Map<string, CalendarItem[]>;
  loading: boolean;
  onSelectDay: (dateKey: string) => void;
}) {
  return (
    <div className="xl:col-span-2 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm sm:p-5">
      <h2 className="text-lg font-semibold text-stone-900">{formatPlMonthYear(displayDate)}</h2>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wide text-stone-500 sm:gap-2 sm:text-xs">
        {["Pon", "Wt", "Sr", "Czw", "Pt", "Sob", "Nd"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-2">
        {Array.from({ length: leadingEmpty }).map((_, index) => (
          <div key={`empty-${index}`} className="h-20 rounded-lg bg-stone-50 sm:h-24 sm:rounded-xl" />
        ))}

        {days.map((day) => {
          const key = toDateKey(day);
          const items = itemsByDay.get(key) ?? [];
          const isSelected = selectedDateKey === key;
          const isToday = key === toDateKey(new Date());

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDay(key)}
              className={cn(
                "h-20 rounded-lg border p-1.5 text-left transition-colors sm:h-24 sm:rounded-xl sm:p-2",
                isSelected
                  ? "border-red-300 bg-red-50 ring-2 ring-red-100"
                  : "border-stone-200 bg-white hover:bg-stone-50",
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn("text-[11px] font-semibold sm:text-xs", isToday ? "text-red-700" : "text-stone-700")}>{day.getDate()}</span>
                {items.length > 0 ? (
                  <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">{items.length}</span>
                ) : null}
              </div>
              <div className="mt-1 hidden space-y-1 sm:block">
                {items.slice(0, 2).map((item) => (
                  <p key={`${item.kind}-${item.id}`} className="truncate text-[11px] text-stone-600">
                    {formatPlTime(item.startsAt)} {item.label}
                  </p>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {loading ? <p className="mt-3 text-sm text-stone-500">Ladowanie jazd...</p> : null}
    </div>
  );
}
