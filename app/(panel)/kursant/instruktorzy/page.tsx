import { getPanelUser } from "@/app/_lib/get-panel-user";
import { prisma } from "@/lib/prisma";
import { InstruktorzyPageContent } from "./_components/instruktorzy-page-content";

export default async function InstruktorzyPage() {
  const dbUser = await getPanelUser({ accessTarget: "kursant" });

  const assignedInstructorAssignment = await prisma.instructorStudentAssignment.findFirst({
    where: {
      studentId: dbUser.id,
      isActive: true,
    },
    orderBy: {
      assignedAt: "desc",
    },
    include: {
      instructor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
        },
      },
    },
  });

  const assignedInstructorId = assignedInstructorAssignment?.instructor.id ?? null;

  const otherInstructorsRaw = await prisma.user.findMany({
    where: {
      role: "INSTRUKTOR",
      isAccountActive: true,
      canTeachTheory: true,
      lectureSessionsAsInstructor: {
        some: {
          attendances: {
            some: {
              studentId: dbUser.id,
            },
          },
        },
      },
      ...(assignedInstructorId ? { id: { not: assignedInstructorId } } : {}),
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const assignedInstructor = assignedInstructorAssignment
    ? {
        id: assignedInstructorAssignment.instructor.id,
        fullName:
          `${assignedInstructorAssignment.instructor.firstName ?? ""} ${assignedInstructorAssignment.instructor.lastName ?? ""}`.trim() ||
          "Brak danych",
        phoneNumber: assignedInstructorAssignment.instructor.phoneNumber ?? null,
        assignedAt: assignedInstructorAssignment.assignedAt.toISOString(),
      }
    : null;

  const otherInstructors = otherInstructorsRaw.map((instructor) => ({
    id: instructor.id,
    fullName: `${instructor.firstName ?? ""} ${instructor.lastName ?? ""}`.trim() || "Brak danych",
    phoneNumber: instructor.phoneNumber ?? null,
  }));

  return (
    <InstruktorzyPageContent
      assignedInstructor={assignedInstructor}
      otherInstructors={otherInstructors}
    />
  );
}
