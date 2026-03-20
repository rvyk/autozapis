import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type AdminUser = {
  id: string;
  role: "ADMINISTRATOR" | "INSTRUKTOR" | "USER";
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
  update: (args: {
    where: { id: string };
    data: {
      title?: string;
      content?: string;
      target?: AnnouncementAudience;
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
  delete: (args: { where: { id: string } }) => Promise<{ id: string }>;
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

async function requireAdmin() {
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
    select: { id: true, role: true },
  });

  if (!dbUser || dbUser.role !== "ADMINISTRATOR") {
    return { error: Response.json({ error: "FORBIDDEN" }, { status: 403 }) };
  }

  return { dbUser };
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ announcementId: string }> },
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { announcementId } = await context.params;

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

  try {
    const announcement = await announcementDelegate.update({
      where: { id: announcementId },
      data: { title, content, target },
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

    return Response.json({ announcement });
  } catch {
    return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ announcementId: string }> },
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { announcementId } = await context.params;

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

  try {
    await announcementDelegate.delete({ where: { id: announcementId } });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  }
}
