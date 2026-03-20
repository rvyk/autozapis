"use client";

import { Button } from "@/components/ui/button";
import {
  CURRENT_KURSANT_MOCK_ID,
  MOCK_TRAINING_STUDENTS,
} from "@/app/(panel)/_lib/mock-driving-data";

const currentStudent =
  MOCK_TRAINING_STUDENTS.find((student) => student.id === CURRENT_KURSANT_MOCK_ID) ??
  MOCK_TRAINING_STUDENTS[0];

const rides = [...currentStudent.rides].sort((a, b) => {
  if (!a.startsAt && !b.startsAt) return 0;
  if (!a.startsAt) return -1;
  if (!b.startsAt) return 1;
  return new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime();
});

function formatDateTime(value: string) {
  if (!value) return "Do umowienia";
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function JazdyPageContent() {
  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <div className="border-b border-stone-200 pb-6 sm:flex sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Historia Jazd Praktycznych</h1>
          <p className="text-stone-500">
            Przegladaj swoj postep w jazdach, weryfikuj trasy i czytaj opinie instruktora.
          </p>
        </div>
        <div className="mt-4 flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:mt-0">
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Godziny</span>
            <span className="text-2xl font-bold text-stone-900">
              {currentStudent.hoursDone}
              <span className="text-lg text-stone-400">/{currentStudent.hoursTarget}</span>
            </span>
          </div>
          <div className="h-10 w-px bg-stone-200" />
          <div className="flex flex-col items-center pl-2">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col gap-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-linear-to-b before:from-transparent before:via-stone-200 before:to-transparent md:before:mx-auto md:before:translate-x-0">
        {rides.map((ride, index) => (
          <div
            key={ride.id}
            className="group relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse"
          >
            <div className="z-10 h-10 w-10 shrink-0 rounded-full border-4 border-stone-50 bg-white shadow-sm md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <div className="flex h-full w-full items-center justify-center">
                <div className={ride.status === "ZREALIZOWANA" ? "h-3 w-3 rounded-full bg-red-500" : "h-3 w-3 rounded-full bg-stone-300"} />
              </div>
            </div>

            <div className="ml-4 w-[calc(100%-4rem)] rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:ml-0 md:w-[calc(50%-2.5rem)]">
              <div className="mb-2 flex items-start justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Jazda #{rides.length - index}
                </span>
                <span className="text-xs font-medium text-stone-500">{formatDateTime(ride.startsAt)}</span>
              </div>
              <h3 className="mb-1 text-lg font-bold text-stone-900">{ride.topic}</h3>
              <p className="mb-4 text-sm text-stone-600">{ride.durationHours}h z instruktorem</p>

              {ride.instructorNote ? (
                <div className="rounded-xl border border-stone-100 bg-stone-50 p-4">
                  <p className="mb-1 text-sm font-semibold text-stone-800">Komentarz instruktora:</p>
                  <p className="text-sm italic text-stone-600">&quot;{ride.instructorNote}&quot;</p>
                  {ride.route ? (
                    <div className="mt-3 flex items-center gap-2 text-xs font-medium text-stone-500">
                      <svg className="h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {ride.route}
                    </div>
                  ) : null}
                </div>
              ) : (
                <Button variant="outline" className="mt-2 w-full">
                  Umow ten termin
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
