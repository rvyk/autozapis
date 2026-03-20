import { DashboardSidebar } from "@/app/_components/dashboard/dashboard-sidebar";
import { INSTRUKTOR_SIDEBAR_CONFIG } from "@/app/_components/dashboard/sidebar-config";

export function InstruktorSidebar() {
  return <DashboardSidebar config={INSTRUKTOR_SIDEBAR_CONFIG} />;
}
