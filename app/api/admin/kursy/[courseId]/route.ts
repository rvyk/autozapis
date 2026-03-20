import { requireAdmin } from "@/app/api/admin/_lib/kursanci";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type CourseStatus = "NABOR" | "PLANOWANY" | "STALA_OFERTA";

type CourseRow = {
  id: string;
  title: string;
  category: "A" | "B" | "DOSZKALANIE";
  startDate: Date | null;
  duration: string;
  pricePln: number;
  enrolledCount: number;
  capacity: number | null;
  status: CourseStatus;
};

function normalizeString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function parsePositiveNumber(value: unknown): number | null {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return Math.floor(number);
}

function parseCategory(value: unknown): CourseRow["category"] | null {
  if (value === "A" || value === "B" || value === "DOSZKALANIE") {
    return value;
  }
  return null;
}

function toApiCourse(course: CourseRow) {
  return {
    id: course.id,
    title: course.title,
    category: course.category,
    startDate: course.startDate ? course.startDate.toISOString() : "",
    duration: course.duration,
    pricePln: course.pricePln,
    enrolled: course.enrolledCount,
    capacity: course.capacity,
    status: course.status,
  };
}

function parseStatus(value: unknown): CourseStatus | null {
  if (value === "NABOR" || value === "PLANOWANY" || value === "STALA_OFERTA") {
    return value;
  }
  return null;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ courseId: string }> },
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const payload = (await request.json().catch(() => null)) as {
    status?: unknown;
    title?: unknown;
    category?: unknown;
    startDate?: unknown;
    duration?: unknown;
    pricePln?: unknown;
    enrolled?: unknown;
    capacity?: unknown;
  } | null;

  const title = normalizeString(payload?.title, 120);
  const category = parseCategory(payload?.category);
  const startDate = normalizeString(payload?.startDate, 40);
  const duration = normalizeString(payload?.duration, 60);
  const pricePln = parsePositiveNumber(payload?.pricePln);
  const enrolled = parsePositiveNumber(payload?.enrolled);

  let capacity: number | null = null;
  if (
    payload?.capacity !== "" &&
    payload?.capacity !== null &&
    payload?.capacity !== undefined
  ) {
    capacity = parsePositiveNumber(payload.capacity);
  }

  const status = parseStatus(payload?.status);
  if (!title || !category || !duration || pricePln === null || enrolled === null) {
    return Response.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  if (capacity !== null && enrolled > capacity) {
    return Response.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  if (!status) {
    return Response.json({ error: "INVALID_STATUS" }, { status: 400 });
  }

  const parsedStartDate = startDate ? new Date(startDate) : null;
  if (startDate && (!parsedStartDate || Number.isNaN(parsedStartDate.getTime()))) {
    return Response.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const { courseId } = await context.params;
  const prismaDelegates = prisma as unknown as {
    course?: {
      update: (args: {
        where: { id: string };
        data: {
          title: string;
          category: CourseRow["category"];
          startDate: Date | null;
          duration: string;
          pricePln: number;
          enrolledCount: number;
          capacity: number | null;
          status: CourseStatus;
        };
        select: {
          id: true;
          title: true;
          category: true;
          startDate: true;
          duration: true;
          pricePln: true;
          enrolledCount: true;
          capacity: true;
          status: true;
        };
      }) => Promise<CourseRow>;
      delete: (args: { where: { id: string } }) => Promise<{ id: string }>;
    };
  };

  const courseDelegate = prismaDelegates.course;
  if (!courseDelegate) {
    return Response.json(
      {
        error: "PRISMA_CLIENT_OUTDATED",
        detail: "Restart dev server and run prisma generate.",
      },
      { status: 500 },
    );
  }

  try {
    const course = await courseDelegate.update({
      where: { id: courseId },
      data: {
        title,
        category,
        startDate: parsedStartDate,
        duration,
        pricePln,
        enrolledCount: enrolled,
        capacity,
        status,
      },
      select: {
        id: true,
        title: true,
        category: true,
        startDate: true,
        duration: true,
        pricePln: true,
        enrolledCount: true,
        capacity: true,
        status: true,
      },
    });

    return Response.json({ course: toApiCourse(course) });
  } catch {
    return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ courseId: string }> },
) {
  const authResult = await requireAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const { courseId } = await context.params;
  const prismaDelegates = prisma as unknown as {
    course?: {
      delete: (args: { where: { id: string } }) => Promise<{ id: string }>;
    };
  };

  const courseDelegate = prismaDelegates.course;
  if (!courseDelegate) {
    return Response.json(
      {
        error: "PRISMA_CLIENT_OUTDATED",
        detail: "Restart dev server and run prisma generate.",
      },
      { status: 500 },
    );
  }

  try {
    await courseDelegate.delete({ where: { id: courseId } });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  }
}
