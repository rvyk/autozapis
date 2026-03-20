import { requireAdmin, resolveKursantStatus } from "@/app/api/admin/_lib/kursanci";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type PayloadStatus = "AKTYWNY" | "OCZEKUJACY";

type UserRow = {
  id: string;
  role: "ADMINISTRATOR" | "INSTRUKTOR" | "USER";
  isRegistrationComplete: boolean;
  isAccountActive: boolean;
  pkkFile: { id: string } | null;
};

function parseNextStatus(value: unknown): PayloadStatus | null {
  if (value === "AKTYWNY" || value === "OCZEKUJACY") {
    return value;
  }

  return null;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ kursantId: string }> },
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const payload = (await request.json().catch(() => null)) as {
    status?: unknown;
  } | null;

  const nextStatus = parseNextStatus(payload?.status);

  if (!nextStatus) {
    return Response.json({ error: "INVALID_STATUS" }, { status: 400 });
  }

  const { kursantId } = await context.params;

  const prismaDelegates = prisma as unknown as {
    user?: {
      findUnique: (args: {
        where: { id: string };
        select: {
          id: true;
          role: true;
          isRegistrationComplete: true;
          isAccountActive: true;
          pkkFile: { select: { id: true } };
        };
      }) => Promise<UserRow | null>;
      update: (args: {
        where: { id: string };
        data: { isAccountActive: boolean };
        select: {
          isRegistrationComplete: true;
          isAccountActive: true;
          pkkFile: { select: { id: true } };
        };
      }) => Promise<{
        isRegistrationComplete: boolean;
        isAccountActive: boolean;
        pkkFile: { id: string } | null;
      }>;
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

  const kursant = await userDelegate.findUnique({
    where: { id: kursantId },
    select: {
      id: true,
      role: true,
      isRegistrationComplete: true,
      isAccountActive: true,
      pkkFile: { select: { id: true } },
    },
  });

  if (!kursant) {
    return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  if (kursant.role !== "USER") {
    return Response.json({ error: "INVALID_USER" }, { status: 400 });
  }

  if (nextStatus === "AKTYWNY" && (!kursant.pkkFile || !kursant.isRegistrationComplete)) {
    return Response.json({ error: "INVALID_STATUS" }, { status: 400 });
  }

  try {
    const updated = await userDelegate.update({
      where: { id: kursantId },
      data: {
        isAccountActive: nextStatus === "AKTYWNY",
      },
      select: {
        isRegistrationComplete: true,
        isAccountActive: true,
        pkkFile: { select: { id: true } },
      },
    });

    return Response.json({
      ok: true,
      kursant: {
        id: kursantId,
        status: resolveKursantStatus({
          hasPkkFile: Boolean(updated.pkkFile),
          isRegistrationComplete: updated.isRegistrationComplete,
          isAccountActive: updated.isAccountActive,
        }),
      },
    });
  } catch {
    return Response.json({ error: "UPDATE_FAILED" }, { status: 500 });
  }
}
