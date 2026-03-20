"use client";

const MOCK_COURSES = [
  {
    id: 1,
    title: "Prawo Jazdy Kat. B (Weekendowy)",
    category: "Kategoria B",
    startDate: "25.04.2026",
    duration: "3 tygodnie",
    price: "3200 zł",
    status: "Trwa nabór",
    spots: "12/15",
  },
  {
    id: 2,
    title: "Prawo Jazdy Kat. A",
    category: "Kategoria A",
    startDate: "02.05.2026",
    duration: "4 tygodnie",
    price: "2800 zł",
    status: "Planowany",
    spots: "5/10",
  },
  {
    id: 3,
    title: "Szkolenie dodatkowe - plac",
    category: "Doszkalanie",
    startDate: "Dowolnie",
    duration: "2 godziny",
    price: "200 zł",
    status: "Stała oferta",
    spots: "Nielimitowane",
  },
];

export default function KursyPage() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-300 ease-out">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Kursy szkoleniowe
          </h1>
          <p className="mt-2 text-stone-500">
            Zarządzaj ofertą, cennikiem i dostępnością kursów na prawo jazdy.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700">
            Dodaj nowy kurs
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {MOCK_COURSES.map((course) => (
          <div
            key={course.id}
            className="group flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col gap-1 w-full sm:w-1/3">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
                {course.category}
              </span>
              <h3 className="text-lg font-semibold text-stone-900">
                {course.title}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:flex sm:gap-8">
              <div className="flex flex-col">
                <span className="text-stone-500">Start</span>
                <span className="font-medium text-stone-900">
                  {course.startDate}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-stone-500">Czas trwania</span>
                <span className="font-medium text-stone-900">
                  {course.duration}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-stone-500">Cena</span>
                <span className="font-medium text-stone-900">
                  {course.price}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-stone-500">Zapisanych</span>
                <span className="font-medium text-stone-900">
                  {course.spots}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <span
                className={`inline-flex min-w-25 justify-center items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                  course.status === "Trwa nabór"
                    ? "bg-green-100 text-green-800"
                    : course.status === "Planowany"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-stone-100 text-stone-800"
                }`}
              >
                {course.status}
              </span>

              <button className="text-stone-400 hover:text-red-500 transition-colors">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
