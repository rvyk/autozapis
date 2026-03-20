export type CalendarRide = {
  id: string;
  studentId: string;
  studentName: string;
  startsAt: string;
  topic: string;
  route: string;
  durationHours: number;
  status?: "PLANOWANA" | "ZREALIZOWANA" | "ODWOLANA";
};

export type CalendarLecture = {
  id: string;
  startsAt: string;
  title: string;
  topicType: string;
  durationHours: number;
};

export type CalendarItem =
  | {
      kind: "ride";
      id: string;
      startsAt: string;
      label: string;
      details: string;
      href: string;
      subtitle?: string;
    }
  | {
      kind: "lecture";
      id: string;
      startsAt: string;
      label: string;
      details: string;
      href: string;
      subtitle?: string;
    };
