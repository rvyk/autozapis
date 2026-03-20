import type { CalendarItem } from "./instruktor-jazdy-types";

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getMonthDays(year: number, month: number) {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const days: Date[] = [];

  for (let day = 1; day <= end.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }

  const leadingEmpty = (start.getDay() + 6) % 7;
  return { days, leadingEmpty };
}

export function groupCalendarItemsByDay(items: CalendarItem[]) {
  const map = new Map<string, CalendarItem[]>();

  for (const item of items) {
    const key = toDateKey(new Date(item.startsAt));
    const existing = map.get(key) ?? [];
    existing.push(item);
    map.set(key, existing);
  }

  for (const [key, value] of map.entries()) {
    map.set(
      key,
      [...value].sort(
        (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
      ),
    );
  }

  return map;
}
