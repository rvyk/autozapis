import { prisma } from "@/lib/prisma";
import type { StudentOption } from "../_components/instruktor-wyklady-types";

export async function getInstructorWykladyStudents(instructorId: string): Promise<StudentOption[]> {
  const students = await prisma.user.findMany({
    where: {
      role: "USER",
      isRegistrationComplete: true,
      isAccountActive: true,
    },
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return students.map((student) => {
    const theoryHoursDone = Math.floor(
      student.lectureAttendances.reduce(
        (total, attendance) => total + attendance.creditedMinutes,
        0,
      ) / 60,
    );

    return {
      theoryHoursDone,
      theoryHoursRequired: student.theoryHoursRequired,
      id: student.id,
      fullName: `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() || "Brak danych",
      phone: student.phoneNumber || "Brak numeru",
      completedTheory: theoryHoursDone >= student.theoryHoursRequired,
    };
  });
}
