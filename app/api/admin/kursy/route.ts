import { requireAdmin } from "@/app/api/admin/_lib/kursanci";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type CourseStatus = "NABOR" | "PLANOWANY" | "STALA_OFERTA";
type CourseCategory = "A" | "B" | "DOSZKALANIE";

type CourseRow = {
  id: string;
  title: string;
  category: CourseCategory;
  startDate: Date | null;
  duration: string;
  pricePln: number;
  enrolledCount: number;
  capacity: number | null;
  status: CourseStatus;
};

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

function normalizeString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function parsePositiveNumber(value: unknown): number | null {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return Math.floor(number);
}

function parseStatus(value: unknown): CourseStatus | null {
  if (value === "NABOR" || value === "PLANOWANY" || value === "STALA_OFERTA") {
    return value;
  }
  return null;
}

function parseCategory(value: unknown): CourseCategory | null {
  if (value === "A" || value === "B" || value === "DOSZKALANIE") {
    return value;
  }
  return null;
}

export async function GET() {
  const authResult = await requireAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const prismaDelegates = prisma as unknown as {
    course?: {
      findMany: (args: {
        orderBy: { createdAt: "desc" };
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
      }) => Promise<CourseRow[]>;
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

  const courses = await courseDelegate.findMany({
    orderBy: { createdAt: "desc" },
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

  return Response.json({ courses: courses.map(toApiCourse) });
}

export async function POST(request: Request) {
  const authResult = await requireAdmin();
  if ("error" in authResult) {
    return authResult.error;
  }

  const payload = (await request.json().catch(() => null)) as {
    title?: unknown;
    category?: unknown;
    startDate?: unknown;
    duration?: unknown;
    pricePln?: unknown;
    enrolled?: unknown;
    capacity?: unknown;
    status?: unknown;
  } | null;

  const title = normalizeString(payload?.title, 120);
  const category = parseCategory(payload?.category);
  const startDate = normalizeString(payload?.startDate, 40);
  const duration = normalizeString(payload?.duration, 60);
  const pricePln = parsePositiveNumber(payload?.pricePln);
  const enrolled = parsePositiveNumber(payload?.enrolled);
  const status = parseStatus(payload?.status);

  let capacity: number | null = null;
  if (payload?.capacity !== "" && payload?.capacity !== null && payload?.capacity !== undefined) {
    capacity = parsePositiveNumber(payload.capacity);
  }

  if (!title || !category || !duration || pricePln === null || enrolled === null || !status) {
    return Response.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  if (capacity !== null && enrolled > capacity) {
    return Response.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const prismaDelegates = prisma as unknown as {
    course?: {
      create: (args: {
        data: {
          title: string;
          category: CourseCategory;
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

  const parsedStartDate = startDate ? new Date(startDate) : null;
  if (startDate && (!parsedStartDate || Number.isNaN(parsedStartDate.getTime()))) {
    return Response.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const course = await courseDelegate.create({
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

  return Response.json({ course: toApiCourse(course) }, { status: 201 });
}
