export type CourseStatus = "NABOR" | "PLANOWANY" | "STALA_OFERTA";

export type CourseCategory = "A" | "B" | "DOSZKALANIE";

export type CourseItem = {
  id: string;
  title: string;
  category: CourseCategory;
  startDate: string;
  duration: string;
  pricePln: number;
  enrolled: number;
  capacity: number | null;
  status: CourseStatus;
};

export const COURSE_FILTERS = ["WSZYSTKIE", "NABOR", "PLANOWANE", "STALA_OFERTA"] as const;
export type CourseFilter = (typeof COURSE_FILTERS)[number];

export type CourseStats = {
  all: number;
  nabor: number;
  planowane: number;
  stala: number;
};

export type CourseDraft = {
  title: string;
  category: CourseCategory;
  startDate: string;
  durationValue: string;
  durationUnit: "dni" | "tygodnie" | "godziny";
  pricePln: string;
  enrolled: string;
  capacity: string;
  status: CourseStatus;
};

export const EMPTY_COURSE_DRAFT: CourseDraft = {
  title: "",
  category: "B",
  startDate: "",
  durationValue: "",
  durationUnit: "tygodnie",
  pricePln: "",
  enrolled: "",
  capacity: "",
  status: "NABOR",
};
