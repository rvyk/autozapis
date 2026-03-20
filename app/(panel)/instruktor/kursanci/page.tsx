import { getPanelUser } from "@/app/_lib/get-panel-user";
import { InstruktorKursanciPageContent } from "./_components/instruktor-kursanci-page-content";

export default async function InstruktorKursanciPage() {
  await getPanelUser({ accessTarget: "instruktor" });

  return <InstruktorKursanciPageContent />;
}
