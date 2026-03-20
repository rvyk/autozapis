import { redirect } from "next/navigation";
import { getPanelUser } from "@/app/_lib/get-panel-user";
import { InstruktorKursanciPageContent } from "./_components/instruktor-kursanci-page-content";

export default async function InstruktorKursanciPage() {
  const instructor = await getPanelUser({ accessTarget: "instruktor" });

  if (!instructor.canTeachPractice) {
    redirect("/instruktor");
  }

  return <InstruktorKursanciPageContent />;
}
