export const KURSANT_STATUS_FILTER_VALUES = [
  "WSZYSCY",
  "OCZEKUJACY",
  "AKTYWNY",
  "BRAK_PKK",
] as const;

export type KursantStatusFilter = (typeof KURSANT_STATUS_FILTER_VALUES)[number];

export type KursantResolvedStatus = Exclude<KursantStatusFilter, "WSZYSCY">;

export type KursantListItem = {
  id: string;
  fullName: string;
  email: string;
  registeredAt: string;
  trainingCategory: "A" | "B";
  coursePrice: number;
  amountPaid: number;
  status: KursantResolvedStatus;
  pkkFile: {
    originalFileName: string;
    uploadedAt: string;
  } | null;
};

export type KursantStats = {
  all: number;
  oczekujacy: number;
  aktywni: number;
  brakPkk: number;
};

export const FILTER_OPTIONS: { value: KursantStatusFilter; label: string }[] = [
  { value: "WSZYSCY", label: "Wszyscy" },
  { value: "OCZEKUJACY", label: "Oczekujący" },
  { value: "AKTYWNY", label: "Aktywni" },
  { value: "BRAK_PKK", label: "Brak PKK" },
];

export const STATUS_LABELS: Record<KursantResolvedStatus, string> = {
  OCZEKUJACY: "Oczekujący",
  AKTYWNY: "Aktywny",
  BRAK_PKK: "Brak PKK",
};

export type RequestError =
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "INVALID_STATUS"
  | "UPDATE_FAILED"
  | "DELETE_FAILED"
  | "INVALID_USER"
  | "INVALID_INPUT"
  | "UNKNOWN";
