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

function parseStatus(value: unknown): LessonStatus | null {
  if (value === "PLANOWANA" || value === "ZREALIZOWANA" || value === "ODWOLANA") {
    return value;
  }
  return null;
}

function parseScore(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return null;
  const score = Math.floor(parsed);
  if (score < 1 || score > 5) return null;
  return score;
}

function parseDurationHours(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.max(1, Math.floor(parsed));
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

export async function PATCH(
  request: Request,
  context: { params: Promise<{ lessonId: string }> },
) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { lessonId } = await context.params;

  const payload = (await request.json().catch(() => null)) as {
    startsAt?: unknown;
    durationHours?: unknown;
    topic?: unknown;
    route?: unknown;
    instructorNote?: unknown;
    routeScore?: unknown;
    status?: unknown;
  } | null;

  const startsAtString = normalizeString(payload?.startsAt, 40);
  const durationHours = parseDurationHours(payload?.durationHours);
  const topic = normalizeString(payload?.topic, 160);
  const route = normalizeString(payload?.route, 220);
  const instructorNote = normalizeString(payload?.instructorNote, 3000);
  const status = parseStatus(payload?.status);
  const routeScore = parseScore(payload?.routeScore);

  if (!startsAtString || durationHours === null || !topic || !status || routeScore === null) {
    return Response.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const startsAt = new Date(startsAtString);
  if (Number.isNaN(startsAt.getTime())) {
    return Response.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const prismaDelegates = prisma as unknown as {
    user?: {
      findUnique: (args: {
        where: { clerkId: string };
        select: { id: true; role: true; canTeachPractice: true };
      }) => Promise<
        | {
            id: string;
            role: "ADMINISTRATOR" | "INSTRUKTOR" | "USER";
            canTeachPractice: boolean;
          }
        | null
      >;
    };
    drivingLesson?: {
      findUnique: (args: {
        where: { id: string };
        select: { id: true; instructorId: true };
      }) => Promise<{ id: string; instructorId: string } | null>;
      update: (args: {
        where: { id: string };
        data: {
          startsAt: Date;
          durationMinutes: number;
          topic: string;
          routeSummary: string | null;
          instructorFeedback: string | null;
          routeScore: number;
          status: LessonStatus;
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
      delete: (args: { where: { id: string } }) => Promise<{ id: string }>;
    };
  };

  const userDelegate = prismaDelegates.user;
  const lessonDelegate = prismaDelegates.drivingLesson;

  if (!userDelegate || !lessonDelegate) {
    return Response.json({ error: "PRISMA_CLIENT_OUTDATED" }, { status: 500 });
  }

  const instructor = await userDelegate.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true, canTeachPractice: true },
  });

  if (!instructor || instructor.role !== "INSTRUKTOR" || !instructor.canTeachPractice) {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const lesson = await lessonDelegate.findUnique({
    where: { id: lessonId },
    select: { id: true, instructorId: true },
  });

  if (!lesson) {
    return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  if (lesson.instructorId !== instructor.id) {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const updated = await lessonDelegate.update({
    where: { id: lessonId },
    data: {
      startsAt,
      durationMinutes: durationHours * 60,
      topic,
      routeSummary: route || null,
      instructorFeedback: instructorNote || null,
      routeScore,
      status,
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

  return Response.json({ ride: toApiLesson(updated) });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ lessonId: string }> },
) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { lessonId } = await context.params;

  const prismaDelegates = prisma as unknown as {
    user?: {
      findUnique: (args: {
        where: { clerkId: string };
        select: { id: true; role: true; canTeachPractice: true };
      }) => Promise<
        | {
            id: string;
            role: "ADMINISTRATOR" | "INSTRUKTOR" | "USER";
            canTeachPractice: boolean;
          }
        | null
      >;
    };
    drivingLesson?: {
      findUnique: (args: {
        where: { id: string };
        select: { id: true; instructorId: true };
      }) => Promise<{ id: string; instructorId: string } | null>;
      delete: (args: { where: { id: string } }) => Promise<{ id: string }>;
    };
  };

  const userDelegate = prismaDelegates.user;
  const lessonDelegate = prismaDelegates.drivingLesson;

  if (!userDelegate || !lessonDelegate) {
    return Response.json({ error: "PRISMA_CLIENT_OUTDATED" }, { status: 500 });
  }

  const instructor = await userDelegate.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true, canTeachPractice: true },
  });

  if (!instructor || instructor.role !== "INSTRUKTOR" || !instructor.canTeachPractice) {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const lesson = await lessonDelegate.findUnique({
    where: { id: lessonId },
    select: { id: true, instructorId: true },
  });

  if (!lesson) {
    return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  if (lesson.instructorId !== instructor.id) {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  await lessonDelegate.delete({ where: { id: lessonId } });

  return Response.json({ ok: true });
}
