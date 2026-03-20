"use client";

const MOCK_INSTRUCTORS = [
  {
    id: 1,
    name: "Janusz Kaczmarek",
    type: "Instruktor Prowadzący",
    rating: 5.0,
    description:
      "Doświadczony instruktor z powołania. Cierpliwy i bardzo skrupulatny.",
  },
  {
    id: 2,
    name: "Anna Lewandowska",
    type: "Wykładowca teorii",
    rating: 4.8,
    description:
      "Świetnie tłumaczy skrzyżowania wielopoziomowe, pierwsza pomoc to jej specjalność.",
  },
];

export default function InstruktorzyPage() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-300 ease-out">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          Zarządzaj instruktorami
        </h1>
        <p className="mt-2 text-stone-500">
          Oto Twój przydzielony instruktor prowadzący oraz pozostali kadrowicze,
          których można poprosić o dodatkową jazdę.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {MOCK_INSTRUCTORS.map((instruktor) => (
          <div
            key={instruktor.id}
            className="group flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-100 text-xl font-bold text-red-700">
                {instruktor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest">
                  {instruktor.type}
                </p>
                <h3 className="text-lg font-semibold text-stone-900 leading-tight">
                  {instruktor.name}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <span className="flex items-center gap-1 text-sm font-medium text-stone-900">
                    <svg
                      className="h-4 w-4 text-amber-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {instruktor.rating.toFixed(1)} / 5.0
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-4">
              {instruktor.description}
            </p>

            <div className="flex justify-end gap-3 mt-2">
              <button className="text-sm font-semibold text-stone-500 hover:text-stone-800 transition-colors">
                Oceń współpracę
              </button>
              <button className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition-all hover:bg-stone-200 hover:text-stone-900">
                Wiadomość
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
