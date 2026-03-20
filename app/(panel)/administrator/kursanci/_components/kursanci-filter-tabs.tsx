"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FILTER_OPTIONS,
  type KursantStats,
  type KursantStatusFilter,
} from "./kursanci-types";
import { getFilterCount, getFilterCountClass } from "./kursanci-utils";

export function KursanciFilterTabs({
  filter,
  stats,
  disabled,
  onChange,
}: {
  filter: KursantStatusFilter;
  stats: KursantStats;
  disabled: boolean;
  onChange: (next: KursantStatusFilter) => void;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-stone-200 pb-4">
      {FILTER_OPTIONS.map((option) => {
        const isActive = filter === option.value;

        return (
          <Button
            key={option.value}
            variant="ghost"
            size="sm"
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium",
              isActive
                ? "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
                : "text-stone-500 hover:bg-stone-100 hover:text-stone-900",
            )}
          >
            <span>{option.label}</span>
            <span
              className={cn(
                "ml-2 inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                getFilterCountClass(option.value, isActive),
              )}
            >
              {getFilterCount(stats, option.value)}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
