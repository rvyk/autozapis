const DATE_TIME_SHORT_FORMATTER = new Intl.DateTimeFormat("pl-PL", {
  dateStyle: "short",
  timeStyle: "short",
});

const DATE_TIME_MEDIUM_FORMATTER = new Intl.DateTimeFormat("pl-PL", {
  dateStyle: "medium",
  timeStyle: "short",
});

const DATE_FULL_FORMATTER = new Intl.DateTimeFormat("pl-PL", {
  dateStyle: "full",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("pl-PL", {
  hour: "2-digit",
  minute: "2-digit",
});

const MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat("pl-PL", {
  month: "long",
  year: "numeric",
});

function toDate(value: Date | string) {
  return typeof value === "string" ? new Date(value) : value;
}

export function formatPlDateTimeShort(value: Date | string) {
  return DATE_TIME_SHORT_FORMATTER.format(toDate(value));
}

export function formatPlDateTimeMedium(value: Date | string) {
  return DATE_TIME_MEDIUM_FORMATTER.format(toDate(value));
}

export function formatPlDateFull(value: Date | string) {
  return DATE_FULL_FORMATTER.format(toDate(value));
}

export function formatPlTime(value: Date | string) {
  return TIME_FORMATTER.format(toDate(value));
}

export function formatPlMonthYear(value: Date | string) {
  return MONTH_YEAR_FORMATTER.format(toDate(value));
}
