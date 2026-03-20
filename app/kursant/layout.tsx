import {
  DashboardBackground,
  DashboardShell,
} from "@/app/_components/dashboard/dashboard-shell";
import { getPanelUser } from "@/app/_lib/get-panel-user";
import { PanelSidebar } from "./_components/panel-sidebar";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dbUser = await getPanelUser({ accessTarget: "kursant" });

  const isActiveKursant = dbUser?.isAccountActive && dbUser?.role === "USER";

  if (isActiveKursant) {
    return (
      <DashboardShell sidebar={<PanelSidebar />}>{children}</DashboardShell>
    );
  }

  return (
    <DashboardBackground>
      <div className="relative">{children}</div>
    </DashboardBackground>
  );
}
