export type RideStatus = "PLANOWANA" | "ZREALIZOWANA";

export type TrainingRide = {
  id: string;
  startsAt: string;
  durationHours: number;
  topic: string;
  route: string;
  status: RideStatus;
  instructorNote: string;
  routeScore: 1 | 2 | 3 | 4 | 5;
};

export type TrainingStudent = {
  id: string;
  fullName: string;
  phone: string;
  category: "A" | "B";
  hoursDone: number;
  hoursTarget: number;
  note: string;
  assignedToMe: boolean;
  rides: TrainingRide[];
};

export const CURRENT_KURSANT_MOCK_ID = "1";

export const MOCK_TRAINING_STUDENTS: TrainingStudent[] = [
  {
    id: "1",
    fullName: "Jan Kowalski",
    phone: "600-111-222",
    category: "B",
    hoursDone: 12,
    hoursTarget: 30,
    note: "Dobra dynamika, poprawić obserwację lusterek.",
    assignedToMe: true,
    rides: [
      {
        id: "1-r1",
        startsAt: "",
        durationHours: 2,
        topic: "Plac manewrowy",
        route: "",
        status: "PLANOWANA",
        instructorNote: "",
        routeScore: 3,
      },
      {
        id: "1-r2",
        startsAt: "2026-03-10T15:00",
        durationHours: 2,
        topic: "Jazda po mieście - skrzyżowania",
        route: "Rondo JPII, ul. Mickiewicza",
        status: "ZREALIZOWANA",
        instructorNote:
          "Pamiętaj o wcześniejszym wrzucaniu kierunkowskazu przy zjeździe z ronda. Poza tym dynamika bardzo dobra!",
        routeScore: 4,
      },
      {
        id: "1-r3",
        startsAt: "2026-03-05T17:00",
        durationHours: 1,
        topic: "Plac manewrowy",
        route: "Plac własny OSK",
        status: "ZREALIZOWANA",
        instructorNote:
          "Łuk opanowany w 100%. Górka wymaga doszlifowania ruszania z ręcznego.",
        routeScore: 4,
      },
    ],
  },
  {
    id: "2",
    fullName: "Anna Nowak",
    phone: "600-333-444",
    category: "B",
    hoursDone: 7,
    hoursTarget: 30,
    note: "Więcej ćwiczeń na skrzyżowaniach równorzędnych.",
    assignedToMe: false,
    rides: [
      {
        id: "2-r1",
        startsAt: "2026-03-24T11:30",
        durationHours: 2,
        topic: "Miasto - ronda",
        route: "JPII -> Sanowa -> Mickiewicza",
        status: "PLANOWANA",
        instructorNote: "",
        routeScore: 3,
      },
    ],
  },
  {
    id: "3",
    fullName: "Piotr Wróbel",
    phone: "600-555-666",
    category: "A",
    hoursDone: 16,
    hoursTarget: 20,
    note: "Gotowy do jazd egzaminacyjnych.",
    assignedToMe: true,
    rides: [
      {
        id: "3-r1",
        startsAt: "2026-03-25T15:30",
        durationHours: 1,
        topic: "Trasa egzaminacyjna",
        route: "Centrum -> Obwodnica",
        status: "PLANOWANA",
        instructorNote: "",
        routeScore: 5,
      },
      {
        id: "3-r2",
        startsAt: "2026-03-23T15:00",
        durationHours: 1,
        topic: "Plac + ruszanie pod górę",
        route: "Plac OSK",
        status: "ZREALIZOWANA",
        instructorNote: "Technicznie dobrze, do poprawy płynna zmiana biegów.",
        routeScore: 4,
      },
    ],
  },
];
