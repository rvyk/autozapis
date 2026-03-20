import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function LogowanieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (userId) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true, isRegistrationComplete: true, isAccountActive: true },
    });

    if (dbUser?.role === "ADMINISTRATOR") {
      redirect("/administrator");
    }

    if (dbUser?.role === "INSTRUKTOR") {
      redirect("/");
    }

    if (dbUser?.isRegistrationComplete || dbUser?.isAccountActive) {
      redirect("/");
    }

    redirect("/rejestracja");
  }

  return children;
}
