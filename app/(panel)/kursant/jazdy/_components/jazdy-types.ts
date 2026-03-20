export type StudentRide = {
  id: string;
  startsAt: string;
  durationHours: number;
  topic: string;
  route: string;
  instructorNote: string;
  status: "PLANOWANA" | "ZREALIZOWANA" | "ODWOLANA";
  instructorName: string;
};
