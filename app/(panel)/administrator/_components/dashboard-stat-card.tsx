"use client";

import { cn } from "@/lib/utils";

export function DashboardStatCard({
  label,
  value,
  trend,
  alert = false,
}: {
  label: string;
  value: string;
  trend: string;
  alert?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-stone-500">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-stone-900">{value}</span>
      </div>
      <p
        className={cn(
          "text-xs font-medium",
          alert ? "text-red-600" : "text-stone-500",
        )}
      >
        {trend}
      </p>
    </div>
  );
}
