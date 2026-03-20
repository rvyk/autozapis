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

  if (!dbUser || dbUser.role === "ADMINISTRATOR") {
    return { error: Response.json({ error: "FORBIDDEN" }, { status: 403 }) };
  }

  return { dbUser };
}

export async function PATCH() {
  const authResult = await getCurrentUser();
  if ("error" in authResult) return authResult.error;

  const targets = getTargetsForUser(authResult.dbUser);

  const prismaDelegates = prisma as unknown as {
    announcement?: {
      findMany: (args: {
        where: { target: { in: AnnouncementAudience[] } };
        select: { id: true };
      }) => Promise<{ id: string }[]>;
    };
    announcementReadState?: {
      createMany: (args: {
        data: { userId: string; announcementId: string; readAt: Date }[];
        skipDuplicates: true;
      }) => Promise<{ count: number }>;
    };
  };

  const announcementDelegate = prismaDelegates.announcement;
  const readStateDelegate = prismaDelegates.announcementReadState;

  if (!announcementDelegate || !readStateDelegate) {
    return Response.json(
      {
        error: "PRISMA_CLIENT_OUTDATED",
        detail: "Restart dev server and run prisma generate.",
      },
      { status: 500 },
    );
  }

  const announcements = await announcementDelegate.findMany({
    where: { target: { in: targets } },
    select: { id: true },
  });

  if (announcements.length === 0) {
    return Response.json({ ok: true, count: 0 });
  }

  const now = new Date();
  const result = await readStateDelegate.createMany({
    data: announcements.map((item) => ({
      userId: authResult.dbUser.id,
      announcementId: item.id,
      readAt: now,
    })),
    skipDuplicates: true,
  });

  return Response.json({ ok: true, count: result.count });
}
