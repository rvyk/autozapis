import { requireAdmin } from "@/app/api/admin/_lib/kursanci";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type InstructorRow = {
  id: string;
  role: "ADMINISTRATOR" | "INSTRUKTOR" | "USER";
  isAccountActive: boolean;
};

type PayloadStatus = "AKTYWNY" | "NIEAKTYWNY";

function parseStatus(value: unknown): PayloadStatus | null {
  if (value === "AKTYWNY" || value === "NIEAKTYWNY") {
    return value;
  }

  return null;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ instruktorId: string }> },
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const payload = (await request.json().catch(() => null)) as {
    status?: unknown;
  } | null;

  const status = parseStatus(payload?.status);
  if (!status) {
    return Response.json({ error: "INVALID_STATUS" }, { status: 400 });
  }

  const { instruktorId } = await context.params;

  const prismaDelegates = prisma as unknown as {
    user?: {
      findUnique: (args: {
        where: { id: string };
        select: { id: true; role: true; isAccountActive: true };
      }) => Promise<InstructorRow | null>;
      update: (args: {
        where: { id: string };
        data: { isAccountActive: boolean };
        select: { id: true; isAccountActive: true };
      }) => Promise<{ id: string; isAccountActive: boolean }>;
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

  const instructor = await userDelegate.findUnique({
    where: { id: instruktorId },
    select: { id: true, role: true, isAccountActive: true },
  });

  if (!instructor) {
    return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  if (instructor.role !== "INSTRUKTOR") {
    return Response.json({ error: "INVALID_USER" }, { status: 400 });
  }

  try {
    const updated = await userDelegate.update({
      where: { id: instruktorId },
      data: { isAccountActive: status === "AKTYWNY" },
      select: { id: true, isAccountActive: true },
    });

    return Response.json({
      ok: true,
      instruktor: {
        id: updated.id,
        status: updated.isAccountActive ? "AKTYWNY" : "NIEAKTYWNY",
      },
    });
  } catch {
    return Response.json({ error: "UPDATE_FAILED" }, { status: 500 });
  }
}
