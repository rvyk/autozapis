import { DashboardSidebar } from "@/app/_components/dashboard/dashboard-sidebar";
import { INSTRUKTOR_SIDEBAR_CONFIG } from "@/app/_components/dashboard/sidebar-config";

export function InstruktorSidebar({
  canTeachPractice,
  canTeachTheory,
}: {
  canTeachPractice: boolean;
  canTeachTheory: boolean;
}) {
  const config = {
    ...INSTRUKTOR_SIDEBAR_CONFIG,
    navItems: INSTRUKTOR_SIDEBAR_CONFIG.navItems.map((item) => {
      if (item.href === "/instruktor/kursanci") {
        return { ...item, disabled: !canTeachPractice };
      }

      if (item.href === "/instruktor/jazdy") {
        return { ...item, disabled: !canTeachPractice && !canTeachTheory };
      }

      if (item.href === "/instruktor/wyklady") {
        return { ...item, disabled: !canTeachTheory };
      }

      return item;
    }),
  };

  return <DashboardSidebar config={config} />;
}
