import type { Metadata } from "next";
import { DashboardShell } from "@/app/_components/dashboard/dashboard-shell";
import { getPanelUser } from "@/app/_lib/get-panel-user";
import { InstruktorSidebar } from "./_components/instruktor-sidebar";

export const metadata: Metadata = {
  title: "Panel instruktora",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function InstruktorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const instructor = await getPanelUser({ accessTarget: "instruktor" });

  return (
    <DashboardShell
      sidebar={
        <InstruktorSidebar
          canTeachPractice={Boolean(instructor.canTeachPractice)}
          canTeachTheory={Boolean(instructor.canTeachTheory)}
        />
      }
    >
      {children}
    </DashboardShell>
  );
}
