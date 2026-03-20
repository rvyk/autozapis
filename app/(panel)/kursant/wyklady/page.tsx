import { getPanelUser } from "@/app/_lib/get-panel-user";
import { prisma } from "@/lib/prisma";
import { WykladyPageContent } from "./_components/wyklady-page-content";
import type { LectureItem } from "./_components/wyklady-types";

export default async function WykladyPage() {
  const dbUser = await getPanelUser({ accessTarget: "kursant" });

  const attendances = await prisma.lectureAttendance.findMany({
    where: { studentId: dbUser.id },
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

  const lectures: LectureItem[] = attendances.map((item) => ({
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

  return (
    <WykladyPageContent
      lectures={lectures}
      theoryHoursDone={Math.floor(theoryMinutesDone / 60)}
      theoryHoursRequired={dbUser.theoryHoursRequired ?? 30}
    />
  );
}
