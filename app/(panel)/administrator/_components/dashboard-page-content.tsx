import Link from "next/link";
import { Button } from "@/components/ui/button";

const DASHBOARD_STATS = [
  { label: "Wszyscy kursanci", value: "248", trend: "+12 w tym tyg." },
  {
    label: "Oczekujący na autoryzację",
    value: "3",
    trend: "Wymaga uwagi",
    alert: true,
  },
  { label: "Aktywne kursy", value: "6", trend: "Brak zmian" },
  {
    label: "Instruktorzy na zmianie",
    value: "4/7",
    trend: "Wszyscy wg planu",
  },
] as const;

export function DashboardPageContent({
  firstName,
}: {
  firstName?: string | null;
}) {
  return (
    <div className="flex w-full flex-col gap-6 animate-in fade-in duration-300 ease-out">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          Dashboard
        </h1>
        <p className="text-stone-500">
          Cześć{firstName ? `, ${firstName}` : ""}. Oto podsumowanie Twojego
          ośrodka na dziś.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DASHBOARD_STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-stone-500">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-stone-900">
                {stat.value}
              </span>
            </div>
            <p
              className={
                stat.trend
                  ? "text-xs font-medium text-red-600"
                  : "text-xs font-medium text-stone-400"
              }
            >
              {stat.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 flex flex-col gap-4 lg:col-span-2">
          <div className="min-h-100 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-900">
              Ostatnia aktywność
            </h2>
            <div className="mt-6 space-y-4">
              <p className="text-sm text-stone-500">Brak nowej aktywności.</p>
            </div>
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-4">
          <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-red-900">
              Uwaga, 3 nowe wnioski
            </h2>
            <p className="mt-2 text-sm text-red-800/80">
              Kursanci przesłali nowe dokumenty PKK do weryfikacji.
            </p>
            <div className="mt-5">
              <Button asChild className="w-full">
                <Link href="/administrator/kursanci?status=oczekujacy">
                  Sprawdź wnioski
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
