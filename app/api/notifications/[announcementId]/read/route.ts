import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type UserRole = "ADMINISTRATOR" | "INSTRUKTOR" | "USER";
type AnnouncementAudience =
  | "ALL_KURSANCI"
  | "KURSANCI_KAT_A"
  | "KURSANCI_KAT_B"
  | "KURSANCI_OCZEKUJACY"
  | "INSTRUKTORZY";

type CurrentUser = {
  id: string;
  role: UserRole;
  trainingCategory: "A" | "B";
  isAccountActive: boolean;
};

function canAccessAnnouncement(user: CurrentUser, target: AnnouncementAudience) {
  if (user.role === "INSTRUKTOR") {
    return target === "INSTRUKTORZY";
  }

  if (user.role === "USER") {
    if (target === "ALL_KURSANCI") return true;
    if (target === "KURSANCI_KAT_A") return user.trainingCategory === "A";
    if (target === "KURSANCI_KAT_B") return user.trainingCategory === "B";
    if (target === "KURSANCI_OCZEKUJACY") return !user.isAccountActive;
    return false;
  }

  return false;
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

export async function PATCH(
  _request: Request,
  context: { params: Promise<{ announcementId: string }> },
) {
  const authResult = await getCurrentUser();
  if ("error" in authResult) return authResult.error;

  const { announcementId } = await context.params;

  const prismaDelegates = prisma as unknown as {
    announcement?: {
      findUnique: (args: {
        where: { id: string };
        select: { id: true; target: true };
      }) => Promise<{ id: string; target: AnnouncementAudience } | null>;
    };
    announcementReadState?: {
      upsert: (args: {
        where: { userId_announcementId: { userId: string; announcementId: string } };
        create: { userId: string; announcementId: string; readAt: Date };
        update: { readAt: Date };
      }) => Promise<{ id: string }>;
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

  const announcement = await announcementDelegate.findUnique({
    where: { id: announcementId },
    select: { id: true, target: true },
  });

  if (!announcement) {
    return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  if (!canAccessAnnouncement(authResult.dbUser, announcement.target)) {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  await readStateDelegate.upsert({
    where: {
      userId_announcementId: {
        userId: authResult.dbUser.id,
        announcementId,
      },
    },
    create: {
      userId: authResult.dbUser.id,
      announcementId,
      readAt: new Date(),
    },
    update: {
      readAt: new Date(),
    },
  });

  return Response.json({ ok: true });
}
