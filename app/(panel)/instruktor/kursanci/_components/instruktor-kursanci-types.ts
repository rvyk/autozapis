export type StudentItem = {
  id: string;
  fullName: string;
  phone: string;
  category: "A" | "B";
  hoursDone: number;
  hoursTarget: number;
  assignedToMe: boolean;
  assignedToAnyone: boolean;
};

export const INSTRUCTOR_STUDENT_FILTERS = ["WSZYSCY", "MOI", "WOLNI"] as const;
export type InstructorStudentFilter = (typeof INSTRUCTOR_STUDENT_FILTERS)[number];
