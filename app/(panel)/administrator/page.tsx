import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { DashboardPageContent } from "./_components/dashboard-page-content";

type MonthPoint = {
  label: string;
  shortLabel: string;
  value: number;
};

function getLastMonthsLabels(monthCount: number) {
  const now = new Date();
  const labels: { key: string; shortLabel: string; fullLabel: string }[] = [];

  for (let index = monthCount - 1; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    labels.push({
      key: `${year}-${month}`,
      shortLabel: new Intl.DateTimeFormat("pl-PL", { month: "short" }).format(date),
      fullLabel: new Intl.DateTimeFormat("pl-PL", {
        month: "long",
        year: "numeric",
      }).format(date),
    });
  }

  return labels;
}

function toMonthKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function buildMonthlyData(dates: Date[], monthCount = 6): MonthPoint[] {
  const labels = getLastMonthsLabels(monthCount);
  const counts = new Map<string, number>(labels.map((item) => [item.key, 0]));

  for (const date of dates) {
    const key = toMonthKey(date);
    if (!counts.has(key)) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return labels.map((item) => ({
    label: item.fullLabel,
    shortLabel: item.shortLabel,
    value: counts.get(item.key) ?? 0,
  }));
}

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

  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);

  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    totalStudents,
    pendingPkk,
    activeCourses,
    totalInstructors,
    activeInstructors,
    newStudentsThisWeek,
    usersForChart,
    pkkForChart,
    courseCategories,
    recentPkkUploads,
    recentCourses,
    latestAnnouncements,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.user.count({
      where: {
        role: "USER",
        isRegistrationComplete: true,
        isAccountActive: false,
        pkkFile: { isNot: null },
      },
    }),
    prisma.course.count({
      where: { status: { in: ["NABOR", "PLANOWANY"] } },
    }),
    prisma.user.count({ where: { role: "INSTRUKTOR" } }),
    prisma.user.count({
      where: { role: "INSTRUKTOR", isAccountActive: true },
    }),
    prisma.user.count({
      where: { role: "USER", createdAt: { gte: weekAgo } },
    }),
    prisma.user.findMany({
      where: { role: "USER", createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    }),
    prisma.pkkFile.findMany({
      where: { uploadedAt: { gte: sixMonthsAgo } },
      select: { uploadedAt: true },
    }),
    prisma.course.findMany({
      select: { category: true },
    }),
    prisma.pkkFile.findMany({
      orderBy: { uploadedAt: "desc" },
      take: 4,
      select: {
        id: true,
        uploadedAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
    prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        target: true,
        createdAt: true,
      },
    }),
  ]);

  const registrationsChart = buildMonthlyData(
    usersForChart.map((item) => item.createdAt),
  );
  const pkkChart = buildMonthlyData(pkkForChart.map((item) => item.uploadedAt));

  const categoryCounts = {
    A: 0,
    B: 0,
    DOSZKALANIE: 0,
  };

  for (const course of courseCategories) {
    categoryCounts[course.category] += 1;
  }

  const categoryChart = [
    { label: "Kategoria A", value: categoryCounts.A },
    { label: "Kategoria B", value: categoryCounts.B },
    { label: "Doszkalanie", value: categoryCounts.DOSZKALANIE },
  ];

  const recentActivity = [
    ...recentPkkUploads.map((item) => {
      const fullName = [item.user.firstName, item.user.lastName]
        .filter((part) => typeof part === "string" && part.trim().length > 0)
        .join(" ")
        .trim();

      return {
        id: `pkk-${item.id}`,
        title: "Nowy dokument PKK",
        description: `${fullName || "Kursant"} przesłał nowy dokument do weryfikacji.`,
        createdAt: item.uploadedAt.toISOString(),
      };
    }),
    ...recentCourses.map((course) => ({
      id: `course-${course.id}`,
      title: "Nowy kurs w ofercie",
      description: `${course.title} (${course.status.toLowerCase()})`,
      createdAt: course.createdAt.toISOString(),
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <DashboardPageContent
      firstName={dbUser?.firstName}
      stats={{
        totalStudents,
        pendingPkk,
        activeCourses,
        activeInstructors,
        totalInstructors,
        newStudentsThisWeek,
      }}
      recentActivity={recentActivity}
      analytics={{
        registrationsChart,
        pkkChart,
        categoryChart,
      }}
      latestAnnouncements={latestAnnouncements.map((item) => ({
        id: item.id,
        title: item.title,
        target: item.target,
        createdAt: item.createdAt.toISOString(),
      }))}
    />
  );
}
