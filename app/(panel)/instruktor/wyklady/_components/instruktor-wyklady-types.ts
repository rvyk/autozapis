export type StudentOption = {
  id: string;
  fullName: string;
  phone: string;
  theoryHoursDone: number;
  theoryHoursRequired: number;
  completedTheory: boolean;
};

export type AttendanceStatus = "ENROLLED" | "PRESENT" | "ABSENT";

export type LectureItem = {
  id: string;
  title: string;
  topicType: string;
  startsAt: string;
  durationMinutes: number;
  notes: string;
  attendees: {
    attendanceId: string;
    status: AttendanceStatus;
    creditedMinutes: number;
    student: {
      id: string;
      fullName: string;
      phone: string;
    };
  }[];
};

export type LectureFormState = {
  title: string;
  topicType: string;
  startsAt: string;
  durationMinutes: string;
  notes: string;
  selectedStudentIds: string[];
};

export const DEFAULT_LECTURE_FORM: LectureFormState = {
  title: "",
  topicType: "Teoria podstawowa",
  startsAt: "",
  durationMinutes: "120",
  notes: "",
  selectedStudentIds: [],
};
