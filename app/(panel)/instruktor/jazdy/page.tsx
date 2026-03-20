import { redirect } from "next/navigation";
import { getPanelUser } from "@/app/_lib/get-panel-user";
import { InstruktorJazdyPageContent } from "./_components/instruktor-jazdy-page-content";

export default async function InstruktorJazdyPage() {
  const instructor = await getPanelUser({ accessTarget: "instruktor" });

  if (!instructor.canTeachPractice && !instructor.canTeachTheory) {
    redirect("/instruktor");
  }

  return <InstruktorJazdyPageContent />;
}
