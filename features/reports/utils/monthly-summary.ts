import type { Genre, KakeiboItem } from "@/features/kakeibo/types";

import type { MonthlySummary } from "@/features/reports/types";

export function filterItemsByMonth(
  items: KakeiboItem[],
  yearMonth: string,
): KakeiboItem[] {
  return items.filter((item) => item.date.startsWith(yearMonth));
}

export function getLatestMonthWithData(items: KakeiboItem[]): string {
  if (items.length === 0) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }

  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));
  return sorted[0].date.slice(0, 7);
}

export function buildMonthlySummary(
  items: KakeiboItem[],
  genres: Genre[],
  yearMonth: string,
): MonthlySummary {
  const monthlyItems = filterItemsByMonth(items, yearMonth);

  const variableTotal = monthlyItems
    .filter((item) => item.type === "variable")
    .reduce((sum, item) => sum + item.amount, 0);

  const fixedTotal = monthlyItems
    .filter((item) => item.type === "fixed")
    .reduce((sum, item) => sum + item.amount, 0);

  const byGenre = genres
    .map((genre) => ({
      genreId: genre.id!,
      genreName: genre.name,
      amount: monthlyItems
        .filter((item) => item.genre_id === genre.id)
        .reduce((sum, item) => sum + item.amount, 0),
    }))
    .filter((entry) => entry.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return {
    yearMonth,
    total: variableTotal + fixedTotal,
    variableTotal,
    fixedTotal,
    byGenre,
    itemCount: monthlyItems.length,
  };
}