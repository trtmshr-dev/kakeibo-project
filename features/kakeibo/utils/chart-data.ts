import type { ChartDataItem, Genre, KakeiboItem } from "@/features/kakeibo/types";

export function buildChartData(
  genres: Genre[],
  items: KakeiboItem[],
): ChartDataItem[] {
  return genres
    .map((genre) => ({
      id: genre.id,
      name: genre.name,
      value: items
        .filter((item) => item.genre_id === genre.id)
        .reduce((sum, item) => sum + item.amount, 0),
    }))
    .filter((data) => data.value > 0);
}
