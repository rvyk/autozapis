"use client";

import Link from "next/link";
import { SectionHeader } from "@/app/_components/dashboard/section-header";
import { Button } from "@/components/ui/button";

type DashboardStats = {
  assignedStudentsCount: number;
  todayRidesCount: number;
  todayLecturesCount: number;
  plannedRidesCount: number;
  plannedLecturesCount: number;
  completedRidesCount: number;
  canTeachPractice: boolean;
  canTeachTheory: boolean;
};

type TodayRide = {
  id: string;
  time: string;
  kursant: string;
  type: string;
};

export function InstruktorDashboardPageContent({
  firstName,
  stats,
  todayRides,
}: {
  firstName?: string | null;
  stats: DashboardStats;
  todayRides: TodayRide[];
}) {
  const dashboardStats = [
    {
      label: "Moi kursanci",
      value: String(stats.assignedStudentsCount),
      unit: "aktywnych przypisań",
    },
    {
      label: "Jazdy dzisiaj",
      value: String(stats.todayRidesCount),
      unit: "zaplanowane",
    },
    {
      label: "Wyklady dzisiaj",
      value: String(stats.todayLecturesCount),
      unit: "zaplanowane",
    },
    {
      label: "Jazdy zrealizowane",
      value: String(stats.completedRidesCount),
      unit: "łącznie",
    },
  ] as const;

  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <SectionHeader
        title="Dashboard instruktora"
        description={
          <>
            Cześć{firstName ? `, ${firstName}` : ""}. Sprawdź plan jazd i szybkie działania na dziś.
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-stone-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-stone-900">{stat.value}</p>
            <p className="mt-1 text-xs font-medium text-stone-400">{stat.unit}</p>
          </div>
        ))}
      </div>

      {!stats.canTeachPractice || !stats.canTeachTheory ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Ograniczone uprawnienia: {!stats.canTeachPractice ? "jazdy" : null}
          {!stats.canTeachPractice && !stats.canTeachTheory ? " i " : null}
          {!stats.canTeachTheory ? "wyklady" : null}. Niedozwolone sekcje sa wyszarzone i niedostepne.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-stone-900">Dzisiejszy plan jazd</h2>
            <Button asChild variant="secondary" size="sm">
              <Link href="/instruktor/jazdy">Otwórz harmonogram</Link>
            </Button>
          </div>

          <div className="mt-5 space-y-3">
            {todayRides.length === 0 ? (
              <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-5 text-sm text-stone-500">
                Brak jazd zaplanowanych na dzisiaj.
              </div>
            ) : (
              todayRides.map((ride) => (
                <div key={ride.id} className="rounded-xl border border-stone-200 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-stone-900">{ride.kursant}</p>
                    <span className="text-xs font-medium text-red-600">{ride.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-stone-600">{ride.type}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-4">
          <div className="rounded-2xl border border-red-100 bg-red-50/60 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-red-900">Szybkie akcje</h2>
            <p className="mt-2 text-sm text-red-800/80">
              Przypisz kursanta, dodaj kolejną jazdę i uzupełnij opinię po przejeździe.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button asChild>
                <Link href="/instruktor/kursanci">Przypisz kursanta</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/instruktor/jazdy">Sprawdź harmonogram</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
