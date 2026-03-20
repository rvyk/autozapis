import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type AccessTarget = "administrator" | "kursant" | "instruktor";

type GetPanelUserOptions = {
  accessTarget: AccessTarget;
  instructorRedirectTo?: string;
};

export async function getPanelUser({
  accessTarget,
  instructorRedirectTo = "/",
}: GetPanelUserOptions) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/logowanie");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      role: true,
      canTeachPractice: true,
      canTeachTheory: true,
      trainingCategory: true,
      isAccountActive: true,
      isRegistrationComplete: true,
      birthDate: true,
      firstName: true,
    },
  });

  if (dbUser?.role === "INSTRUKTOR" && accessTarget !== "instruktor") {
    redirect(instructorRedirectTo);
  }

  if (!dbUser?.isRegistrationComplete) {
    if (dbUser?.birthDate) {
      redirect("/rejestracja/dokument");
    }

    redirect("/rejestracja/prawo-jazdy");
  }

  if (accessTarget === "administrator") {
    if (dbUser?.role === "ADMINISTRATOR") {
      return dbUser;
    }

    if (!dbUser?.isAccountActive) {
      redirect("/kursant/oczekiwanie");
    }

    redirect("/kursant");
  }

  if (accessTarget === "instruktor") {
    if (dbUser?.role === "INSTRUKTOR") {
      return dbUser;
    }

    if (dbUser?.role === "ADMINISTRATOR") {
      redirect("/administrator");
    }

    if (!dbUser?.isAccountActive) {
      redirect("/kursant/oczekiwanie");
    }

    redirect("/kursant");
  }

  if (dbUser?.role === "ADMINISTRATOR") {
    redirect("/administrator");
  }

  return dbUser;
}
