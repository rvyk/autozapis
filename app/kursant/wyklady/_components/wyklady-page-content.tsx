"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MOCK_LECTURES = [
  {
    id: 1,
    topic: "Przepisy o ruchu drogowym cz. 1",
    date: "24.03.2026, 17:00",
    duration: "2 godz.",
    status: "Zapisany",
    type: "Teoria podstawowa",
  },
  {
    id: 2,
    topic: "Znaki i sygnalizacja",
    date: "26.03.2026, 17:00",
    duration: "2 godz.",
    status: "Dostępny",
    type: "Teoria podstawowa",
  },
  {
    id: 3,
    topic: "Pierwsza pomoc",
    date: "28.03.2026, 16:00",
    duration: "4 godz.",
    status: "Ukończony",
    type: "Szkolenie specjalne",
  },
] as const;

export function WykladyPageContent() {
  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Harmonogram wykładów</h1>
          <p className="mt-2 text-stone-500">Bierz udział w zajęciach teoretycznych i zdobądź wymaganą wiedzę.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {MOCK_LECTURES.map((lecture) => (
          <div
            key={lecture.id}
            className="group flex flex-col justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center"
          >
            <div className="w-full sm:w-1/2">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-red-600">{lecture.type}</span>
                <h3 className="text-lg font-semibold text-stone-900">{lecture.topic}</h3>
                <p className="mt-1 flex items-center gap-2 text-sm text-stone-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {lecture.date} ({lecture.duration})
                </p>
              </div>
            </div>

            <div className="mt-4 flex w-full items-center justify-end gap-4 sm:mt-0 sm:w-auto">
              <span
                className={cn(
                  "inline-flex min-w-25 items-center justify-center rounded-full px-2.5 py-1 text-xs font-medium",
                  lecture.status === "Ukończony"
                    ? "bg-stone-100 text-stone-600"
                    : lecture.status === "Zapisany"
                      ? "bg-green-100 text-green-800"
                      : "border border-red-200 bg-red-50 text-red-700",
                )}
              >
                {lecture.status}
              </span>

              {lecture.status === "Dostępny" ? <Button>Zapisz się</Button> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
