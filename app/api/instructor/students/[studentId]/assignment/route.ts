import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Action = "ASSIGN_TO_ME" | "UNASSIGN_FROM_ME";

function parseAction(value: unknown): Action | null {
  if (value === "ASSIGN_TO_ME" || value === "UNASSIGN_FROM_ME") {
    return value;
  }
  return null;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ studentId: string }> },
) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as {
    action?: unknown;
  } | null;

  const action = parseAction(payload?.action);
  if (!action) {
    return Response.json({ error: "INVALID_ACTION" }, { status: 400 });
  }

  const { studentId } = await context.params;

  const prismaDelegates = prisma as unknown as {
    user?: {
      findUnique: (args: {
        where: { clerkId?: string; id?: string };
        select: { id: true; role: true };
      }) => Promise<{ id: string; role: "ADMINISTRATOR" | "INSTRUKTOR" | "USER" } | null>;
    };
    instructorStudentAssignment?: {
      findMany: (args: {
        where: { studentId: string; isActive: true };
        select: { id: true; instructorId: true };
      }) => Promise<{ id: string; instructorId: string }[]>;
      findFirst: (args: {
        where: { studentId: string; instructorId: string };
        select: { id: true; isActive: true };
      }) => Promise<{ id: string; isActive: boolean } | null>;
      create: (args: {
        data: {
          instructorId: string;
          studentId: string;
          isActive: boolean;
        };
      }) => Promise<{ id: string }>;
      update: (args: {
        where: { id: string };
        data: { isActive: boolean };
      }) => Promise<{ id: string }>;
      updateMany: (args: {
        where: { studentId: string; instructorId?: string; isActive: true };
        data: { isActive: boolean };
      }) => Promise<{ count: number }>;
    };
  };

  const userDelegate = prismaDelegates.user;
  const assignmentDelegate = prismaDelegates.instructorStudentAssignment;

  if (!userDelegate || !assignmentDelegate) {
    return Response.json(
      {
        error: "PRISMA_CLIENT_OUTDATED",
        detail: "Restart dev server and run prisma generate.",
      },
      { status: 500 },
    );
  }

  const instructor = await userDelegate.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true },
  });

  if (!instructor || instructor.role !== "INSTRUKTOR") {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const student = await userDelegate.findUnique({
    where: { id: studentId },
    select: { id: true, role: true },
  });

  if (!student || student.role !== "USER") {
    return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  if (action === "ASSIGN_TO_ME") {
    const activeAssignments = await assignmentDelegate.findMany({
      where: { studentId, isActive: true },
      select: { id: true, instructorId: true },
    });

    const assignedToMe = activeAssignments.some(
      (item) => item.instructorId === instructor.id,
    );

    if (!assignedToMe) {
      await assignmentDelegate.updateMany({
        where: { studentId, isActive: true },
        data: { isActive: false },
      });

      const existingPair = await assignmentDelegate.findFirst({
        where: {
          instructorId: instructor.id,
          studentId,
        },
        select: { id: true, isActive: true },
      });

      if (existingPair) {
        await assignmentDelegate.update({
          where: { id: existingPair.id },
          data: { isActive: true },
        });
      } else {
        await assignmentDelegate.create({
          data: {
            instructorId: instructor.id,
            studentId,
            isActive: true,
          },
        });
      }
    }

    return Response.json({ ok: true, assignedToMe: true });
  }

  await assignmentDelegate.updateMany({
    where: {
      studentId,
      instructorId: instructor.id,
      isActive: true,
    },
    data: { isActive: false },
  });

  return Response.json({ ok: true, assignedToMe: false });
}
