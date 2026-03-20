import type {
  InstructorFilter,
  InstructorStatus,
  InstructorsStats,
} from "./instruktorzy-types";

export function formatDate(dateIso: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(dateIso));
}

export function getStatusLabel(status: InstructorStatus) {
  return status === "AKTYWNY" ? "Aktywny" : "Nieaktywny";
}

export function getStatusClass(status: InstructorStatus) {
  return status === "AKTYWNY"
    ? "bg-green-100 text-green-800"
    : "bg-stone-200 text-stone-700";
}

export function getFilterLabel(filter: InstructorFilter) {
  if (filter === "AKTYWNI") return "Aktywni";
  if (filter === "NIEAKTYWNI") return "Nieaktywni";
  return "Wszyscy";
}

export function getFilterCount(stats: InstructorsStats, filter: InstructorFilter) {
  if (filter === "AKTYWNI") return stats.active;
  if (filter === "NIEAKTYWNI") return stats.inactive;
  return stats.all;
}

export function getErrorMessage(error: string | null) {
  if (error === "FORBIDDEN") return "Brak uprawnien do wykonania tej operacji.";
  if (error === "NOT_FOUND") return "Nie znaleziono instruktora.";
  if (error === "INVALID_STATUS") return "Niepoprawny status.";
  if (error === "INVALID_EMAIL") return "Podaj poprawny adres e-mail.";
  if (error === "ALREADY_INSTRUCTOR") return "Ten uzytkownik jest juz instruktorem.";
  if (error === "INVALID_USER") return "Wybrany uzytkownik nie jest instruktorem.";
  return "Nie udalo sie zapisac zmian. Sprobuj ponownie.";
}
