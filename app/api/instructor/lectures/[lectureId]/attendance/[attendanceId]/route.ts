import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type UserRole = "ADMINISTRATOR" | "INSTRUKTOR" | "USER";
type AttendanceStatus = "ENROLLED" | "PRESENT" | "ABSENT";

function parseStatus(value: unknown): AttendanceStatus | null {
  if (value === "ENROLLED" || value === "PRESENT" || value === "ABSENT") {
    return value;
  }
  return null;
}

async function getInstructorIdFromAuth() {
  const { userId } = await auth();
  if (!userId) {
    return { error: Response.json({ error: "UNAUTHORIZED" }, { status: 401 }) };
  }

  const prismaDelegates = prisma as unknown as {
    user?: {
      findUnique: (args: {
        where: { clerkId: string };
        select: { id: true; role: true };
      }) => Promise<{ id: string; role: UserRole } | null>;
    };
  };

  const userDelegate = prismaDelegates.user;
  if (!userDelegate) {
    return { error: Response.json({ error: "PRISMA_CLIENT_OUTDATED" }, { status: 500 }) };
  }

  const dbUser = await userDelegate.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true },
  });

  if (!dbUser || dbUser.role !== "INSTRUKTOR") {
    return { error: Response.json({ error: "FORBIDDEN" }, { status: 403 }) };
  }

  return { instructorId: dbUser.id };
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ lectureId: string; attendanceId: string }> },
) {
  const authResult = await getInstructorIdFromAuth();
  if ("error" in authResult) return authResult.error;

  const { lectureId, attendanceId } = await context.params;
  const payload = (await request.json().catch(() => null)) as {
    status?: unknown;
  } | null;

  const nextStatus = parseStatus(payload?.status);
  if (!nextStatus) {
    return Response.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const prismaDelegates = prisma as unknown as {
    lectureSession?: {
      findUnique: (args: {
        where: { id: string };
        select: { id: true; instructorId: true; durationMinutes: true };
      }) => Promise<{ id: string; instructorId: string; durationMinutes: number } | null>;
    };
    lectureAttendance?: {
      findFirst: (args: {
        where: { id: string; lectureSessionId: string };
        select: { id: true };
      }) => Promise<{ id: string } | null>;
      update: (args: {
        where: { id: string };
        data: {
          status: AttendanceStatus;
          creditedMinutes: number;
        };
        select: {
          id: true;
          status: true;
          creditedMinutes: true;
        };
      }) => Promise<{ id: string; status: AttendanceStatus; creditedMinutes: number }>;
    };
  };

  const lectureDelegate = prismaDelegates.lectureSession;
  const attendanceDelegate = prismaDelegates.lectureAttendance;

  if (!lectureDelegate || !attendanceDelegate) {
    return Response.json({ error: "PRISMA_CLIENT_OUTDATED" }, { status: 500 });
  }

  const lecture = await lectureDelegate.findUnique({
    where: { id: lectureId },
    select: { id: true, instructorId: true, durationMinutes: true },
  });

  if (!lecture) {
    return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  if (lecture.instructorId !== authResult.instructorId) {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const attendanceExists = await attendanceDelegate.findFirst({
    where: {
      id: attendanceId,
      lectureSessionId: lectureId,
    },
    select: { id: true },
  });

  if (!attendanceExists) {
    return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  try {
    const attendance = await attendanceDelegate.update({
      where: { id: attendanceId },
      data: {
        status: nextStatus,
        creditedMinutes: nextStatus === "PRESENT" ? lecture.durationMinutes : 0,
      },
      select: {
        id: true,
        status: true,
        creditedMinutes: true,
      },
    });

    return Response.json({ attendance });
  } catch {
    return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  }
}
