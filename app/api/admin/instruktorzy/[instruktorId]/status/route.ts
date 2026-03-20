import { requireAdmin } from "@/app/api/admin/_lib/kursanci";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type InstructorRow = {
  id: string;
  role: "ADMINISTRATOR" | "INSTRUKTOR" | "USER";
  isAccountActive: boolean;
  canTeachPractice: boolean;
  canTeachTheory: boolean;
};

type PayloadStatus = "AKTYWNY" | "NIEAKTYWNY";

type PayloadPermissions = {
  canTeachPractice?: unknown;
  canTeachTheory?: unknown;
};

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
  } & PayloadPermissions | null;

  const status = parseStatus(payload?.status);
  const hasStatus = Boolean(status);
  const hasPermissions =
    typeof payload?.canTeachPractice === "boolean" ||
    typeof payload?.canTeachTheory === "boolean";

  if (!hasStatus && !hasPermissions) {
    return Response.json({ error: "INVALID_STATUS" }, { status: 400 });
  }

  const { instruktorId } = await context.params;

  const prismaDelegates = prisma as unknown as {
    user?: {
      findUnique: (args: {
        where: { id: string };
        select: {
          id: true;
          role: true;
          isAccountActive: true;
          canTeachPractice: true;
          canTeachTheory: true;
        };
      }) => Promise<InstructorRow | null>;
      update: (args: {
        where: { id: string };
        data: {
          isAccountActive?: boolean;
          canTeachPractice?: boolean;
          canTeachTheory?: boolean;
        };
        select: {
          id: true;
          isAccountActive: true;
          canTeachPractice: true;
          canTeachTheory: true;
        };
      }) => Promise<{
        id: string;
        isAccountActive: boolean;
        canTeachPractice: boolean;
        canTeachTheory: boolean;
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

  const instructor = await userDelegate.findUnique({
    where: { id: instruktorId },
    select: {
      id: true,
      role: true,
      isAccountActive: true,
      canTeachPractice: true,
      canTeachTheory: true,
    },
  });

  if (!instructor) {
    return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  if (instructor.role !== "INSTRUKTOR") {
    return Response.json({ error: "INVALID_USER" }, { status: 400 });
  }

  try {
    const dataToUpdate: {
      isAccountActive?: boolean;
      canTeachPractice?: boolean;
      canTeachTheory?: boolean;
    } = {};

    if (status) {
      dataToUpdate.isAccountActive = status === "AKTYWNY";
    }

    if (typeof payload?.canTeachPractice === "boolean") {
      dataToUpdate.canTeachPractice = payload.canTeachPractice;
    }

    if (typeof payload?.canTeachTheory === "boolean") {
      dataToUpdate.canTeachTheory = payload.canTeachTheory;
    }

    const updated = await userDelegate.update({
      where: { id: instruktorId },
      data: dataToUpdate,
      select: {
        id: true,
        isAccountActive: true,
        canTeachPractice: true,
        canTeachTheory: true,
      },
    });

    return Response.json({
      ok: true,
      instruktor: {
        id: updated.id,
        status: updated.isAccountActive ? "AKTYWNY" : "NIEAKTYWNY",
        canTeachPractice: updated.canTeachPractice,
        canTeachTheory: updated.canTeachTheory,
      },
    });
  } catch {
    return Response.json({ error: "UPDATE_FAILED" }, { status: 500 });
  }
}
