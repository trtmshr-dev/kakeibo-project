import type { KakeiboItem } from "@/features/kakeibo/types";

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function shiftDays(daysAgo: number, referenceDate: Date = new Date()): string {
  const date = new Date(referenceDate);
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return formatLocalDate(date);
}

export function filterItemsWithinPastYear(
  items: KakeiboItem[],
  referenceDate: Date = new Date(),
): KakeiboItem[] {
  const startDate = shiftDays(365, referenceDate);
  const endDate = formatLocalDate(referenceDate);

  return items.filter(
    (item) => item.date >= startDate && item.date <= endDate,
  );
}
