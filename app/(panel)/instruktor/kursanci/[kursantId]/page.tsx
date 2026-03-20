import { notFound } from "next/navigation";
import { getPanelUser } from "@/app/_lib/get-panel-user";
import { prisma } from "@/lib/prisma";
import { InstruktorKursantDetailsPageContent } from "./_components/instruktor-kursant-details-page-content";

export default async function InstruktorKursantDetailsPage({
  params,
}: {
  params: Promise<{ kursantId: string }>;
}) {
  const instructor = await getPanelUser({ accessTarget: "instruktor" });

  const { kursantId } = await params;

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
  };

  const assignmentDelegate = prismaDelegates.instructorStudentAssignment;
  const userDelegate = prismaDelegates.user;
  const lessonDelegate = prismaDelegates.drivingLesson;

  if (!assignmentDelegate || !userDelegate || !lessonDelegate) {
    notFound();
  }

  const assignment = await assignmentDelegate.findFirst({
    where: {
      instructorId: (instructor as { id: string }).id,
      studentId: kursantId,
      isActive: true,
    },
    select: { id: true },
  });

  if (!assignment) {
    notFound();
  }

  const [student, rides] = await Promise.all([
    userDelegate.findUnique({
      where: { id: kursantId },
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
      where: {
        studentId: kursantId,
        instructorId: (instructor as { id: string }).id,
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
    notFound();
  }

  const fullName = [student.firstName, student.lastName]
    .filter((part) => typeof part === "string" && part.trim().length > 0)
    .join(" ")
    .trim();

  const hydratedStudent = {
    id: student.id,
    fullName: fullName || "Brak danych",
    phone: student.phoneNumber || "Brak numeru",
    category: student.trainingCategory,
    hoursDone: student.trainingHoursCompleted,
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

  return (
    <InstruktorKursantDetailsPageContent initialStudent={hydratedStudent} />
  );
}
