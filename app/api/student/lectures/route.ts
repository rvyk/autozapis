import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type UserRole = "ADMINISTRATOR" | "INSTRUKTOR" | "USER";
type AttendanceStatus = "ENROLLED" | "PRESENT" | "ABSENT";

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
          theoryHoursRequired: true;
        };
      }) => Promise<
        {
          id: string;
          role: UserRole;
          theoryHoursRequired: number;
        } | null
      >;
    };
    lectureAttendance?: {
      findMany: (args: {
        where: { studentId: string };
        orderBy: { lectureSession: { startsAt: "asc" } };
        select: {
          id: true;
          status: true;
          creditedMinutes: true;
          lectureSession: {
            select: {
              id: true;
              title: true;
              topicType: true;
              startsAt: true;
              durationMinutes: true;
            };
          };
        };
      }) => Promise<
        {
          id: string;
          status: AttendanceStatus;
          creditedMinutes: number;
          lectureSession: {
            id: string;
            title: string;
            topicType: string;
            startsAt: Date;
            durationMinutes: number;
          };
        }[]
      >;
    };
  };

  const userDelegate = prismaDelegates.user;
  const attendanceDelegate = prismaDelegates.lectureAttendance;

  if (!userDelegate || !attendanceDelegate) {
    return Response.json({ error: "PRISMA_CLIENT_OUTDATED" }, { status: 500 });
  }

  const student = await userDelegate.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      role: true,
      theoryHoursRequired: true,
    },
  });

  if (!student || student.role !== "USER") {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const attendances = await attendanceDelegate.findMany({
    where: { studentId: student.id },
    orderBy: { lectureSession: { startsAt: "asc" } },
    select: {
      id: true,
      status: true,
      creditedMinutes: true,
      lectureSession: {
        select: {
          id: true,
          title: true,
          topicType: true,
          startsAt: true,
          durationMinutes: true,
        },
      },
    },
  });

  const lectures = attendances.map((item) => ({
    attendanceId: item.id,
    status: item.status,
    creditedMinutes: item.creditedMinutes,
    session: {
      id: item.lectureSession.id,
      title: item.lectureSession.title,
      topicType: item.lectureSession.topicType,
      startsAt: item.lectureSession.startsAt.toISOString(),
      durationMinutes: item.lectureSession.durationMinutes,
    },
  }));

  const theoryMinutesDone = attendances.reduce((total, item) => {
    if (item.status !== "PRESENT") return total;
    return total + item.creditedMinutes;
  }, 0);

  return Response.json({
    lectures,
    theoryHoursDone: Math.floor(theoryMinutesDone / 60),
    theoryHoursRequired: student.theoryHoursRequired,
  });
}
