import { getPanelUser } from "@/app/_lib/get-panel-user";
import { prisma } from "@/lib/prisma";
import { JazdyPageContent } from "./_components/jazdy-page-content";
import type { StudentRide } from "./_components/jazdy-types";

export default async function JazdyPage() {
  const dbUser = await getPanelUser({ accessTarget: "kursant" });

  const lessons = await prisma.drivingLesson.findMany({
    where: { studentId: dbUser.id },
    orderBy: { startsAt: "desc" },
    select: {
      id: true,
      startsAt: true,
      durationMinutes: true,
      topic: true,
      routeSummary: true,
      instructorFeedback: true,
      status: true,
      instructor: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  const rides: StudentRide[] = lessons.map((lesson) => {
    const instructorName = [lesson.instructor.firstName, lesson.instructor.lastName]
      .filter((part) => typeof part === "string" && part.trim().length > 0)
      .join(" ")
      .trim();

    return {
      id: lesson.id,
      startsAt: lesson.startsAt ? lesson.startsAt.toISOString() : "",
      durationHours: Math.max(1, Math.round(lesson.durationMinutes / 60)),
      topic: lesson.topic,
      route: lesson.routeSummary || "",
      instructorNote: lesson.instructorFeedback || "",
      status: lesson.status,
      instructorName: instructorName || "Instruktor",
    };
  });

  const completedHours = lessons.reduce((total, lesson) => {
    if (lesson.status !== "ZREALIZOWANA") return total;
    return total + Math.max(0, lesson.durationMinutes / 60);
  }, 0);

  return (
    <JazdyPageContent
      rides={rides}
      hoursDone={Math.floor(completedHours)}
      hoursTarget={dbUser.trainingHoursRequired ?? 30}
    />
  );
}
