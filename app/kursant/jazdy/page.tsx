"use client";

const MOCK_RIDES = [
  {
    id: 1,
    date: "Do umówienia",
    duration: "2h",
    topic: "Plac Manewrowy",
    instructor: "Janusz Kaczmarek",
    status: "Brak",
    route: null,
    feedback: null,
  },
  {
    id: 2,
    date: "10.03.2026, 15:00",
    duration: "2h",
    topic: "Jazda po mieście - skrzyżowania rat.",
    instructor: "Janusz Kaczmarek",
    status: "Zrealizowana",
    route: "Rondo JPII, Ul. Mickiewicza",
    feedback:
      "Pamiętaj o wcześniejszym wrzucaniu kierunkowskazu przy zjeździe z ronda. Poza tym dynamika bardzo dobra!",
  },
  {
    id: 3,
    date: "05.03.2026, 17:00",
    duration: "1h",
    topic: "Plac manewrowy",
    instructor: "Janusz Kaczmarek",
    status: "Zrealizowana",
    route: "Plac własny OSK",
    feedback:
      "Łuk opanowany w 100%. Górka wymaga doszlifowania ruszania z ręcznego by auto nie gasło.",
  },
];

export default function JazdyPage() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-300 ease-out">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Historia Jazd Praktycznych
          </h1>
          <p className="mt-2 text-stone-500">
            Przeglądaj swój postęp w jazdach, weryfikuj trasy i czytaj opinie
            instruktora.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-2xl border border-stone-200 shadow-sm p-4">
          <div className="flex flex-col items-center">
            <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider">
              Godziny
            </span>
            <span className="text-2xl font-bold text-stone-900">
              12<span className="text-stone-400 text-lg">/30</span>
            </span>
          </div>
          <div className="h-10 w-px bg-stone-200" />
          <div className="flex flex-col items-center pl-2">
            <svg
              className="h-8 w-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-stone-200 before:to-transparent">
        {MOCK_RIDES.map((ride, i) => (
          <div
            key={ride.id}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-stone-50 bg-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-sm">
              {ride.status === "Zrealizowana" ? (
                <div className="h-3 w-3 bg-red-500 rounded-full" />
              ) : (
                <div className="h-3 w-3 bg-stone-300 rounded-full" />
              )}
            </div>

            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md ml-4 md:ml-0">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Jazda #{MOCK_RIDES.length - i}
                </span>
                <span className="text-xs font-medium text-stone-500">
                  {ride.date}
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-1">
                {ride.topic}
              </h3>
              <p className="text-sm text-stone-600 mb-4">
                {ride.duration} z {ride.instructor}
              </p>

              {ride.feedback ? (
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                  <p className="text-sm font-semibold text-stone-800 mb-1">
                    Komentarz instruktora:
                  </p>
                  <p className="text-sm text-stone-600 italic">
                    "{ride.feedback}"
                  </p>
                  {ride.route && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-stone-500 font-medium">
                      <svg
                        className="h-4 w-4 text-stone-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {ride.route}
                    </div>
                  )}
                </div>
              ) : (
                <button className="w-full mt-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 shadow-sm transition-all hover:bg-red-100">
                  Umów ten termin
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
