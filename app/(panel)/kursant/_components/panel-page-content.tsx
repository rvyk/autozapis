import Link from "next/link";
import { Button } from "@/components/ui/button";

type Announcement = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
};

const DATE_FORMATTER = new Intl.DateTimeFormat("pl-PL", {
  dateStyle: "short",
  timeStyle: "short",
});

export function PanelPageContent({
  firstName,
  latestAnnouncements,
  stats,
  nextLesson,
}: {
  firstName?: string | null;
  latestAnnouncements: Announcement[];
  stats: {
    theoryCompleted: number;
    theoryRequired: number;
    practiceCompleted: number;
    practiceRequired: number;
  };
  nextLesson: {
    id: string;
    date: Date;
    topic: string;
  } | null;
}) {
  const panelStats = [
    { label: "Wykłady teoretyczne", value: `${stats.theoryCompleted}/${stats.theoryRequired}`, unit: "godz." },
    { label: "Wyjeżdżone godziny", value: `${stats.practiceCompleted}/${stats.practiceRequired}`, unit: "godz." },
    { 
      label: "Kolejna jazda", 
      value: nextLesson ? DATE_FORMATTER.format(nextLesson.date) : "-", 
      unit: nextLesson ? nextLesson.topic : "Brak" 
    },
    { label: "Pozostało do zapłaty", value: "0", unit: "zł" }, // Todo: add payment system
  ];
  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-green-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            W trakcie szkolenia
          </p>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">Twój wirtualny garaż</h1>
        <p className="text-stone-500">
          Cześć{firstName ? `, ${firstName}` : ""}. Tutaj śledzisz swoje postępy krok po kroku w drodze po
          wymarzone prawo jazdy.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {panelStats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-2 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-stone-500">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-stone-900">{stat.value}</span>
            </div>
            <p className="text-xs font-medium text-stone-400">{stat.unit}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 flex flex-col gap-4 lg:col-span-2">
          <div className="min-h-100 flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-900">Twoje nadchodzące aktywności</h2>
            <div className="mt-6 flex flex-1 items-center justify-center text-center">
              {nextLesson ? (
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="mt-4 text-lg font-semibold text-stone-900">{nextLesson.topic}</p>
                  <p className="mt-1 text-sm text-stone-600">
                    {DATE_FORMATTER.format(nextLesson.date)}
                  </p>
                </div>
              ) : (
                <div>
                  <svg className="mx-auto h-12 w-12 text-stone-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="mt-4 text-sm font-medium text-stone-900">Brak zaplanowanych jazd</p>
                  <p className="mt-1 text-xs text-stone-500">Skontaktuj się ze swoim instruktorem, aby umówić termin.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-900">Najnowsze ogłoszenia</h2>
            <div className="mt-4 space-y-4">
              {latestAnnouncements.length === 0 ? (
                <p className="text-sm text-stone-500">Brak nowych ogłoszeń.</p>
              ) : (
                latestAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="rounded-xl border border-stone-100 bg-stone-50/80 p-3">
                    <p className="text-sm font-semibold text-stone-900">{announcement.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-stone-600">{announcement.content}</p>
                    <p className="mt-2 text-[11px] text-stone-500">{DATE_FORMATTER.format(announcement.createdAt)}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-red-900">Egzamin wewnętrzny</h2>
            <p className="mt-2 text-sm text-red-800/80">
              Pamiętaj, by przed egzaminem próbnym przerobić całą bazę pytań udostępnianych w dziale materiałów.
            </p>
            <div className="mt-5">
              <Button asChild className="w-full">
                <Link href="/kursant/materialy">Przejdź do teorii</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
