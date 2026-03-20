import { redirect } from "next/navigation";
import { getPanelUser } from "@/app/_lib/get-panel-user";
import { InstruktorWykladyPageContent } from "./_components/instruktor-wyklady-page-content";
import { getInstructorWykladyStudents } from "./_lib/instruktor-wyklady-data";

export default async function InstruktorWykladyPage() {
  const dbUser = await getPanelUser({ accessTarget: "instruktor" });

  if (!dbUser.canTeachTheory) {
    redirect("/instruktor");
  }

  const students = await getInstructorWykladyStudents(dbUser.id);

  return <InstruktorWykladyPageContent students={students} />;
}
