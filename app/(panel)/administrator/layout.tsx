import { DashboardShell } from "@/app/_components/dashboard/dashboard-shell";
import { getPanelUser } from "@/app/_lib/get-panel-user";
import { AdminSidebar } from "./_components/admin-sidebar";

export default async function AdministratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getPanelUser({ accessTarget: "administrator" });

  return <DashboardShell sidebar={<AdminSidebar />}>{children}</DashboardShell>;
}
