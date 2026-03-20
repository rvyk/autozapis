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
    select: { role: true, isAccountActive: true },
  });

  if (dbUser?.role === "OSK_ADMINISTRATOR_ROLE") {
    redirect("/administrator");
  }

  if (dbUser?.isAccountActive) {
    redirect("/panel");
  }

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
