"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const DASHBOARD_STATS = [
  { label: "Moi kursanci", value: "18", unit: "aktywnych" },
  { label: "Jazdy dzisiaj", value: "6", unit: "zaplanowane" },
  { label: "Wolne miejsca", value: "4", unit: "w tym tygodniu" },
  { label: "Godziny do uzupelnienia", value: "9", unit: "raportow" },
] as const;

const TODAY_RIDES = [
  { id: 1, time: "09:00", kursant: "Jan Kowalski", type: "Plac manewrowy" },
  { id: 2, time: "11:30", kursant: "Anna Nowak", type: "Miasto - ronda" },
  { id: 3, time: "15:00", kursant: "Piotr Wrobel", type: "Trasa egzaminacyjna" },
] as const;

export function InstruktorDashboardPageContent({
  firstName,
}: {
  firstName?: string | null;
}) {
  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">Dashboard instruktora</h1>
        <p className="text-stone-500">
          Cześć{firstName ? `, ${firstName}` : ""}. Sprawdź plan jazd i szybkie działania na dziś.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DASHBOARD_STATS.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-stone-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-stone-900">{stat.value}</p>
            <p className="mt-1 text-xs font-medium text-stone-400">{stat.unit}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-stone-900">Dzisiejszy plan jazd</h2>
            <Button asChild variant="secondary" size="sm">
              <Link href="/instruktor/jazdy">Otworz harmonogram</Link>
            </Button>
          </div>

          <div className="mt-5 space-y-3">
            {TODAY_RIDES.map((ride) => (
              <div key={ride.id} className="rounded-xl border border-stone-200 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-stone-900">{ride.kursant}</p>
                  <span className="text-xs font-medium text-red-600">{ride.time}</span>
                </div>
                <p className="mt-1 text-sm text-stone-600">{ride.type}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-4">
          <div className="rounded-2xl border border-red-100 bg-red-50/60 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-red-900">Szybkie akcje</h2>
            <p className="mt-2 text-sm text-red-800/80">
              Przypisz kursanta, dodaj kolejna jazde i uzupelnij opinie po przejezdzie.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button asChild>
                <Link href="/instruktor/kursanci">Przypisz kursanta</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/instruktor/jazdy">Sprawdz harmonogram</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
