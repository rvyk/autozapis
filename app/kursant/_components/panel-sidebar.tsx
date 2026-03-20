import { DashboardSidebar } from "@/app/_components/dashboard/dashboard-sidebar";
import { KURSANT_SIDEBAR_CONFIG } from "@/app/_components/dashboard/sidebar-config";

export function PanelSidebar() {
  return <DashboardSidebar config={KURSANT_SIDEBAR_CONFIG} />;
}
