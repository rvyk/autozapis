import { prisma } from "@/lib/prisma";
import { OgloszeniaPageContent } from "./_components/ogloszenia-page-content";
import type { AnnouncementTarget } from "./_components/ogloszenia-types";

type AnnouncementRecord = {
  id: string;
  title: string;
  content: string;
  target: AnnouncementTarget;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
};

export default async function OgloszeniaPage() {
  const prismaDelegates = prisma as unknown as {
    announcement?: {
      findMany: (args: {
        orderBy: { createdAt: "desc" };
        select: {
          id: true;
          title: true;
          content: true;
          target: true;
          authorName: true;
          createdAt: true;
          updatedAt: true;
        };
      }) => Promise<AnnouncementRecord[]>;
    };
  };

  const announcementDelegate = prismaDelegates.announcement;

  if (!announcementDelegate) {
    return <OgloszeniaPageContent initialAnnouncements={[]} />;
  }

  const announcements = await announcementDelegate.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      target: true,
      authorName: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <OgloszeniaPageContent
      initialAnnouncements={announcements.map((announcement) => ({
        ...announcement,
        createdAt: announcement.createdAt.toISOString(),
        updatedAt: announcement.updatedAt.toISOString(),
      }))}
    />
  );
}
