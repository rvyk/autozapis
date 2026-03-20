import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type AdminUser = {
  id: string;
  role: "ADMINISTRATOR" | "INSTRUKTOR" | "USER";
  firstName: string | null;
  lastName: string | null;
};

type AnnouncementAudience =
  | "ALL_KURSANCI"
  | "KURSANCI_KAT_A"
  | "KURSANCI_KAT_B"
  | "KURSANCI_OCZEKUJACY"
  | "INSTRUKTORZY";

const ANNOUNCEMENT_AUDIENCE_VALUES: AnnouncementAudience[] = [
  "ALL_KURSANCI",
  "KURSANCI_KAT_A",
  "KURSANCI_KAT_B",
  "KURSANCI_OCZEKUJACY",
  "INSTRUKTORZY",
];

type AnnouncementDelegate = {
  create: (args: {
    data: {
      title: string;
      content: string;
      target: AnnouncementAudience;
      authorName: string;
    };
    select: {
      id: true;
      title: true;
      content: true;
      target: true;
      authorName: true;
      createdAt: true;
      updatedAt: true;
    };
  }) => Promise<{
    id: string;
    title: string;
    content: string;
    target: AnnouncementAudience;
    authorName: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
};

function normalizeValue(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function parseAudience(value: unknown): AnnouncementAudience | null {
  if (
    typeof value === "string" &&
    ANNOUNCEMENT_AUDIENCE_VALUES.includes(value as AnnouncementAudience)
  ) {
    return value as AnnouncementAudience;
  }

  return null;
}

function getAuthorName(user: Pick<AdminUser, "firstName" | "lastName">) {
  const fullName = [user.firstName, user.lastName]
    .filter((part) => typeof part === "string" && part.trim().length > 0)
    .join(" ")
    .trim();

  return fullName.length > 0 ? fullName : "Administrator";
}

async function getAdminUser() {
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
          firstName: true;
          lastName: true;
        };
      }) => Promise<AdminUser | null>;
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
    select: { id: true, role: true, firstName: true, lastName: true },
  });

  if (!dbUser || dbUser.role !== "ADMINISTRATOR") {
    return { error: Response.json({ error: "FORBIDDEN" }, { status: 403 }) };
  }

  return { dbUser };
}

export async function POST(request: Request) {
  const authResult = await getAdminUser();
  if ("error" in authResult) {
    return authResult.error;
  }

  const payload = (await request.json().catch(() => null)) as {
    title?: unknown;
    content?: unknown;
    target?: unknown;
  } | null;

  const title = normalizeValue(payload?.title, 120);
  const content = normalizeValue(payload?.content, 5000);
  const target = parseAudience(payload?.target);

  if (!title || !content || !target) {
    return Response.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const prismaDelegates = prisma as unknown as {
    announcement?: AnnouncementDelegate;
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

  const announcement = await announcementDelegate.create({
    data: {
      title,
      content,
      target,
      authorName: getAuthorName(authResult.dbUser),
    },
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

  return Response.json({ announcement }, { status: 201 });
}
