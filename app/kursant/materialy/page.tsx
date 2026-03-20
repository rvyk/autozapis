"use client";

import Link from "next/link";

const MODULES = [
  {
    id: 1,
    title: "Moduł 1: Przepisy Ogólne",
    status: "Ukończono",
    progress: 100,
  },
  {
    id: 2,
    title: "Moduł 2: Znaki i Sygnały Drogowe",
    status: "W trakcie",
    progress: 65,
  },
  { id: 3, title: "Moduł 3: Skrzyżowania", status: "Zablokowane", progress: 0 },
  {
    id: 4,
    title: "Moduł 4: Pierwsza Pomoc",
    status: "Zablokowane",
    progress: 0,
  },
];

export default function MaterialyPage() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-300 ease-out">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          Materiały Edukacyjne
        </h1>
        <p className="text-stone-500">
          Ucz się teorii, testuj swoj wiedzę i przygotowuj do egzaminu
          państwowego.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-stone-900 mb-4">
              Postęp w modułach testowych
            </h2>
            <div className="space-y-4">
              {MODULES.map((modul) => (
                <div
                  key={modul.id}
                  className="group flex flex-col gap-2 rounded-xl p-4 transition-colors hover:bg-stone-50 border border-stone-100"
                >
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span
                      className={
                        modul.status === "Zablokowane"
                          ? "text-stone-400"
                          : "text-stone-900"
                      }
                    >
                      {modul.title}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        modul.status === "Ukończono"
                          ? "bg-green-100 text-green-700"
                          : modul.status === "W trakcie"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-stone-100 text-stone-400"
                      }`}
                    >
                      {modul.status}
                    </span>
                  </div>

                  <div className="relative h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full ${
                        modul.progress === 100 ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{ width: `${modul.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6 shadow-sm flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm mb-4">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-red-900">Baza Pytań PWPW</h3>
            <p className="text-sm text-red-800/80 mt-2 mb-6 leading-relaxed">
              Przetestuj swoją wiedzę rozwiązując darmowy próbny egzamin
              teoretyczny, taki jak na egzaminie państwowym.
            </p>
            <button className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700">
              Rozpocznij egzamin
            </button>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-stone-900 mb-2">
              Przydatne pliki
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="flex items-center gap-3 text-sm font-medium text-stone-600 hover:text-red-600 transition-colors"
                >
                  <svg
                    className="h-5 w-5 text-stone-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Instrukcja Plac Manewrowy.pdf
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="flex items-center gap-3 text-sm font-medium text-stone-600 hover:text-red-600 transition-colors"
                >
                  <svg
                    className="h-5 w-5 text-stone-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Opis świateł w Hyundai i20.pdf
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
