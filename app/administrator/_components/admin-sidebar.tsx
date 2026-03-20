import { DashboardSidebar } from "@/app/_components/dashboard/dashboard-sidebar";
import { ADMIN_SIDEBAR_CONFIG } from "@/app/_components/dashboard/sidebar-config";

export function AdminSidebar() {
  return <DashboardSidebar config={ADMIN_SIDEBAR_CONFIG} />;
}
