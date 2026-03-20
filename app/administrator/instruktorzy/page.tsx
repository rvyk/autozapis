"use client";

const MOCK_INSTRUCTORS = [
  {
    id: 1,
    name: "Janusz Kaczmarek",
    phone: "+48 123 456 789",
    activeTrainees: 12,
    rating: 4.9,
  },
  {
    id: 2,
    name: "Anna Lewandowska",
    phone: "+48 987 654 321",
    activeTrainees: 8,
    rating: 4.8,
  },
  {
    id: 3,
    name: "Piotr Wróbel",
    phone: "+48 555 111 222",
    activeTrainees: 15,
    rating: 5.0,
  },
];

export default function InstruktorzyPage() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-300 ease-out">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Instruktorzy
          </h1>
          <p className="mt-2 text-stone-500">
            Zarządzaj zespołem instruktorów prowadzących jazdy i wykłady.
          </p>
        </div>
        <div>
          <button className="inline-flex items-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700">
            Dodaj instruktora
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_INSTRUCTORS.map((instruktor) => (
          <div
            key={instruktor.id}
            className="group flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-700">
                {instruktor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
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

            <div>
              <h3 className="text-lg font-semibold text-stone-900">
                {instruktor.name}
              </h3>
              <p className="text-sm text-stone-500">{instruktor.phone}</p>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-stone-900">
                  {instruktor.activeTrainees}
                </span>
                <span className="text-xs text-stone-500">Kursantów</span>
              </div>
              <div className="h-8 w-px bg-stone-200" />
              <div className="flex flex-col">
                <span className="flex items-center gap-1 text-sm font-medium text-stone-900">
                  {instruktor.rating}
                  <svg
                    className="h-3 w-3 text-amber-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
                <span className="text-xs text-stone-500">Ocena</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
