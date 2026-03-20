import { getPanelUser } from "@/app/_lib/get-panel-user";
import { InstruktorDashboardPageContent } from "./_components/instruktor-dashboard-page-content";

export default async function InstruktorPage() {
  const dbUser = await getPanelUser({ accessTarget: "instruktor" });

  return <InstruktorDashboardPageContent firstName={dbUser?.firstName} />;
}
