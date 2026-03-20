"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { AnnouncementPreview } from "./dashboard-types";
import { formatActivityDate, TARGET_LABELS } from "./dashboard-utils";

export function DashboardRightRail({
  pendingPkk,
  latestAnnouncements,
}: {
  pendingPkk: number;
  latestAnnouncements: AnnouncementPreview[];
}) {
  return (
    <div className="col-span-1 flex flex-col gap-4">
      <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-red-900">Uwaga, {pendingPkk} nowych wniosków</h2>
        <p className="mt-2 text-sm text-red-800/80">Kursanci przesłali nowe dokumenty PKK do weryfikacji.</p>
        <div className="mt-5">
          <Button asChild className="w-full" disabled={pendingPkk === 0}>
            <Link href="/administrator/kursanci?status=oczekujacy">Sprawdź wnioski</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Ostatnie ogłoszenia</h2>
          <div className="mt-3">
            <Button asChild variant="secondary" className="w-full">
              <Link href="/administrator/ogloszenia">Zobacz wszystkie</Link>
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {latestAnnouncements.length === 0 ? (
            <p className="text-sm text-stone-500">Brak ogłoszeń do wyświetlenia.</p>
          ) : null}

          {latestAnnouncements.map((announcement) => (
            <div key={announcement.id} className="rounded-xl border border-stone-200 px-4 py-3">
              <p className="text-sm font-semibold text-stone-900">{announcement.title}</p>
              <p className="mt-1 text-xs text-stone-500">{TARGET_LABELS[announcement.target]}</p>
              <p className="mt-1 text-xs text-stone-400">{formatActivityDate(announcement.createdAt)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
