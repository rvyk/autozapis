"use client";

import type { ActivityItem } from "./dashboard-types";
import { formatActivityDate } from "./dashboard-utils";

export function DashboardActivityList({
  recentActivity,
}: {
  recentActivity: ActivityItem[];
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">Ostatnia aktywność</h2>
      <div className="mt-6 space-y-4">
        {recentActivity.length === 0 ? (
          <p className="text-sm text-stone-500">Brak nowej aktywności.</p>
        ) : null}

        {recentActivity.map((activity) => (
          <div key={activity.id} className="rounded-xl border border-stone-200 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-stone-900">{activity.title}</p>
              <span className="text-xs text-stone-500">{formatActivityDate(activity.createdAt)}</span>
            </div>
            <p className="mt-1 text-sm text-stone-600">{activity.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
