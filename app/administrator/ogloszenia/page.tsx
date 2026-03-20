"use client";

const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Zmiana terminu wykładów kat. B",
    date: "20.03.2026",
    author: "Janusz Kaczmarek",
    target: "Zapisani Kat. B",
    content:
      "Informujemy, że w związku ze świętem państwowym, wykłady zaplanowane na najbliższy piątek zostają przeniesione na poniedziałek.",
  },
  {
    id: 2,
    title: "Zniżka na badania lekarskie - maj",
    date: "15.03.2026",
    author: "Piotr Wróbel",
    target: "Wszyscy Kursanci",
    content:
      "Udało nam się wynegocjować współpracę z Przychodnią Med, ruszają zniżki lekarza 50% przez cały maj.",
  },
];

export default function OgloszeniaPage() {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-300 ease-out">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Ogłoszenia
          </h1>
          <p className="mt-2 text-stone-500">
            Wysyłaj wiadomości i powiadomienia do swoich kursantów.
          </p>
        </div>
        <div>
          <button className="inline-flex items-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700">
            Utwórz nową wiadomość
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {MOCK_ANNOUNCEMENTS.map((post) => (
          <article
            key={post.id}
            className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  {post.title}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-stone-500">
                  <span className="font-medium text-stone-700">
                    {post.author}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-stone-300" />
                  <span>{post.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                  Odbiorcy: {post.target}
                </span>
                <button className="text-stone-400 hover:text-red-500 transition-colors ml-2">
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

            <div className="pt-2 text-sm leading-relaxed text-stone-600">
              {post.content}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
