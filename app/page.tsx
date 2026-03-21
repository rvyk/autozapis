import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { LandingPage } from "./_components/home/landing-page";
import { createPageMetadata } from "./seo";

export const metadata = createPageMetadata(
  "Prawo Jazdy Józef Majkut - OSK Leżajsk i okolice",
  "Zapisz się online na kurs prawa jazdy kat. B. OSK Prawo Jazdy Józef Majkut działa w Grodzisku Górnym, Grodzisku Dolnym, Żołyni i Leżajsku.",
  "/",
);

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
      redirect("/instruktor");
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

  return <LandingPage />;
}
