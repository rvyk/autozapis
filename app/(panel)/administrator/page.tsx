import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { DashboardPageContent } from "./_components/dashboard-page-content";

export default async function AdministratorPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/logowanie");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true, firstName: true },
  });

  if (dbUser?.role !== "ADMINISTRATOR") {
    redirect("/kursant");
  }

  return <DashboardPageContent firstName={dbUser?.firstName} />;
}
