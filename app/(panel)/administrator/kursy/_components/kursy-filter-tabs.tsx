"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { COURSE_FILTERS, type CourseFilter, type CourseStats } from "./kursy-types";
import { filterToLabel } from "./kursy-utils";

function getFilterCount(stats: CourseStats, filter: CourseFilter) {
  if (filter === "NABOR") return stats.nabor;
  if (filter === "PLANOWANE") return stats.planowane;
  if (filter === "STALA_OFERTA") return stats.stala;
  return stats.all;
}

export function KursyFilterTabs({
  filter,
  stats,
  onChange,
}: {
  filter: CourseFilter;
  stats: CourseStats;
  onChange: (value: CourseFilter) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-4">
      {COURSE_FILTERS.map((option) => {
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
            <span>{filterToLabel(option)}</span>
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
