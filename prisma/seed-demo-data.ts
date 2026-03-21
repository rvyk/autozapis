import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = process.env["DATABASE_URL"];

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DEMO = {
  adminEmail: "demo.admin@autozapis-demo.pl",
  instructorEmail: "demo.instruktor@autozapis-demo.pl",
  studentEmail: "demo.kursant@autozapis-demo.pl",
  marker: "[DEMO]",
};

function at(daysFromNow: number, hour = 10, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, minute, 0, 0);
  return date;
}

async function main() {
  const users = await prisma.user.findMany({
    where: {
      email: {
        in: [DEMO.adminEmail, DEMO.instructorEmail, DEMO.studentEmail],
      },
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  const admin = users.find((user) => user.email === DEMO.adminEmail);
  const instructor = users.find((user) => user.email === DEMO.instructorEmail);
  const student = users.find((user) => user.email === DEMO.studentEmail);

  if (!admin || !instructor || !student) {
    throw new Error(
      "Brak kont demo. Najpierw uruchom: npm run seed:example-accounts",
    );
  }

  if (admin.role !== "ADMINISTRATOR") {
    throw new Error("Demo admin ma nieprawidlową role.");
  }

  if (instructor.role !== "INSTRUKTOR") {
    throw new Error("Demo instruktor ma nieprawidlową role.");
  }

  if (student.role !== "USER") {
    throw new Error("Demo kursant ma nieprawidlowa role.");
  }

  await prisma.announcementReadState.deleteMany({
    where: {
      announcement: {
        title: {
          startsWith: DEMO.marker,
        },
      },
    },
  });

  await prisma.announcement.deleteMany({
    where: {
      title: {
        startsWith: DEMO.marker,
      },
    },
  });

  await prisma.course.deleteMany({
    where: {
      title: {
        startsWith: DEMO.marker,
      },
    },
  });

  const demoLectureSessions = await prisma.lectureSession.findMany({
    where: {
      instructorId: instructor.id,
      title: {
        startsWith: DEMO.marker,
      },
    },
    select: { id: true },
  });

  const demoLectureSessionIds = demoLectureSessions.map(
    (session) => session.id,
  );

  if (demoLectureSessionIds.length > 0) {
    await prisma.lectureAttendance.deleteMany({
      where: {
        lectureSessionId: {
          in: demoLectureSessionIds,
        },
      },
    });

    await prisma.lectureSession.deleteMany({
      where: {
        id: {
          in: demoLectureSessionIds,
        },
      },
    });
  }

  await prisma.drivingLesson.deleteMany({
    where: {
      studentId: student.id,
      instructorId: instructor.id,
      topic: {
        startsWith: DEMO.marker,
      },
    },
  });

  await prisma.instructorStudentAssignment.deleteMany({
    where: {
      instructorId: instructor.id,
      studentId: student.id,
      note: {
        startsWith: DEMO.marker,
      },
    },
  });

  const announcements = await Promise.all([
    prisma.announcement.create({
      data: {
        title: `${DEMO.marker} Start nowej grupy B`,
        content:
          "Rusza nowa grupa kursu kat. B od poniedzialku. Zapisy trwaja do piatku.",
        target: "ALL_KURSANCI",
        authorName: "Demo Administrator",
      },
    }),
    prisma.announcement.create({
      data: {
        title: `${DEMO.marker} Komplet dokumentow PKK`,
        content:
          "Przypominamy o dostarczeniu numeru PKK i badan lekarskich przed pierwsza jazda.",
        target: "KURSANCI_OCZEKUJACY",
        authorName: "Demo Administrator",
      },
    }),
    prisma.announcement.create({
      data: {
        title: `${DEMO.marker} Materialy dla instruktorow`,
        content:
          "W panelu dodano nowe materialy do zajec teoretycznych i checklisty postepow.",
        target: "INSTRUKTORZY",
        authorName: "Demo Administrator",
      },
    }),
    prisma.announcement.create({
      data: {
        title: `${DEMO.marker} Kat. B - harmonogram jazd`,
        content:
          "Udostepnilismy dodatkowe terminy jazd weekendowych dla kursantow kat. B.",
        target: "KURSANCI_KAT_B",
        authorName: "Demo Administrator",
      },
    }),
  ]);

  await prisma.announcementReadState.createMany({
    data: [
      {
        userId: student.id,
        announcementId: announcements[0].id,
      },
      {
        userId: student.id,
        announcementId: announcements[3].id,
      },
    ],
  });

  await prisma.course.createMany({
    data: [
      {
        title: `${DEMO.marker} Kurs kat. B - poranny`,
        category: "B",
        startDate: at(10, 9, 0),
        duration: "4 tygodnie",
        pricePln: 3200,
        enrolledCount: 12,
        capacity: 20,
        status: "NABOR",
      },
      {
        title: `${DEMO.marker} Kurs kat. A - weekend`,
        category: "A",
        startDate: at(21, 8, 30),
        duration: "5 tygodni",
        pricePln: 3100,
        enrolledCount: 8,
        capacity: 12,
        status: "PLANOWANY",
      },
      {
        title: `${DEMO.marker} Jazdy doszkalajace`,
        category: "DOSZKALANIE",
        startDate: null,
        duration: "Pakiet 10h",
        pricePln: 1400,
        enrolledCount: 6,
        capacity: null,
        status: "STALA_OFERTA",
      },
    ],
  });

  await prisma.instructorStudentAssignment.create({
    data: {
      instructorId: instructor.id,
      studentId: student.id,
      isActive: true,
      note: `${DEMO.marker} Glowny kursant demo do testow panelu instruktora`,
      assignedAt: at(-30, 12, 0),
    },
  });

  await prisma.drivingLesson.createMany({
    data: [
      {
        studentId: student.id,
        instructorId: instructor.id,
        startsAt: at(-14, 9, 0),
        durationMinutes: 120,
        topic: `${DEMO.marker} Ruszanie i zmiana biegow`,
        routeSummary: "Plac manewrowy + lokalne drogi osiedlowe",
        instructorFeedback: "Dobra kontrola sprzegla i plynne ruszanie.",
        routeScore: 4,
        status: "ZREALIZOWANA",
      },
      {
        studentId: student.id,
        instructorId: instructor.id,
        startsAt: at(-9, 16, 30),
        durationMinutes: 90,
        topic: `${DEMO.marker} Skrzyzowania rownorzedne`,
        routeSummary: "Centrum + osiedla z gestym ruchem",
        instructorFeedback: "Do poprawy ocena pierwszenstwa na skrzyzowaniach.",
        routeScore: 3,
        status: "ZREALIZOWANA",
      },
      {
        studentId: student.id,
        instructorId: instructor.id,
        startsAt: at(-4, 11, 0),
        durationMinutes: 120,
        topic: `${DEMO.marker} Parkowanie i zawracanie`,
        routeSummary: "Strefa centrum handlowego i drogi jednokierunkowe",
        instructorFeedback:
          "Postep widoczny, dalej cwiczyc parkowanie rownolegle.",
        routeScore: 4,
        status: "ZREALIZOWANA",
      },
      {
        studentId: student.id,
        instructorId: instructor.id,
        startsAt: at(2, 14, 0),
        durationMinutes: 120,
        topic: `${DEMO.marker} Jazda po miescie - przygotowanie do egzaminu`,
        routeSummary: null,
        instructorFeedback: null,
        routeScore: null,
        status: "PLANOWANA",
      },
      {
        studentId: student.id,
        instructorId: instructor.id,
        startsAt: at(-1, 18, 0),
        durationMinutes: 60,
        topic: `${DEMO.marker} Jazda nocna`,
        routeSummary: "Trasa przerwana z powodow technicznych",
        instructorFeedback: "Lekcja odwolana, auto zgloszone do serwisu.",
        routeScore: null,
        status: "ODWOLANA",
      },
    ],
  });

  const lecture1 = await prisma.lectureSession.create({
    data: {
      instructorId: instructor.id,
      title: `${DEMO.marker} Znaki pionowe i poziome`,
      topicType: "Teoria podstawowa",
      startsAt: at(-12, 17, 0),
      durationMinutes: 120,
      notes: "Omowienie najczestszych bledow na testach wewnetrznych.",
    },
  });

  const lecture2 = await prisma.lectureSession.create({
    data: {
      instructorId: instructor.id,
      title: `${DEMO.marker} Pierwsza pomoc i bezpieczenstwo`,
      topicType: "Bezpieczenstwo ruchu",
      startsAt: at(-6, 17, 0),
      durationMinutes: 90,
      notes: "Scenariusze z realnych sytuacji drogowych.",
    },
  });

  await prisma.lectureAttendance.createMany({
    data: [
      {
        lectureSessionId: lecture1.id,
        studentId: student.id,
        status: "PRESENT",
        creditedMinutes: 120,
      },
      {
        lectureSessionId: lecture2.id,
        studentId: student.id,
        status: "ABSENT",
        creditedMinutes: 0,
      },
    ],
  });

  console.log("Demo data seeded successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
