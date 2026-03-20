import { prisma } from "@/lib/prisma";
import { InstruktorzyPageContent } from "./_components/instruktorzy-page-content";
import type { InstructorListItem } from "./_components/instruktorzy-types";

export default async function InstruktorzyPage() {
  const dbInstructors = await prisma.user.findMany({
    where: { role: "INSTRUKTOR" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      isAccountActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const instructors: InstructorListItem[] = dbInstructors.map((item) => {
    const fullName = [item.firstName, item.lastName]
      .filter((part) => typeof part === "string" && part.trim().length > 0)
      .join(" ")
      .trim();

    return {
      id: item.id,
      fullName: fullName || "Brak danych",
      email: item.email ?? "Brak e-mail",
      status: item.isAccountActive ? "AKTYWNY" : "NIEAKTYWNY",
      joinedAt: item.createdAt.toISOString(),
    };
  });

  return <InstruktorzyPageContent initialInstructors={instructors} />;
}
