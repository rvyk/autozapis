import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type LessonStatus = "PLANOWANA" | "ZREALIZOWANA" | "ODWOLANA";

type LessonRow = {
  id: string;
  startsAt: Date | null;
  durationMinutes: number;
  topic: string;
  routeSummary: string | null;
  instructorFeedback: string | null;
  status: LessonStatus;
  instructor: {
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
        select: {
          id: true;
          role: true;
          isAccountActive?: true;
          trainingHoursCompleted?: true;
          trainingHoursRequired?: true;
        };
      }) => Promise<
        {
          id: string;
          role: "ADMINISTRATOR" | "INSTRUKTOR" | "USER";
          isAccountActive?: boolean;
          trainingHoursCompleted?: number;
          trainingHoursRequired?: number;
        } | null
      >;
    };
    drivingLesson?: {
      findMany: (args: {
        where: { studentId: string };
        orderBy: { startsAt: "desc" };
        select: {
          id: true;
          startsAt: true;
          durationMinutes: true;
          topic: true;
          routeSummary: true;
          instructorFeedback: true;
          status: true;
          instructor: {
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

  const student = await userDelegate.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      role: true,
      isAccountActive: true,
      trainingHoursCompleted: true,
      trainingHoursRequired: true,
    },
  });

  if (!student || student.role !== "USER") {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  if (!student.isAccountActive) {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const lessons = await lessonDelegate.findMany({
    where: { studentId: student.id },
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

  const rides = lessons.map((lesson) => {
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

  return Response.json({
    rides,
    hoursDone: Math.floor(completedHours),
    hoursTarget: student.trainingHoursRequired ?? 30,
  });
}
