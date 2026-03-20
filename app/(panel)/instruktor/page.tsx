import { getPanelUser } from "@/app/_lib/get-panel-user";
import { prisma } from "@/lib/prisma";
import { InstruktorDashboardPageContent } from "./_components/instruktor-dashboard-page-content";

export default async function InstruktorPage() {
  const dbUser = await getPanelUser({ accessTarget: "instruktor" });

  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const [assignedStudentsCount, todayLessons, plannedRidesCount, completedRidesCount] =
    await Promise.all([
      prisma.instructorStudentAssignment.count({
        where: {
          instructorId: dbUser.id,
          isActive: true,
        },
      }),
      prisma.drivingLesson.findMany({
        where: {
          instructorId: dbUser.id,
          status: "PLANOWANA",
          startsAt: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
        orderBy: {
          startsAt: "asc",
        },
        select: {
          id: true,
          startsAt: true,
          topic: true,
          student: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.drivingLesson.count({
        where: {
          instructorId: dbUser.id,
          status: "PLANOWANA",
        },
      }),
      prisma.drivingLesson.count({
        where: {
          instructorId: dbUser.id,
          status: "ZREALIZOWANA",
        },
      }),
    ]);

  const todayRides = todayLessons.map((lesson) => {
    const fullName = [lesson.student.firstName, lesson.student.lastName]
      .filter((part) => typeof part === "string" && part.trim().length > 0)
      .join(" ")
      .trim();

    return {
      id: lesson.id,
      time: lesson.startsAt
        ? new Intl.DateTimeFormat("pl-PL", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(lesson.startsAt)
        : "--:--",
      kursant: fullName || "Brak danych",
      type: lesson.topic,
    };
  });

  const stats = {
    assignedStudentsCount,
    todayRidesCount: todayLessons.length,
    plannedRidesCount,
    completedRidesCount,
  };

  return (
    <InstruktorDashboardPageContent
      firstName={dbUser?.firstName}
      stats={stats}
      todayRides={todayRides}
    />
  );
}
