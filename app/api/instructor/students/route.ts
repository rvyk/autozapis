import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function normalizeQuery(value: string | null) {
  return (value ?? "").trim().toLowerCase();
}

export async function GET(request: Request) {
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
      findMany: (args: {
        where: {
          role: "USER";
          isRegistrationComplete: true;
        };
        select: {
          id: true;
          firstName: true;
          lastName: true;
          phoneNumber: true;
          trainingCategory: true;
          trainingHoursCompleted: true;
          trainingHoursRequired: true;
        };
        orderBy: { createdAt: "desc" };
      }) => Promise<
        {
          id: string;
          firstName: string | null;
          lastName: string | null;
          phoneNumber: string | null;
          trainingCategory: "A" | "B";
          trainingHoursCompleted: number;
          trainingHoursRequired: number;
        }[]
      >;
    };
    instructorStudentAssignment?: {
      findMany: (args: {
        where: { isActive: true };
        select: { instructorId: true; studentId: true };
      }) => Promise<{ instructorId: string; studentId: string }[]>;
    };
    drivingLesson?: {
      findMany: (args: {
        where: {
          studentId: { in: string[] };
          status?: "ZREALIZOWANA";
        };
        select: { studentId: true; durationMinutes: true; status: true };
      }) => Promise<{ studentId: string; durationMinutes: number; status: "PLANOWANA" | "ZREALIZOWANA" | "ODWOLANA" }[]>;
    };
  };

  const userDelegate = prismaDelegates.user;
  const assignmentDelegate = prismaDelegates.instructorStudentAssignment;
  const lessonDelegate = prismaDelegates.drivingLesson;

  if (!userDelegate || !assignmentDelegate || !lessonDelegate) {
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

  const [students, assignments] = await Promise.all([
    userDelegate.findMany({
      where: {
        role: "USER",
        isRegistrationComplete: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        trainingCategory: true,
        trainingHoursCompleted: true,
        trainingHoursRequired: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    assignmentDelegate.findMany({
      where: { isActive: true },
      select: { instructorId: true, studentId: true },
    }),
  ]);

  const assignedToMe = new Set(
    assignments
      .filter((assignment) => assignment.instructorId === instructor.id)
      .map((assignment) => assignment.studentId),
  );

  const assignedAny = new Set(assignments.map((assignment) => assignment.studentId));
  const studentIds = students.map((student) => student.id);

  const completedLessons =
    studentIds.length > 0
      ? await lessonDelegate.findMany({
        where: {
          studentId: { in: studentIds },
        },
        select: {
          studentId: true,
          durationMinutes: true,
          status: true,
        },
      })
      : [];

  const completedHoursByStudent = new Map<string, number>();

  for (const lesson of completedLessons) {
    if (lesson.status === "ODWOLANA") continue;
    const previous = completedHoursByStudent.get(lesson.studentId) ?? 0;
    const next = previous + Math.max(0, lesson.durationMinutes / 60);
    completedHoursByStudent.set(lesson.studentId, next);
  }

  const url = new URL(request.url);
  const query = normalizeQuery(url.searchParams.get("q"));

  const payload = students
    .map((student) => {
      const fullName = [student.firstName, student.lastName]
        .filter((part) => typeof part === "string" && part.trim().length > 0)
        .join(" ")
        .trim();

      const isAssignedToMe = assignedToMe.has(student.id);

      return {
        id: student.id,
        fullName: fullName || "Brak danych",
        phone: student.phoneNumber || "Brak numeru",
        category: student.trainingCategory,
        hoursDone: Math.floor(completedHoursByStudent.get(student.id) ?? 0),
        hoursTarget: student.trainingHoursRequired,
        assignedToMe: isAssignedToMe,
        assignedToAnyone: assignedAny.has(student.id),
      };
    })
    .filter((student) => {
      if (!query) return true;
      return (
        student.fullName.toLowerCase().includes(query) ||
        student.phone.toLowerCase().includes(query)
      );
    });

  return Response.json({ students: payload });
}
