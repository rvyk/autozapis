import { redirect } from "next/navigation";
import { getPanelUser } from "@/app/_lib/get-panel-user";
import {
  getAnnouncementTargetsForKursant,
  getLatestKursantAnnouncements,
} from "../_lib/announcements";
import { OczekiwaniePageContent } from "./_components/oczekiwanie-page-content";

export default async function PanelOczekiwaniePage() {
  const dbUser = await getPanelUser({ accessTarget: "kursant" });

  if (dbUser?.isAccountActive) {
    redirect("/kursant");
  }

  const allowedTargets = getAnnouncementTargetsForKursant(
    dbUser?.trainingCategory,
    true,
  );
  const latestAnnouncements = await getLatestKursantAnnouncements(
    allowedTargets,
    3,
  );

  return (
    <OczekiwaniePageContent
      firstName={dbUser?.firstName}
      latestAnnouncements={latestAnnouncements.map((item) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        createdAt: item.createdAt.toISOString(),
      }))}
    />
  );
}
