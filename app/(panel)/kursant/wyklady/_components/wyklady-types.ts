export type AttendanceStatus = "ENROLLED" | "PRESENT" | "ABSENT";

export type LectureItem = {
  attendanceId: string;
  status: AttendanceStatus;
  creditedMinutes: number;
  session: {
    id: string;
    title: string;
    topicType: string;
    startsAt: string;
    durationMinutes: number;
  };
};
