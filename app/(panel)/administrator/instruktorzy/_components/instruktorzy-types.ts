export type InstructorStatus = "AKTYWNY" | "NIEAKTYWNY";

export type InstructorListItem = {
  id: string;
  fullName: string;
  email: string;
  status: InstructorStatus;
  joinedAt: string;
};

export const INSTRUCTOR_FILTERS = ["WSZYSCY", "AKTYWNI", "NIEAKTYWNI"] as const;
export type InstructorFilter = (typeof INSTRUCTOR_FILTERS)[number];

export type InstructorsStats = {
  all: number;
  active: number;
  inactive: number;
};
