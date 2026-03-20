import type { CourseCategory, CourseFilter, CourseItem, CourseStatus } from "./kursy-types";

export function statusToLabel(status: CourseStatus) {
  if (status === "NABOR") return "Trwa nabór";
  if (status === "PLANOWANY") return "Planowany";
  return "Stała oferta";
}

export function statusToClass(status: CourseStatus) {
  if (status === "NABOR") return "bg-green-100 text-green-800";
  if (status === "PLANOWANY") return "bg-amber-100 text-amber-800";
  return "bg-stone-200 text-stone-700";
}

export function categoryToLabel(category: CourseCategory) {
  if (category === "A") return "Kategoria A";
  if (category === "B") return "Kategoria B";
  return "Doszkalanie";
}

export function filterToLabel(filter: CourseFilter) {
  if (filter === "NABOR") return "Nabór";
  if (filter === "PLANOWANE") return "Planowane";
  if (filter === "STALA_OFERTA") return "Stała oferta";
  return "Wszystkie";
}

export function filterToStatus(filter: CourseFilter): CourseStatus | null {
  if (filter === "NABOR") return "NABOR";
  if (filter === "PLANOWANE") return "PLANOWANY";
  if (filter === "STALA_OFERTA") return "STALA_OFERTA";
  return null;
}

export function formatPrice(pricePln: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(pricePln);
}

export function formatStartDate(isoDate: string) {
  if (!isoDate) return "Dowolnie";
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "short",
  }).format(new Date(isoDate));
}

export function getSpotsLabel(course: CourseItem) {
  if (course.capacity === null) {
    return `${course.enrolled} / nielimitowane`;
  }

  return `${course.enrolled}/${course.capacity}`;
}

export function getErrorMessage(error: string | null) {
  if (error === "FORBIDDEN") return "Brak uprawnień do zarządzania kursami.";
  if (error === "INVALID_PAYLOAD") return "Uzupełnij poprawnie wszystkie pola kursu.";
  if (error === "NOT_FOUND") return "Nie znaleziono kursu.";
  if (error === "INVALID_STATUS") return "Niepoprawny status kursu.";
  return "Nie udało się zapisać zmian. Spróbuj ponownie.";
}
