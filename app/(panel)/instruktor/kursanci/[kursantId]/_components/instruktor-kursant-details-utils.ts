import type { TrainingRide } from "./instruktor-kursant-details-types";

export function formatDateTime(value: string) {
  if (!value) return "Do umowienia";
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function sortRidesDescending(rides: TrainingRide[]) {
  return [...rides].sort((a, b) => {
    if (!a.startsAt && !b.startsAt) return 0;
    if (!a.startsAt) return -1;
    if (!b.startsAt) return 1;
    return new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime();
  });
}

export function getCompletedHours(rides: TrainingRide[]) {
  return rides.reduce((total, ride) => {
    if (ride.status !== "ZREALIZOWANA") return total;
    return total + Math.max(0, ride.durationHours);
  }, 0);
}
