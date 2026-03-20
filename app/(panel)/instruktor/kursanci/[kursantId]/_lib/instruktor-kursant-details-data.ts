import { prisma } from "@/lib/prisma";
import type { TrainingStudent } from "../_components/instruktor-kursant-details-types";

type AssignmentDelegate = {
  findFirst: (args: {
    where: {
      instructorId: string;
      studentId: string;
      isActive: true;
    };
    select: { id: true };
  }) => Promise<{ id: string } | null>;
};

type UserDelegate = {
  findUnique: (args: {
    where: { id: string };
    select: {
      id: true;
      firstName: true;
      lastName: true;
      phoneNumber: true;
      trainingCategory: true;
      trainingHoursRequired: true;
    };
  }) => Promise<
    | {
        id: string;
        firstName: string | null;
        lastName: string | null;
        phoneNumber: string | null;
        trainingCategory: "A" | "B";
        trainingHoursRequired: number;
      }
    | null
  >;
};

type LessonDelegate = {
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
  }) => Promise<
    {
      id: string;
      startsAt: Date | null;
      durationMinutes: number;
      topic: string;
      routeSummary: string | null;
      instructorFeedback: string | null;
      routeScore: number | null;
      status: "PLANOWANA" | "ZREALIZOWANA" | "ODWOLANA";
    }[]
  >;
};

export async function getInstructorKursantDetailsData({
  instructorId,
  studentId,
}: {
  instructorId: string;
  studentId: string;
}): Promise<TrainingStudent | null> {
  const prismaDelegates = prisma as unknown as {
    instructorStudentAssignment?: AssignmentDelegate;
    user?: UserDelegate;
    drivingLesson?: LessonDelegate;
  };

  const assignmentDelegate = prismaDelegates.instructorStudentAssignment;
  const userDelegate = prismaDelegates.user;
  const lessonDelegate = prismaDelegates.drivingLesson;

  if (!assignmentDelegate || !userDelegate || !lessonDelegate) {
    return null;
  }

  const assignment = await assignmentDelegate.findFirst({
    where: {
      instructorId,
      studentId,
      isActive: true,
    },
    select: { id: true },
  });

  if (!assignment) {
    return null;
  }

  const [student, rides] = await Promise.all([
    userDelegate.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        trainingCategory: true,
        trainingHoursRequired: true,
      },
    }),
    lessonDelegate.findMany({
      where: {
        studentId,
        instructorId,
      },
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
    return null;
  }

  const fullName = [student.firstName, student.lastName]
    .filter((part) => typeof part === "string" && part.trim().length > 0)
    .join(" ")
    .trim();

  return {
    id: student.id,
    fullName: fullName || "Brak danych",
    phone: student.phoneNumber || "Brak numeru",
    category: student.trainingCategory,
    hoursTarget: student.trainingHoursRequired,
    rides: rides.map((ride) => ({
      id: ride.id,
      startsAt: ride.startsAt ? ride.startsAt.toISOString().slice(0, 16) : "",
      durationHours: Math.max(1, Math.round(ride.durationMinutes / 60)),
      topic: ride.topic,
      route: ride.routeSummary || "",
      instructorNote: ride.instructorFeedback || "",
      routeScore: (ride.routeScore ?? 3) as 1 | 2 | 3 | 4 | 5,
      status: ride.status,
    })),
  };
}
