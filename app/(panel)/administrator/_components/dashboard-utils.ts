import type { AnnouncementPreview } from "./dashboard-types";

export const PIE_COLORS = ["#dc2626", "#f59e0b", "#10b981", "#6366f1"];

export const TARGET_LABELS: Record<AnnouncementPreview["target"], string> = {
  ALL_KURSANCI: "Wszyscy kursanci",
  KURSANCI_KAT_A: "Kursanci kat. A",
  KURSANCI_KAT_B: "Kursanci kat. B",
  KURSANCI_OCZEKUJACY: "Kursanci oczekujący",
  INSTRUKTORZY: "Instruktorzy",
};

export function formatActivityDate(value: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
