import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function PanelPage() {
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
      firstName: true,
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

  if (!dbUser?.isAccountActive) {
    redirect("/kursant/oczekiwanie");
  }

  const prismaDelegates = prisma as unknown as {
    announcement?: {
      findMany: (args: {
        where: {
          target: {
            in: Array<
              | "ALL_KURSANCI"
              | "KURSANCI_KAT_A"
              | "KURSANCI_KAT_B"
              | "KURSANCI_OCZEKUJACY"
            >;
          };
        };
        orderBy: { createdAt: "desc" };
        take: number;
        select: {
          id: true;
          title: true;
          content: true;
          target: true;
          createdAt: true;
        };
      }) => Promise<
        Array<{
          id: string;
          title: string;
          content: string;
          target:
            | "ALL_KURSANCI"
            | "KURSANCI_KAT_A"
            | "KURSANCI_KAT_B"
            | "KURSANCI_OCZEKUJACY"
            | "INSTRUKTORZY";
          createdAt: Date;
        }>
      >;
    };
  };

  const allowedTargets: Array<
    "ALL_KURSANCI" | "KURSANCI_KAT_A" | "KURSANCI_KAT_B" | "KURSANCI_OCZEKUJACY"
  > = ["ALL_KURSANCI"];

  if (dbUser.trainingCategory === "A") {
    allowedTargets.push("KURSANCI_KAT_A");
  } else {
    allowedTargets.push("KURSANCI_KAT_B");
  }

  const latestAnnouncements = prismaDelegates.announcement
    ? await prismaDelegates.announcement.findMany({
        where: { target: { in: allowedTargets } },
        orderBy: { createdAt: "desc" },
        take: 4,
        select: {
          id: true,
          title: true,
          content: true,
          target: true,
          createdAt: true,
        },
      })
    : [];

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-300 ease-out">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            W trakcie szkolenia
          </p>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
          Twój wirtualny garaż
        </h1>
        <p className="text-stone-500">
          Cześć{dbUser?.firstName ? `, ${dbUser.firstName}` : ""}. Tutaj
          śledzisz swoje postępy krok po kroku w drodze po wymarzone prawo
          jazdy.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Wykłady teoretyczne", value: "30/30", unit: "godz." },
          {
            label: "Wyjeżdżone godziny",
            value: "12/30",
            unit: "godz.",
            alert: true,
          },
          {
            label: "Kolejna jazda",
            value: "Pt, 15:30",
            unit: "Plac Manewrowy",
          },
          { label: "Pozostało do zapłaty", value: "1200", unit: "zł" },
        ].map((stat, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-stone-500">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-stone-900">
                {stat.value}
              </span>
            </div>
            <p className="text-xs font-medium text-stone-400">{stat.unit}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 flex flex-col gap-4 lg:col-span-2">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm min-h-100 flex flex-col">
            <h2 className="text-lg font-semibold text-stone-900">
              Twoje nadchodzące aktywności
            </h2>
            <div className="mt-6 flex-1 flex items-center justify-center text-center">
              <div>
                <svg
                  className="mx-auto h-12 w-12 text-stone-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p className="mt-4 text-sm font-medium text-stone-900">
                  Brak zaplanowanych jazd
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Skontaktuj się ze swoim instruktorem, aby umówić termin.
                </p>
              </div>
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
                  <div
                    key={announcement.id}
                    className="rounded-xl border border-stone-100 bg-stone-50/80 p-3"
                  >
                    <p className="text-sm font-semibold text-stone-900">
                      {announcement.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-stone-600">
                      {announcement.content}
                    </p>
                    <p className="mt-2 text-[11px] text-stone-500">
                      {new Intl.DateTimeFormat("pl-PL", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(announcement.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-red-900">
              Egzamin wewnętrzny
            </h2>
            <p className="mt-2 text-sm text-red-800/80">
              Pamiętaj, by przed egzaminem próbnym przerobić całą bazę pytań
              udostępnianych w dziale materiałów.
            </p>
            <div className="mt-5">
              <Link
                href="/kursant/materialy"
                className="inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700"
              >
                Przejdź do teorii
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
