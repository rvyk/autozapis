"use client";

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
];

export default function WykladyPage() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-300 ease-out">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Harmonogram wykładów
          </h1>
          <p className="mt-2 text-stone-500">
            Bierz udział w zajęciach teoretycznych i zdobądź wymaganą wiedzę.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {MOCK_LECTURES.map((lecture) => (
          <div
            key={lecture.id}
            className="group flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col gap-1 w-full sm:w-1/2">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
                {lecture.type}
              </span>
              <h3 className="text-lg font-semibold text-stone-900">
                {lecture.topic}
              </h3>
              <p className="text-sm text-stone-500 flex items-center gap-2 mt-1">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {lecture.date} ({lecture.duration})
              </p>
            </div>

            <div className="flex items-center gap-4 mt-4 sm:mt-0 justify-end w-full sm:w-auto">
              <span
                className={`inline-flex min-w-25 justify-center items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                  lecture.status === "Ukończony"
                    ? "bg-stone-100 text-stone-600"
                    : lecture.status === "Zapisany"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {lecture.status}
              </span>

              {lecture.status === "Dostępny" && (
                <button className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700">
                  Zapisz się
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
