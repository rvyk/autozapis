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
  routeScore: number | null;
  status: LessonStatus;
};

function normalizeString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function parsePositiveNumber(value: unknown): number | null {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return Math.floor(number);
}

function parseStatus(value: unknown): LessonStatus | null {
  if (value === "PLANOWANA" || value === "ZREALIZOWANA" || value === "ODWOLANA") {
    return value;
  }
  return null;
}

function toApiLesson(lesson: LessonRow) {
  return {
    id: lesson.id,
    startsAt: lesson.startsAt ? lesson.startsAt.toISOString().slice(0, 16) : "",
    durationHours: Math.max(1, Math.round(lesson.durationMinutes / 60)),
    topic: lesson.topic,
    route: lesson.routeSummary || "",
    instructorNote: lesson.instructorFeedback || "",
    routeScore: (lesson.routeScore ?? 3) as 1 | 2 | 3 | 4 | 5,
    status: lesson.status,
  };
}

async function getInstructorFromAuth() {
  const { userId } = await auth();

  if (!userId) {
    return { error: Response.json({ error: "UNAUTHORIZED" }, { status: 401 }) };
  }

  const prismaDelegates = prisma as unknown as {
    user?: {
      findUnique: (args: {
        where: { clerkId: string };
        select: { id: true; role: true };
      }) => Promise<{ id: string; role: "ADMINISTRATOR" | "INSTRUKTOR" | "USER" } | null>;
    };
  };

  const userDelegate = prismaDelegates.user;
  if (!userDelegate) {
    return {
      error: Response.json(
        {
          error: "PRISMA_CLIENT_OUTDATED",
          detail: "Restart dev server and run prisma generate.",
        },
        { status: 500 },
      ),
    };
  }

  const instructor = await userDelegate.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true },
  });

  if (!instructor || instructor.role !== "INSTRUKTOR") {
    return { error: Response.json({ error: "FORBIDDEN" }, { status: 403 }) };
  }

  return { instructorId: instructor.id };
}

async function ensureAssignedToInstructor(instructorId: string, studentId: string) {
  const prismaDelegates = prisma as unknown as {
    instructorStudentAssignment?: {
      findFirst: (args: {
        where: {
          instructorId: string;
          studentId: string;
          isActive: true;
        };
        select: { id: true };
      }) => Promise<{ id: string } | null>;
    };
    user?: {
      findUnique: (args: {
        where: { id: string };
        select: { id: true; role: true };
      }) => Promise<{ id: string; role: "ADMINISTRATOR" | "INSTRUKTOR" | "USER" } | null>;
    };
  };

  const assignmentDelegate = prismaDelegates.instructorStudentAssignment;
  const userDelegate = prismaDelegates.user;

  if (!assignmentDelegate || !userDelegate) {
    return { error: Response.json({ error: "PRISMA_CLIENT_OUTDATED" }, { status: 500 }) };
  }

  const student = await userDelegate.findUnique({
    where: { id: studentId },
    select: { id: true, role: true },
  });

  if (!student || student.role !== "USER") {
    return { error: Response.json({ error: "NOT_FOUND" }, { status: 404 }) };
  }

  const assignment = await assignmentDelegate.findFirst({
    where: { instructorId, studentId, isActive: true },
    select: { id: true },
  });

  if (!assignment) {
    return { error: Response.json({ error: "FORBIDDEN" }, { status: 403 }) };
  }

  return { ok: true };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ studentId: string }> },
) {
  const authResult = await getInstructorFromAuth();
  if ("error" in authResult) return authResult.error;

  const { studentId } = await context.params;

  const assignmentCheck = await ensureAssignedToInstructor(authResult.instructorId, studentId);
  if ("error" in assignmentCheck) return assignmentCheck.error;

  const prismaDelegates = prisma as unknown as {
    drivingLesson?: {
      findMany: (args: {
        where: { studentId: string; instructorId: string };
        orderBy: { startsAt: "desc" };
        select: {
          id: true;
          startsAt: true;
          durationMinutes: true;
          topic: true;
          routeSummary: true;
          instructorFeedback: true;
          routeScore: true;
          status: true;
        };
      }) => Promise<LessonRow[]>;
    };
    user?: {
      findUnique: (args: {
        where: { id: string };
        select: {
          id: true;
          firstName: true;
          lastName: true;
          phoneNumber: true;
          trainingCategory: true;
          trainingHoursCompleted: true;
          trainingHoursRequired: true;
        };
      }) => Promise<
        {
          id: string;
          firstName: string | null;
          lastName: string | null;
          phoneNumber: string | null;
          trainingCategory: "A" | "B";
          trainingHoursCompleted: number;
          trainingHoursRequired: number;
        } | null
      >;
    };
  };

  const lessonDelegate = prismaDelegates.drivingLesson;
  const userDelegate = prismaDelegates.user;

  if (!lessonDelegate || !userDelegate) {
    return Response.json({ error: "PRISMA_CLIENT_OUTDATED" }, { status: 500 });
  }

  const [student, lessons] = await Promise.all([
    userDelegate.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        trainingCategory: true,
        trainingHoursCompleted: true,
        trainingHoursRequired: true,
      },
    }),
    lessonDelegate.findMany({
      where: { studentId, instructorId: authResult.instructorId },
      orderBy: { startsAt: "desc" },
      select: {
        id: true,
        startsAt: true,
        durationMinutes: true,
        topic: true,
        routeSummary: true,
        instructorFeedback: true,
        routeScore: true,
        status: true,
      },
    }),
  ]);

  if (!student) {
    return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const hoursDone = lessons.reduce((total, lesson) => {
    if (lesson.status !== "ZREALIZOWANA") return total;
    return total + Math.max(0, lesson.durationMinutes / 60);
  }, 0);

  const fullName = [student.firstName, student.lastName]
    .filter((part) => typeof part === "string" && part.trim().length > 0)
    .join(" ")
    .trim();

  return Response.json({
    student: {
      id: student.id,
      fullName: fullName || "Brak danych",
      phone: student.phoneNumber || "Brak numeru",
      category: student.trainingCategory,
      hoursDone: Math.floor(hoursDone),
      hoursTarget: student.trainingHoursRequired,
    },
    rides: lessons.map(toApiLesson),
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ studentId: string }> },
) {
  const authResult = await getInstructorFromAuth();
  if ("error" in authResult) return authResult.error;

  const { studentId } = await context.params;

  const assignmentCheck = await ensureAssignedToInstructor(authResult.instructorId, studentId);
  if ("error" in assignmentCheck) return assignmentCheck.error;

  const payload = (await request.json().catch(() => null)) as {
    startsAt?: unknown;
    durationHours?: unknown;
    topic?: unknown;
    route?: unknown;
  } | null;

  const startsAtString = normalizeString(payload?.startsAt, 40);
  const durationHours = parsePositiveNumber(payload?.durationHours);
  const topic = normalizeString(payload?.topic, 160);
  const route = normalizeString(payload?.route, 220);

  if (!startsAtString || durationHours === null || !topic) {
    return Response.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const startsAt = new Date(startsAtString);
  if (Number.isNaN(startsAt.getTime())) {
    return Response.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const prismaDelegates = prisma as unknown as {
    drivingLesson?: {
      create: (args: {
        data: {
          studentId: string;
          instructorId: string;
          startsAt: Date;
          durationMinutes: number;
          topic: string;
          routeSummary: string | null;
          status: "PLANOWANA";
        };
        select: {
          id: true;
          startsAt: true;
          durationMinutes: true;
          topic: true;
          routeSummary: true;
          instructorFeedback: true;
          routeScore: true;
          status: true;
        };
      }) => Promise<LessonRow>;
    };
  };

  const lessonDelegate = prismaDelegates.drivingLesson;
  if (!lessonDelegate) {
    return Response.json({ error: "PRISMA_CLIENT_OUTDATED" }, { status: 500 });
  }

  const lesson = await lessonDelegate.create({
    data: {
      studentId,
      instructorId: authResult.instructorId,
      startsAt,
      durationMinutes: durationHours * 60,
      topic,
      routeSummary: route || null,
      status: "PLANOWANA",
    },
    select: {
      id: true,
      startsAt: true,
      durationMinutes: true,
      topic: true,
      routeSummary: true,
      instructorFeedback: true,
      routeScore: true,
      status: true,
    },
  });

  return Response.json({ ride: toApiLesson(lesson) }, { status: 201 });
}
