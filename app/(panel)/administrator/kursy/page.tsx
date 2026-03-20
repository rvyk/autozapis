import { prisma } from "@/lib/prisma";
import { KursyPageContent } from "./_components/kursy-page-content";
import type { CourseItem } from "./_components/kursy-types";

export default async function KursyPage() {
  const dbCourses = await prisma.course.findMany({
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

  const courses: CourseItem[] = dbCourses.map((course) => ({
    id: course.id,
    title: course.title,
    category: course.category,
    startDate: course.startDate ? course.startDate.toISOString() : "",
    duration: course.duration,
    pricePln: course.pricePln,
    enrolled: course.enrolledCount,
    capacity: course.capacity,
    status: course.status,
  }));

  return <KursyPageContent initialCourses={courses} />;
}
