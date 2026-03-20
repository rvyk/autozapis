import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type UserRole = "ADMINISTRATOR" | "INSTRUKTOR" | "USER";
type AttendanceStatus = "ENROLLED" | "PRESENT" | "ABSENT";

function normalizeString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function parsePositiveInt(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.floor(parsed);
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

export async function GET() {
  const authResult = await getInstructorIdFromAuth();
  if ("error" in authResult) return authResult.error;

  const prismaDelegates = prisma as unknown as {
    lectureSession?: {
      findMany: (args: {
        where: { instructorId: string };
        orderBy: { startsAt: "asc" };
        select: {
          id: true;
          title: true;
          topicType: true;
          startsAt: true;
          durationMinutes: true;
          notes: true;
          attendances: {
            select: {
              id: true;
              status: true;
              creditedMinutes: true;
              student: {
                select: {
                  id: true;
                  firstName: true;
                  lastName: true;
                  phoneNumber: true;
                };
              };
            };
            orderBy: {
              student: {
                firstName: "asc";
              };
            };
          };
        };
      }) => Promise<
        {
          id: string;
          title: string;
          topicType: string;
          startsAt: Date;
          durationMinutes: number;
          notes: string | null;
          attendances: {
            id: string;
            status: AttendanceStatus;
            creditedMinutes: number;
            student: {
              id: string;
              firstName: string | null;
              lastName: string | null;
              phoneNumber: string | null;
            };
          }[];
        }[]
      >;
    };
  };

  const lectureDelegate = prismaDelegates.lectureSession;
  if (!lectureDelegate) {
    return Response.json({ error: "PRISMA_CLIENT_OUTDATED" }, { status: 500 });
  }

  const lectures = await lectureDelegate.findMany({
    where: { instructorId: authResult.instructorId },
    orderBy: { startsAt: "asc" },
    select: {
      id: true,
      title: true,
      topicType: true,
      startsAt: true,
      durationMinutes: true,
      notes: true,
      attendances: {
        select: {
          id: true,
          status: true,
          creditedMinutes: true,
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
            },
          },
        },
        orderBy: {
          student: {
            firstName: "asc",
          },
        },
      },
    },
  });

  const payload = lectures.map((lecture) => ({
    id: lecture.id,
    title: lecture.title,
    topicType: lecture.topicType,
    startsAt: lecture.startsAt.toISOString(),
    durationMinutes: lecture.durationMinutes,
    notes: lecture.notes || "",
    attendees: lecture.attendances.map((attendance) => ({
      attendanceId: attendance.id,
      status: attendance.status,
      creditedMinutes: attendance.creditedMinutes,
      student: {
        id: attendance.student.id,
        fullName:
          `${attendance.student.firstName ?? ""} ${attendance.student.lastName ?? ""}`.trim() ||
          "Brak danych",
        phone: attendance.student.phoneNumber || "Brak numeru",
      },
    })),
  }));

  return Response.json({ lectures: payload });
}

export async function POST(request: Request) {
  const authResult = await getInstructorIdFromAuth();
  if ("error" in authResult) return authResult.error;

  const payload = (await request.json().catch(() => null)) as {
    title?: unknown;
    topicType?: unknown;
    startsAt?: unknown;
    durationMinutes?: unknown;
    notes?: unknown;
    studentIds?: unknown;
  } | null;

  const title = normalizeString(payload?.title, 180);
  const topicType = normalizeString(payload?.topicType, 100);
  const startsAtRaw = normalizeString(payload?.startsAt, 40);
  const durationMinutes = parsePositiveInt(payload?.durationMinutes);
  const notes = normalizeString(payload?.notes, 1200);
  const studentIds = Array.isArray(payload?.studentIds)
    ? payload?.studentIds.filter((item): item is string => typeof item === "string" && item.length > 0)
    : [];

  if (!title || !topicType || !startsAtRaw || !durationMinutes || studentIds.length === 0) {
    return Response.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const startsAt = new Date(startsAtRaw);
  if (Number.isNaN(startsAt.getTime())) {
    return Response.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const prismaDelegates = prisma as unknown as {
    instructorStudentAssignment?: {
      findMany: (args: {
        where: { instructorId: string; isActive: true; studentId: { in: string[] } };
        select: { studentId: true };
      }) => Promise<{ studentId: string }[]>;
    };
    lectureSession?: {
      create: (args: {
        data: {
          instructorId: string;
          title: string;
          topicType: string;
          startsAt: Date;
          durationMinutes: number;
          notes: string | null;
          attendances: {
            create: {
              studentId: string;
              status: "ENROLLED";
              creditedMinutes: number;
            }[];
          };
        };
        select: {
          id: true;
          title: true;
          topicType: true;
          startsAt: true;
          durationMinutes: true;
          notes: true;
        };
      }) => Promise<{
        id: string;
        title: string;
        topicType: string;
        startsAt: Date;
        durationMinutes: number;
        notes: string | null;
      }>;
    };
  };

  const assignmentDelegate = prismaDelegates.instructorStudentAssignment;
  const lectureDelegate = prismaDelegates.lectureSession;

  if (!assignmentDelegate || !lectureDelegate) {
    return Response.json({ error: "PRISMA_CLIENT_OUTDATED" }, { status: 500 });
  }

  const assignedStudents = await assignmentDelegate.findMany({
    where: {
      instructorId: authResult.instructorId,
      isActive: true,
      studentId: { in: studentIds },
    },
    select: { studentId: true },
  });

  const assignedIds = new Set(assignedStudents.map((item) => item.studentId));
  if (assignedIds.size !== studentIds.length) {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const lecture = await lectureDelegate.create({
    data: {
      instructorId: authResult.instructorId,
      title,
      topicType,
      startsAt,
      durationMinutes,
      notes: notes || null,
      attendances: {
        create: studentIds.map((studentId) => ({
          studentId,
          status: "ENROLLED",
          creditedMinutes: 0,
        })),
      },
    },
    select: {
      id: true,
      title: true,
      topicType: true,
      startsAt: true,
      durationMinutes: true,
      notes: true,
    },
  });

  return Response.json(
    {
      lecture: {
        id: lecture.id,
        title: lecture.title,
        topicType: lecture.topicType,
        startsAt: lecture.startsAt.toISOString(),
        durationMinutes: lecture.durationMinutes,
        notes: lecture.notes || "",
      },
    },
    { status: 201 },
  );
}
