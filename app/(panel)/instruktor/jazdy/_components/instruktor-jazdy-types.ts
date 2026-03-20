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
