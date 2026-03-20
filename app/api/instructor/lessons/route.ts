import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type LessonStatus = "PLANOWANA" | "ZREALIZOWANA" | "ODWOLANA";

type LessonRow = {
  id: string;
  studentId: string;
  startsAt: Date | null;
  durationMinutes: number;
  topic: string;
  routeSummary: string | null;
  status: LessonStatus;
  student: {
    firstName: string | null;
    lastName: string | null;
  };
};

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const prismaDelegates = prisma as unknown as {
    user?: {
      findUnique: (args: {
        where: { clerkId: string };
        select: { id: true; role: true };
      }) => Promise<{ id: string; role: "ADMINISTRATOR" | "INSTRUKTOR" | "USER" } | null>;
    };
    drivingLesson?: {
      findMany: (args: {
        where: { instructorId: string; status: "PLANOWANA" };
        orderBy: { startsAt: "asc" };
        select: {
          id: true;
          studentId: true;
          startsAt: true;
          durationMinutes: true;
          topic: true;
          routeSummary: true;
          status: true;
          student: {
            select: {
              firstName: true;
              lastName: true;
            };
          };
        };
      }) => Promise<LessonRow[]>;
    };
  };

  const userDelegate = prismaDelegates.user;
  const lessonDelegate = prismaDelegates.drivingLesson;

  if (!userDelegate || !lessonDelegate) {
    return Response.json(
      {
        error: "PRISMA_CLIENT_OUTDATED",
        detail: "Restart dev server and run prisma generate.",
      },
      { status: 500 },
    );
  }

  const instructor = await userDelegate.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true },
  });

  if (!instructor || instructor.role !== "INSTRUKTOR") {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const lessons = await lessonDelegate.findMany({
    where: {
      instructorId: instructor.id,
      status: "PLANOWANA",
    },
    orderBy: { startsAt: "asc" },
    select: {
      id: true,
      studentId: true,
      startsAt: true,
      durationMinutes: true,
      topic: true,
      routeSummary: true,
      status: true,
      student: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  const rides = lessons
    .filter((lesson) => lesson.startsAt)
    .map((lesson) => {
      const fullName = [lesson.student.firstName, lesson.student.lastName]
        .filter((part) => typeof part === "string" && part.trim().length > 0)
        .join(" ")
        .trim();

      return {
        id: lesson.id,
        studentId: lesson.studentId,
        studentName: fullName || "Brak danych",
        startsAt: (lesson.startsAt as Date).toISOString(),
        topic: lesson.topic,
        route: lesson.routeSummary || "",
        durationHours: Math.max(1, Math.round(lesson.durationMinutes / 60)),
        status: lesson.status,
      };
    });

  return Response.json({ rides });
}
