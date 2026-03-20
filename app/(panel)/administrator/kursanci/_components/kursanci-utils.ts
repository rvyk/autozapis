import type {
  KursantResolvedStatus,
  KursantStats,
  KursantStatusFilter,
  RequestError,
} from "./kursanci-types";

export function formatDate(dateIso: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(dateIso));
}

export function getStatusBadgeClass(status: KursantResolvedStatus) {
  if (status === "OCZEKUJACY") return "bg-amber-100 text-amber-800";
  if (status === "AKTYWNY") return "bg-green-100 text-green-800";
  return "bg-stone-200 text-stone-700";
}

export function getFilterCountClass(
  _filterValue: KursantStatusFilter,
  isActive: boolean,
) {
  if (isActive) {
    return "bg-red-200/90 text-red-900";
  }

  return "bg-stone-200 text-stone-700";
}

export function getFilterCount(stats: KursantStats, filterValue: KursantStatusFilter) {
  if (filterValue === "WSZYSCY") return stats.all;
  if (filterValue === "OCZEKUJACY") return stats.oczekujacy;
  if (filterValue === "AKTYWNY") return stats.aktywni;
  return stats.brakPkk;
}

export function getErrorMessage(code: RequestError) {
  if (code === "FORBIDDEN") return "Brak uprawnien do wykonania tej operacji.";
  if (code === "NOT_FOUND") return "Nie znaleziono kursanta lub dokumentu PKK.";
  if (code === "INVALID_STATUS") return "Niepoprawny status kursanta.";
  if (code === "DELETE_FAILED") return "Nie udalo sie usunac dokumentu PKK.";
  if (code === "INVALID_USER") return "Operacja dostepna tylko dla kursanta.";
  return "Nie udalo sie zapisac zmian. Sprobuj ponownie.";
}

export function filterToQueryValue(filter: KursantStatusFilter) {
  if (filter === "OCZEKUJACY") return "oczekujacy";
  if (filter === "AKTYWNY") return "aktywny";
  if (filter === "BRAK_PKK") return "brak-pkk";
  return null;
}
