"use client";

import { DashboardActivityList } from "./dashboard-activity-list";
import { DashboardAnalyticsCard } from "./dashboard-analytics-card";
import { DashboardRightRail } from "./dashboard-right-rail";
import { DashboardStatCard } from "./dashboard-stat-card";
import { SectionHeader } from "@/app/_components/dashboard/section-header";
import type {
  ActivityItem,
  AnalyticsPayload,
  AnnouncementPreview,
  StatPayload,
} from "./dashboard-types";

export function DashboardPageContent({
  firstName,
  stats,
  recentActivity,
  analytics,
  latestAnnouncements,
}: {
  firstName?: string | null;
  stats: StatPayload;
  recentActivity: ActivityItem[];
  analytics: AnalyticsPayload;
  latestAnnouncements: AnnouncementPreview[];
}) {
  const statCards = [
    {
      label: "Wszyscy kursanci",
      value: String(stats.totalStudents),
      trend: `+${stats.newStudentsThisWeek} w tym tygodniu`,
      alert: false,
    },
    {
      label: "Oczekujący na autoryzację",
      value: String(stats.pendingPkk),
      trend: stats.pendingPkk > 0 ? "Wymaga uwagi" : "Brak oczekujących",
      alert: stats.pendingPkk > 0,
    },
    {
      label: "Aktywne kursy",
      value: String(stats.activeCourses),
      trend: "Status: nabór lub planowany",
      alert: false,
    },
    {
      label: "Instruktorzy aktywni",
      value: `${stats.activeInstructors}/${stats.totalInstructors}`,
      trend:
        stats.activeInstructors === stats.totalInstructors
          ? "Pełna obsada"
          : "Część nieaktywna",
      alert: false,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-6 animate-in fade-in duration-300 ease-out">
      <SectionHeader
        title="Strona główna"
        description={
          <>
            Cześć{firstName ? `, ${firstName}` : ""}. Oto podsumowanie Twojego
            ośrodka na dziś.
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <DashboardStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
            alert={stat.alert}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 flex flex-col gap-4 lg:col-span-2">
          <DashboardAnalyticsCard analytics={analytics} />
          <DashboardActivityList recentActivity={recentActivity} />
        </div>

        <DashboardRightRail
          pendingPkk={stats.pendingPkk}
          latestAnnouncements={latestAnnouncements}
        />
      </div>
    </div>
  );
}
