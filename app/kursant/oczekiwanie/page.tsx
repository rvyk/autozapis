import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function PanelOczekiwaniePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/logowanie");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      role: true,
      trainingCategory: true,
      isAccountActive: true,
      isRegistrationComplete: true,
      birthDate: true,
    },
  });

  if (dbUser?.role === "ADMINISTRATOR") {
    redirect("/administrator");
  }

  if (dbUser?.role === "INSTRUKTOR") {
    redirect("/");
  }

  if (!dbUser?.isRegistrationComplete) {
    if (dbUser?.birthDate) {
      redirect("/rejestracja/dokument");
    }

    redirect("/rejestracja/prawo-jazdy");
  }

  if (dbUser?.isAccountActive) {
    redirect("/kursant");
  }

  const prismaDelegates = prisma as unknown as {
    announcement?: {
      findMany: (args: {
        where: {
          target: {
            in: Array<"ALL_KURSANCI" | "KURSANCI_KAT_A" | "KURSANCI_KAT_B" | "KURSANCI_OCZEKUJACY">;
          };
        };
        orderBy: { createdAt: "desc" };
        take: number;
        select: {
          id: true;
          title: true;
          content: true;
          createdAt: true;
        };
      }) => Promise<Array<{ id: string; title: string; content: string; createdAt: Date }>>;
    };
  };

  const allowedTargets: Array<
    "ALL_KURSANCI" | "KURSANCI_KAT_A" | "KURSANCI_KAT_B" | "KURSANCI_OCZEKUJACY"
  > = ["ALL_KURSANCI", "KURSANCI_OCZEKUJACY"];

  if (dbUser?.trainingCategory === "A") {
    allowedTargets.push("KURSANCI_KAT_A");
  } else {
    allowedTargets.push("KURSANCI_KAT_B");
  }

  const latestAnnouncements = prismaDelegates.announcement
    ? await prismaDelegates.announcement.findMany({
        where: { target: { in: allowedTargets } },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      })
    : [];

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
          <Link
            href="/"
            className="inline-flex items-center rounded-xl bg-linear-to-b from-red-600 to-red-700 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_1px_3px_rgba(220,38,38,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-150 hover:-translate-y-0.5 hover:from-red-700 hover:to-red-800 hover:shadow-[0_4px_14px_rgba(220,38,38,0.35)]"
          >
            Odśwież status
          </Link>
        </div>
      </section>
    </main>
  );
}
