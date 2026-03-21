import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RejestracjaPageContent } from "./_components/rejestracja-page-content";

export const metadata: Metadata = {
  title: "Rejestracja",
  description: "Załóż konto i rozpocznij zapis na kurs prawa jazdy kat. B.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RejestracjaPage() {
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
      redirect("/instruktor");
    }

    if (dbUser?.isAccountActive) {
      redirect("/kursant");
    }

    if (dbUser?.isRegistrationComplete) {
      redirect("/kursant/oczekiwanie");
    }

    if (dbUser?.birthDate) {
      redirect("/rejestracja/dokument");
    }

    redirect("/rejestracja/prawo-jazdy");
  }

  return <RejestracjaPageContent />;
}
