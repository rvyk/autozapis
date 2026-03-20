import { requireAdmin, resolveKursantStatus } from "@/app/api/admin/_lib/kursanci";
import { deletePrivateObject } from "@/lib/r2";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type UserWithPkk = {
  id: string;
  role: "ADMINISTRATOR" | "INSTRUKTOR" | "USER";
  isRegistrationComplete: boolean;
  isAccountActive: boolean;
  pkkFile: { id: string; objectKey: string } | null;
};

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ kursantId: string }> },
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) {
    return authResult.error;
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
          pkkFile: {
            select: {
              id: true;
              objectKey: true;
            };
          };
        };
      }) => Promise<UserWithPkk | null>;
      update: (args: {
        where: { id: string };
        data: {
          isRegistrationComplete: boolean;
          isAccountActive: boolean;
        };
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
    pkkFile?: {
      delete: (args: { where: { userId: string } }) => Promise<{ id: string }>;
    };
  };

  const userDelegate = prismaDelegates.user;
  const pkkFileDelegate = prismaDelegates.pkkFile;

  if (!userDelegate || !pkkFileDelegate) {
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
      pkkFile: {
        select: {
          id: true,
          objectKey: true,
        },
      },
    },
  });

  if (!kursant) {
    return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  if (kursant.role !== "USER") {
    return Response.json({ error: "INVALID_USER" }, { status: 400 });
  }

  if (!kursant.pkkFile) {
    return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  try {
    await pkkFileDelegate.delete({ where: { userId: kursantId } });

    const updated = await userDelegate.update({
      where: { id: kursantId },
      data: {
        isRegistrationComplete: false,
        isAccountActive: false,
      },
      select: {
        isRegistrationComplete: true,
        isAccountActive: true,
        pkkFile: { select: { id: true } },
      },
    });

    await deletePrivateObject(kursant.pkkFile.objectKey).catch(() => null);

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
    return Response.json({ error: "DELETE_FAILED" }, { status: 500 });
  }
}
