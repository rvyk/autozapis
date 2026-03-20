export type StatPayload = {
  totalStudents: number;
  pendingPkk: number;
  activeCourses: number;
  activeInstructors: number;
  totalInstructors: number;
  newStudentsThisWeek: number;
};

export type ChartPoint = {
  label: string;
  shortLabel?: string;
  value: number;
};

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

export type AnalyticsPayload = {
  registrationsChart: ChartPoint[];
  pkkChart: ChartPoint[];
  categoryChart: ChartPoint[];
};

export type AnnouncementPreview = {
  id: string;
  title: string;
  target:
    | "ALL_KURSANCI"
    | "KURSANCI_KAT_A"
    | "KURSANCI_KAT_B"
    | "KURSANCI_OCZEKUJACY"
    | "INSTRUKTORZY";
  createdAt: string;
};

export const CHART_TABS = ["REJESTRACJE", "PKK", "KATEGORIE"] as const;
export type ChartTab = (typeof CHART_TABS)[number];
