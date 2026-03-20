import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        role: true,
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

    if (!dbUser?.isAccountActive) {
      redirect("/kursant/oczekiwanie");
    }

    redirect("/kursant");
  }

  return (
    <main className="flex min-h-[70dvh] flex-col items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          Autozapis
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Zaloguj się albo załóż konto, aby przejść dalej do procesu zapisu.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/logowanie"
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-800 transition hover:bg-stone-100"
          >
            Zaloguj się
          </Link>
          <Link
            href="/rejestracja"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Załóż konto
          </Link>
        </div>
      </div>
    </main>
  );
}
