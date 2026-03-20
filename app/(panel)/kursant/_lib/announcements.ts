import { prisma } from "@/lib/prisma";

type KursantAnnouncementTarget =
  | "ALL_KURSANCI"
  | "KURSANCI_KAT_A"
  | "KURSANCI_KAT_B"
  | "KURSANCI_OCZEKUJACY";

type AnnouncementRecord = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
};

type TrainingCategory = "A" | "B" | null | undefined;

const prismaDelegates = prisma as unknown as {
  announcement?: {
    findMany: (args: {
      where: {
        target: {
          in: KursantAnnouncementTarget[];
        };
      };
      orderBy: { createdAt: "desc" };
      take: number;
      select: {
        id: true;
        title: true;
        content: true;
        createdAt: true;
      };
    }) => Promise<AnnouncementRecord[]>;
  };
};

export function getAnnouncementTargetsForKursant(
  trainingCategory: TrainingCategory,
  includeWaiting = false,
): KursantAnnouncementTarget[] {
  const targets: KursantAnnouncementTarget[] = ["ALL_KURSANCI"];

  if (includeWaiting) {
    targets.push("KURSANCI_OCZEKUJACY");
  }

  if (trainingCategory === "A") {
    targets.push("KURSANCI_KAT_A");
  } else {
    targets.push("KURSANCI_KAT_B");
  }

  return targets;
}

export async function getLatestKursantAnnouncements(
  targets: KursantAnnouncementTarget[],
  take: number,
) {
  const announcementDelegate = prismaDelegates.announcement;

  if (!announcementDelegate) {
    return [];
  }

  return announcementDelegate.findMany({
    where: { target: { in: targets } },
    orderBy: { createdAt: "desc" },
    take,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });
}
