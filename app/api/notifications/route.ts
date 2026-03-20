import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type UserRole = "ADMINISTRATOR" | "INSTRUKTOR" | "USER";
type TrainingCategory = "A" | "B";
type AnnouncementAudience =
  | "ALL_KURSANCI"
  | "KURSANCI_KAT_A"
  | "KURSANCI_KAT_B"
  | "KURSANCI_OCZEKUJACY"
  | "INSTRUKTORZY";

type CurrentUser = {
  id: string;
  role: UserRole;
  trainingCategory: TrainingCategory;
  isAccountActive: boolean;
};

function getTargetsForUser(user: CurrentUser): AnnouncementAudience[] {
  if (user.role === "INSTRUKTOR") {
    return ["INSTRUKTORZY"];
  }

  if (user.role === "USER") {
    const targets: AnnouncementAudience[] = ["ALL_KURSANCI"];
    targets.push(user.trainingCategory === "A" ? "KURSANCI_KAT_A" : "KURSANCI_KAT_B");

    if (!user.isAccountActive) {
      targets.push("KURSANCI_OCZEKUJACY");
    }

    return targets;
  }

  return [];
}

async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) {
    return { error: Response.json({ error: "UNAUTHORIZED" }, { status: 401 }) };
  }

  const prismaDelegates = prisma as unknown as {
    user?: {
      findUnique: (args: {
        where: { clerkId: string };
        select: {
          id: true;
          role: true;
          trainingCategory: true;
          isAccountActive: true;
        };
      }) => Promise<CurrentUser | null>;
    };
  };

  const userDelegate = prismaDelegates.user;
  if (!userDelegate) {
    return {
      error: Response.json(
        {
          error: "PRISMA_CLIENT_OUTDATED",
          detail: "Restart dev server and run prisma generate.",
        },
        { status: 500 },
      ),
    };
  }

  const dbUser = await userDelegate.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      role: true,
      trainingCategory: true,
      isAccountActive: true,
    },
  });

  if (!dbUser) {
    return { error: Response.json({ error: "FORBIDDEN" }, { status: 403 }) };
  }

  return { dbUser };
}

export async function GET() {
  const authResult = await getCurrentUser();
  if ("error" in authResult) return authResult.error;

  if (authResult.dbUser.role === "ADMINISTRATOR") {
    return Response.json({ notifications: [], unreadCount: 0 });
  }

  const targets = getTargetsForUser(authResult.dbUser);

  const prismaDelegates = prisma as unknown as {
    announcement?: {
      findMany: (args: unknown) => Promise<
        {
          id: string;
          title: string;
          content: string;
          createdAt: Date;
          target: AnnouncementAudience;
          readStates?: { id: string; readAt: Date }[];
        }[]
      >;
    };
  };

  const announcementDelegate = prismaDelegates.announcement;
  if (!announcementDelegate) {
    return Response.json(
      {
        error: "PRISMA_CLIENT_OUTDATED",
        detail: "Restart dev server and run prisma generate.",
      },
      { status: 500 },
    );
  }

  let notificationsRaw:
    | {
        id: string;
        title: string;
        content: string;
        createdAt: Date;
        target: AnnouncementAudience;
        readStates?: { id: string; readAt: Date }[];
      }[]
    = [];

  try {
    notificationsRaw = await announcementDelegate.findMany({
      where: { target: { in: targets } },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        target: true,
        readStates: {
          where: { userId: authResult.dbUser.id },
          select: { id: true, readAt: true },
          take: 1,
        },
      },
    });
  } catch {
    notificationsRaw = await announcementDelegate.findMany({
      where: { target: { in: targets } },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        target: true,
      },
    });
  }

  const notifications = notificationsRaw.map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
    createdAt: item.createdAt,
    target: item.target,
    isRead: (item.readStates?.length ?? 0) > 0,
  }));

  const unreadCount = notifications.reduce((total, item) => total + (item.isRead ? 0 : 1), 0);

  return Response.json({ notifications, unreadCount });
}
