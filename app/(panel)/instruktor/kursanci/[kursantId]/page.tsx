import { notFound } from "next/navigation";
import {
  MOCK_TRAINING_STUDENTS,
  type TrainingStudent,
} from "@/app/(panel)/_lib/mock-driving-data";
import { InstruktorKursantDetailsPageContent } from "./_components/instruktor-kursant-details-page-content";

export default async function InstruktorKursantDetailsPage({
  params,
}: {
  params: Promise<{ kursantId: string }>;
}) {
  const { kursantId } = await params;

  const student = MOCK_TRAINING_STUDENTS.find((item) => item.id === kursantId);

  if (!student) {
    notFound();
  }

  return (
    <InstruktorKursantDetailsPageContent
      initialStudent={student as TrainingStudent}
    />
  );
}
