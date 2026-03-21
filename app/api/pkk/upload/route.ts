import crypto from "node:crypto";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import {
  ALLOWED_PKK_CONTENT_TYPES,
  MAX_PKK_FILE_SIZE_BYTES,
  deletePrivateObject,
  uploadPrivateObject,
} from "@/lib/r2";

export const runtime = "nodejs";

function getFileExtension(fileName: string, contentType: string) {
  const fromName = fileName.split(".").pop()?.toLowerCase();
  if (fromName && fromName.length <= 8) {
    return fromName;
  }

  if (contentType === "application/pdf") return "pdf";
  if (contentType === "image/jpeg") return "jpg";
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";

  return "bin";
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const formData = await request.formData();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "INVALID_FILE" }, { status: 400 });
  }

  if (!ALLOWED_PKK_CONTENT_TYPES.has(file.type)) {
    return Response.json({ error: "UNSUPPORTED_FILE_TYPE" }, { status: 400 });
  }

  if (file.size <= 0 || file.size > MAX_PKK_FILE_SIZE_BYTES) {
    return Response.json({ error: "INVALID_FILE_SIZE" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");

  const prismaDelegates = prisma as unknown as {
    user?: {
      findUnique: (args: {
        where: { clerkId: string };
        select: { id: true; isRegistrationComplete: true };
      }) => Promise<{ id: string; isRegistrationComplete: boolean } | null>;
      update: (args: {
        where: { id: string };
        data: { isRegistrationComplete: boolean };
      }) => Promise<unknown>;
    };
    pkkFile?: {
      findUnique: (args: {
        where: { userId: string };
        select: { objectKey: true };
      }) => Promise<{ objectKey: string } | null>;
      upsert: (args: {
        where: { userId: string };
        create: {
          userId: string;
          objectKey: string;
          originalFileName: string;
          contentType: string;
          sizeBytes: number;
          sha256: string;
        };
        update: {
          objectKey: string;
          originalFileName: string;
          contentType: string;
          sizeBytes: number;
          sha256: string;
        };
      }) => Promise<unknown>;
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
    where: { clerkId: userId },
    select: { id: true, isRegistrationComplete: true },
  });

  if (!dbUser) {
    return Response.json(
      { error: "USER_NOT_SYNCED", detail: "Run Clerk webhook sync first." },
      { status: 409 },
    );
  }

  if (dbUser.isRegistrationComplete) {
    return Response.json({ error: "REGISTRATION_ALREADY_COMPLETED" }, { status: 409 });
  }

  const extension = getFileExtension(file.name, file.type);
  const objectKey = `private/pkk/${dbUser.id}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const pkkFileDelegate = prismaDelegates.pkkFile;

  if (!pkkFileDelegate) {
    return Response.json(
      {
        error: "PRISMA_CLIENT_OUTDATED",
        detail: "Restart dev server and run prisma generate.",
      },
      { status: 500 },
    );
  }

  const currentPkk = await pkkFileDelegate.findUnique({
    where: { userId: dbUser.id },
    select: { objectKey: true },
  });

  await uploadPrivateObject({
    key: objectKey,
    contentType: file.type,
    body: buffer,
  });

  await pkkFileDelegate.upsert({
    where: { userId: dbUser.id },
    create: {
      userId: dbUser.id,
      objectKey,
      originalFileName: file.name,
      contentType: file.type,
      sizeBytes: file.size,
      sha256,
    },
    update: {
      objectKey,
      originalFileName: file.name,
      contentType: file.type,
      sizeBytes: file.size,
      sha256,
    },
  });

  await userDelegate.update({
    where: { id: dbUser.id },
    data: { isRegistrationComplete: true },
  });

  if (currentPkk?.objectKey && currentPkk.objectKey !== objectKey) {
    await deletePrivateObject(currentPkk.objectKey).catch(() => null);
  }

  return Response.json({ ok: true });
}
