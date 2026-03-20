import { DashboardShell } from "@/app/_components/dashboard/dashboard-shell";
import { getPanelUser } from "@/app/_lib/get-panel-user";
import { InstruktorSidebar } from "./_components/instruktor-sidebar";

export default async function InstruktorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getPanelUser({ accessTarget: "instruktor" });

  return <DashboardShell sidebar={<InstruktorSidebar />}>{children}</DashboardShell>;
}
