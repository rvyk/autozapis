import { getPanelUser } from "@/app/_lib/get-panel-user";
import { WykladyPageContent } from "./_components/wyklady-page-content";

export default async function WykladyPage() {
  await getPanelUser({ accessTarget: "kursant" });
  return <WykladyPageContent />;
}
