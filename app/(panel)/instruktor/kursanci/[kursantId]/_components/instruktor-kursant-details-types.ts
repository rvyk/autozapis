export type TrainingRide = {
  id: string;
  startsAt: string;
  durationHours: number;
  topic: string;
  route: string;
  status: "PLANOWANA" | "ZREALIZOWANA" | "ODWOLANA";
  instructorNote: string;
  routeScore: 1 | 2 | 3 | 4 | 5;
};

export type TrainingStudent = {
  id: string;
  fullName: string;
  phone: string;
  category: "A" | "B";
  hoursTarget: number;
  rides: TrainingRide[];
};
