import { notFound } from "next/navigation";
import { getPanelUser } from "@/app/_lib/get-panel-user";
import { InstruktorKursantDetailsPageContent } from "./_components/instruktor-kursant-details-page-content";
import { getInstructorKursantDetailsData } from "./_lib/instruktor-kursant-details-data";

export default async function InstruktorKursantDetailsPage({
  params,
}: {
  params: Promise<{ kursantId: string }>;
}) {
  const instructor = await getPanelUser({ accessTarget: "instruktor" });

  const { kursantId } = await params;

  const hydratedStudent = await getInstructorKursantDetailsData({
    instructorId: (instructor as { id: string }).id,
    studentId: kursantId,
  });

  if (!hydratedStudent) {
    notFound();
  }

  return (
    <InstruktorKursantDetailsPageContent initialStudent={hydratedStudent} />
  );
}
