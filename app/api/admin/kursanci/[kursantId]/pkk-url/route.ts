import { requireAdmin } from "@/app/api/admin/_lib/kursanci";
import { prisma } from "@/lib/prisma";
import { getPrivateObjectSignedUrl } from "@/lib/r2";

export const runtime = "nodejs";

type KursantWithPkk = {
  id: string;
  role: "ADMINISTRATOR" | "INSTRUKTOR" | "USER";
  pkkFile: {
    id: string;
    objectKey: string;
  } | null;
};

export async function GET(
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
          pkkFile: {
            select: {
              id: true;
              objectKey: true;
            };
          };
        };
      }) => Promise<KursantWithPkk | null>;
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
    const signedUrl = await getPrivateObjectSignedUrl(kursant.pkkFile.objectKey);
    return Response.json({ url: signedUrl });
  } catch {
    return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  }
}
