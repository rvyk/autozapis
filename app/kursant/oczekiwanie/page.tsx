import Link from "next/link";
import { redirect } from "next/navigation";
import { getPanelUser } from "@/app/_lib/get-panel-user";
import { Button } from "@/components/ui/button";
import {
  getAnnouncementTargetsForKursant,
  getLatestKursantAnnouncements,
} from "../_lib/announcements";

export default async function PanelOczekiwaniePage() {
  const dbUser = await getPanelUser({ accessTarget: "kursant" });

  if (dbUser?.isAccountActive) {
    redirect("/kursant");
  }

  const allowedTargets = getAnnouncementTargetsForKursant(
    dbUser?.trainingCategory,
    true,
  );
  const latestAnnouncements = await getLatestKursantAnnouncements(
    allowedTargets,
    3,
  );

  return (
    <main className="mx-auto flex min-h-[70dvh] w-full max-w-3xl items-center px-4 py-10">
      <section className="w-full space-y-6 rounded-3xl border border-red-100/80 bg-white/95 p-8 shadow-[0_24px_70px_-28px_rgba(220,38,38,0.14)] backdrop-blur-sm">
        <div className="space-y-2">
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-red-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Konto nieaktywne
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Czekasz na akceptację przez OSK
          </h1>
          <p className="text-pretty text-sm leading-relaxed text-stone-500">
            Twoje konto zostało utworzone poprawnie, ale jeszcze nie jest
            aktywne. Gdy administrator OSK je zaakceptuje, automatycznie
            uzyskasz dostęp do panelu kursanta.
          </p>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/50 px-4 py-3">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
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
          <p className="text-pretty text-sm leading-relaxed text-red-900/70">
            Proces akceptacji trwa zazwyczaj do 24 godzin. Odśwież stronę, aby
            sprawdzić aktualny status.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <h2 className="text-base font-semibold text-stone-900">Ogłoszenia dla Ciebie</h2>
          <div className="mt-3 space-y-3">
            {latestAnnouncements.length === 0 ? (
              <p className="text-sm text-stone-500">Brak ogłoszeń.</p>
            ) : (
              latestAnnouncements.map((announcement) => (
                <article key={announcement.id} className="rounded-xl border border-stone-100 bg-stone-50/80 p-3">
                  <p className="text-sm font-semibold text-stone-900">{announcement.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-stone-600">{announcement.content}</p>
                  <p className="mt-2 text-[11px] text-stone-500">
                    {new Intl.DateTimeFormat("pl-PL", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(announcement.createdAt)}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/">Odśwież status</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
