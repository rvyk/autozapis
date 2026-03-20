import { getPanelUser } from "@/app/_lib/get-panel-user";
import { formatPlTime } from "@/app/_lib/date-format";
import { prisma } from "@/lib/prisma";
import { InstruktorDashboardPageContent } from "./_components/instruktor-dashboard-page-content";

export default async function InstruktorPage() {
  const dbUser = await getPanelUser({ accessTarget: "instruktor" });

  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const [assignedStudentsCount, todayLessons, todayLectures, plannedRidesCount, plannedLecturesCount, completedRidesCount] =
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
      prisma.lectureSession.findMany({
        where: {
          instructorId: dbUser.id,
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
          title: true,
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
      prisma.lectureSession.count({
        where: {
          instructorId: dbUser.id,
        },
      }),
    ]);

  const todayRideItems = todayLessons.map((lesson) => {
    const fullName = [lesson.student.firstName, lesson.student.lastName]
      .filter((part) => typeof part === "string" && part.trim().length > 0)
      .join(" ")
      .trim();

    return {
      id: lesson.id,
      time: lesson.startsAt ? formatPlTime(lesson.startsAt) : "--:--",
      kursant: fullName || "Brak danych",
      type: lesson.topic,
    };
  });

  const todayLectureItems = todayLectures.map((lecture) => ({
    id: `lecture-${lecture.id}`,
    time: formatPlTime(lecture.startsAt),
    kursant: "Wyklad",
    type: lecture.title,
  }));

  const todayRides = [...todayRideItems, ...todayLectureItems].sort((a, b) =>
    a.time.localeCompare(b.time),
  );

  const stats = {
    assignedStudentsCount,
    todayRidesCount: todayRideItems.length,
    todayLecturesCount: todayLectureItems.length,
    plannedRidesCount,
    plannedLecturesCount,
    completedRidesCount,
    canTeachPractice: Boolean(dbUser.canTeachPractice),
    canTeachTheory: Boolean(dbUser.canTeachTheory),
  };

  return (
    <InstruktorDashboardPageContent
      firstName={dbUser?.firstName}
      stats={stats}
      todayRides={todayRides}
    />
  );
}
