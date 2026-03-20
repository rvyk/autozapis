export type AnnouncementTarget =
  | "ALL_KURSANCI"
  | "KURSANCI_KAT_A"
  | "KURSANCI_KAT_B"
  | "KURSANCI_OCZEKUJACY"
  | "INSTRUKTORZY";

export type Announcement = {
  id: string;
  title: string;
  content: string;
  target: AnnouncementTarget;
  authorName: string;
  createdAt: string;
  updatedAt: string;
};

export type AnnouncementForm = {
  title: string;
  target: AnnouncementTarget;
  content: string;
};

export const TARGET_OPTIONS = [
  { value: "ALL_KURSANCI", label: "Wszyscy kursanci" },
  { value: "KURSANCI_KAT_B", label: "Kursanci kat. B" },
  { value: "KURSANCI_KAT_A", label: "Kursanci kat. A" },
  { value: "KURSANCI_OCZEKUJACY", label: "Kursanci oczekujacy" },
  { value: "INSTRUKTORZY", label: "Instruktorzy" },
] as const;

export const TARGET_LABELS: Record<AnnouncementTarget, string> = {
  ALL_KURSANCI: "Wszyscy kursanci",
  KURSANCI_KAT_A: "Kursanci kat. A",
  KURSANCI_KAT_B: "Kursanci kat. B",
  KURSANCI_OCZEKUJACY: "Kursanci oczekujacy",
  INSTRUKTORZY: "Instruktorzy",
};

export const DEFAULT_FORM: AnnouncementForm = {
  title: "",
  target: TARGET_OPTIONS[0].value,
  content: "",
};
