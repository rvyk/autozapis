import { getPanelUser } from "@/app/_lib/get-panel-user";
import { prisma } from "@/lib/prisma";
import { InstruktorWykladyPageContent } from "./_components/instruktor-wyklady-page-content";

export default async function InstruktorWykladyPage() {
  const dbUser = await getPanelUser({ accessTarget: "instruktor" });

  const assignedStudents = await prisma.instructorStudentAssignment.findMany({
    where: {
      instructorId: dbUser.id,
      isActive: true,
    },
    select: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          theoryHoursRequired: true,
          lectureAttendances: {
            where: {
              status: "PRESENT",
            },
            select: {
              creditedMinutes: true,
            },
          },
        },
      },
    },
    orderBy: {
      assignedAt: "desc",
    },
  });

  const students = assignedStudents.map((row) => ({
    theoryHoursDone: Math.floor(
      row.student.lectureAttendances.reduce(
        (total, attendance) => total + attendance.creditedMinutes,
        0,
      ) / 60,
    ),
    theoryHoursRequired: row.student.theoryHoursRequired,
    id: row.student.id,
    fullName: `${row.student.firstName ?? ""} ${row.student.lastName ?? ""}`.trim() || "Brak danych",
    phone: row.student.phoneNumber || "Brak numeru",
    completedTheory:
      Math.floor(
        row.student.lectureAttendances.reduce(
          (total, attendance) => total + attendance.creditedMinutes,
          0,
        ) / 60,
      ) >= row.student.theoryHoursRequired,
  }));

  return <InstruktorWykladyPageContent students={students} />;
}
