"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  INSTRUCTOR_STUDENT_FILTERS,
  type InstructorStudentFilter,
} from "./instruktor-kursanci-types";

const FILTER_LABELS: Record<InstructorStudentFilter, string> = {
  WSZYSCY: "Wszyscy",
  MOI: "Przypisani",
  WOLNI: "Nieprzypisani",
};

export function InstruktorKursanciFilterTabs({
  filter,
  onChange,
}: {
  filter: InstructorStudentFilter;
  onChange: (nextFilter: InstructorStudentFilter) => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white p-1.5">
      {INSTRUCTOR_STUDENT_FILTERS.map((value) => (
        <Button
          key={value}
          variant="ghost"
          size="sm"
          onClick={() => onChange(value)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-semibold",
            filter === value
              ? "bg-red-100 text-red-800 hover:bg-red-100"
              : "text-stone-500 hover:bg-stone-100",
          )}
        >
          {FILTER_LABELS[value]}
        </Button>
      ))}
    </div>
  );
}
