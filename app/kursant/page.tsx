import { redirect } from "next/navigation";
import { getPanelUser } from "@/app/_lib/get-panel-user";
import {
  getAnnouncementTargetsForKursant,
  getLatestKursantAnnouncements,
} from "./_lib/announcements";
import { PanelPageContent } from "./_components/panel-page-content";

export default async function PanelPage() {
  const dbUser = await getPanelUser({ accessTarget: "kursant" });

  if (!dbUser?.isAccountActive) {
    redirect("/kursant/oczekiwanie");
  }

  const allowedTargets = getAnnouncementTargetsForKursant(
    dbUser.trainingCategory,
  );

  const latestAnnouncements = await getLatestKursantAnnouncements(
    allowedTargets,
    4,
  );

  return (
    <PanelPageContent
      firstName={dbUser?.firstName}
      latestAnnouncements={latestAnnouncements}
    />
  );
}
