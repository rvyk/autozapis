import { redirect } from "next/navigation";
import { getPanelUser } from "@/app/_lib/get-panel-user";
import { prisma } from "@/lib/prisma";
import {
  getAnnouncementTargetsForKursant,
  getLatestKursantAnnouncements,
} from "./_lib/announcements";
import { PanelPageContent } from "./_components/panel-page-content";

export default async function PanelPage() {
  const dbUser = await getPanelUser({ accessTarget: "kursant" });

  if (!dbUser?.isAccountActive) {
    redirect("/kursant/oczekiwanie");
  }

  const allowedTargets = getAnnouncementTargetsForKursant(
    dbUser.trainingCategory,
  );

  const [
    latestAnnouncements,
    theoryAttendances,
    upcomingLesson,
  ] = await Promise.all([
    getLatestKursantAnnouncements(allowedTargets, 4),
    prisma.lectureAttendance.findMany({
      where: {
        studentId: dbUser.id,
        status: "PRESENT",
      },
      select: {
        creditedMinutes: true,
      },
    }),
    prisma.drivingLesson.findFirst({
      where: {
        studentId: dbUser.id,
        status: "PLANOWANA",
        startsAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        startsAt: "asc",
      },
      select: {
        id: true,
        startsAt: true,
        topic: true,
      },
    }),
  ]);

  const theoryMinutesCompleted = theoryAttendances.reduce((acc, curr) => acc + curr.creditedMinutes, 0);
  const theoryHoursCompleted = Math.floor(theoryMinutesCompleted / 60);

  const stats = {
    theoryCompleted: theoryHoursCompleted,
    theoryRequired: dbUser.theoryHoursRequired || 30,
    practiceCompleted: dbUser.trainingHoursCompleted || 0,
    practiceRequired: dbUser.trainingHoursRequired || 30,
  };

  const nextLesson = upcomingLesson?.startsAt ? {
    id: upcomingLesson.id,
    date: upcomingLesson.startsAt,
    topic: upcomingLesson.topic,
  } : null;

  const coursePrice = dbUser.coursePrice ?? 3000;
  const amountPaid = dbUser.amountPaid ?? 0;
  const amountDue = Math.max(0, coursePrice - amountPaid);

  return (
    <PanelPageContent
      firstName={dbUser?.firstName}
      latestAnnouncements={latestAnnouncements}
      stats={stats}
      nextLesson={nextLesson}
      amountDue={amountDue}
    />
  );
}
