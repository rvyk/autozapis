import { requireAdmin } from "@/app/api/admin/_lib/kursanci";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type UserRow = {
  id: string;
  role: "ADMINISTRATOR" | "INSTRUKTOR" | "USER";
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  isAccountActive: boolean;
  createdAt: Date;
};

function normalizeEmail(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

export async function POST(request: Request) {
  const authResult = await requireAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const payload = (await request.json().catch(() => null)) as {
    email?: unknown;
  } | null;

  const email = normalizeEmail(payload?.email);
  if (!email || !email.includes("@") || email.length > 320) {
    return Response.json({ error: "INVALID_EMAIL" }, { status: 400 });
  }

  const prismaDelegates = prisma as unknown as {
    user?: {
      findUnique: (args: {
        where: { email: string };
        select: {
          id: true;
          role: true;
          firstName: true;
          lastName: true;
          email: true;
          isAccountActive: true;
          createdAt: true;
        };
      }) => Promise<UserRow | null>;
      update: (args: {
        where: { id: string };
        data: {
          role: "INSTRUKTOR";
          isRegistrationComplete: boolean;
          isAccountActive: boolean;
        };
        select: {
          id: true;
          role: true;
          firstName: true;
          lastName: true;
          email: true;
          isAccountActive: true;
          createdAt: true;
        };
      }) => Promise<UserRow>;
    };
  };

  const userDelegate = prismaDelegates.user;
  if (!userDelegate) {
    return Response.json(
      {
        error: "PRISMA_CLIENT_OUTDATED",
        detail: "Restart dev server and run prisma generate.",
      },
      { status: 500 },
    );
  }

  const dbUser = await userDelegate.findUnique({
    where: { email },
    select: {
      id: true,
      role: true,
      firstName: true,
      lastName: true,
      email: true,
      isAccountActive: true,
      createdAt: true,
    },
  });

  if (!dbUser) {
    return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  if (dbUser.role === "ADMINISTRATOR") {
    return Response.json({ error: "INVALID_USER" }, { status: 400 });
  }

  if (dbUser.role === "INSTRUKTOR") {
    return Response.json({ error: "ALREADY_INSTRUCTOR" }, { status: 409 });
  }

  const updated = await userDelegate.update({
    where: { id: dbUser.id },
    data: {
      role: "INSTRUKTOR",
      isRegistrationComplete: true,
      isAccountActive: true,
    },
    select: {
      id: true,
      role: true,
      firstName: true,
      lastName: true,
      email: true,
      isAccountActive: true,
      createdAt: true,
    },
  });

  const fullName = [updated.firstName, updated.lastName]
    .filter((part) => typeof part === "string" && part.trim().length > 0)
    .join(" ")
    .trim();

  return Response.json(
    {
      instructor: {
        id: updated.id,
        fullName: fullName || "Brak danych",
        email: updated.email ?? email,
        status: updated.isAccountActive ? "AKTYWNY" : "NIEAKTYWNY",
        joinedAt: updated.createdAt.toISOString(),
      },
    },
    { status: 201 },
  );
}
