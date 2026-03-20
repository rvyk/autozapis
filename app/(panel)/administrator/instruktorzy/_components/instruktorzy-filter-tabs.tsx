"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  INSTRUCTOR_FILTERS,
  type InstructorFilter,
  type InstructorsStats,
} from "./instruktorzy-types";
import { getFilterCount, getFilterLabel } from "./instruktorzy-utils";

export function InstruktorzyFilterTabs({
  filter,
  stats,
  onChange,
}: {
  filter: InstructorFilter;
  stats: InstructorsStats;
  onChange: (filter: InstructorFilter) => void;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-stone-200 pb-4">
      {INSTRUCTOR_FILTERS.map((option) => {
        const isActive = filter === option;

        return (
          <Button
            key={option}
            variant="ghost"
            size="sm"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium",
              isActive
                ? "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
                : "text-stone-500 hover:bg-stone-100 hover:text-stone-900",
            )}
          >
            <span>{getFilterLabel(option)}</span>
            <span
              className={cn(
                "ml-2 inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                isActive
                  ? "bg-red-200/90 text-red-900"
                  : "bg-stone-200 text-stone-700",
              )}
            >
              {getFilterCount(stats, option)}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
