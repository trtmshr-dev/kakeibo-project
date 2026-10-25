"use client";

import { useMemo, useState } from "react";

import { ExpenseChart } from "@/features/kakeibo/components/expense-chart";
import { ExpenseHistoryList } from "@/features/kakeibo/components/expense-history-list";
import { useGenres } from "@/features/kakeibo/hooks/use-genres";
import { useKakeiboInit } from "@/features/kakeibo/hooks/use-kakeibo-init";
import { useKakeiboItems } from "@/features/kakeibo/hooks/use-kakeibo-items";
import { buildChartData } from "@/features/kakeibo/utils/chart-data";
import { filterItemsWithinPastYear } from "@/features/kakeibo/utils/date-filter";

type ChartPeriod = "all" | "year";

const PERIOD_LABELS: Record<ChartPeriod, string> = {
  all: "全期間",
  year: "1年間",
};

export function TopPage() {
  useKakeiboInit();

  const genres = useGenres();
  const items = useKakeiboItems();

  const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod | null>(
    null,
  );
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);

  const yearlyItems = useMemo(
    () => filterItemsWithinPastYear(items),
    [items],
  );

  const allTimeChartData = useMemo(
    () => buildChartData(genres, items),
    [genres, items],
  );

  const yearlyChartData = useMemo(
    () => buildChartData(genres, yearlyItems),
    [genres, yearlyItems],
  );

  const allTimeTotal = useMemo(
    () => items.reduce((total, item) => total + item.amount, 0),
    [items],
  );

  const yearlyTotal = useMemo(
    () => yearlyItems.reduce((total, item) => total + item.amount, 0),
    [yearlyItems],
  );

  const selectedGenre = genres.find(
    (genre) => genre.id === selectedGenreId,
  );

  const selectedItems = useMemo(() => {
    if (selectedGenreId == null || selectedPeriod == null) {
      return [];
    }

    const sourceItems = selectedPeriod === "year" ? yearlyItems : items;

    return sourceItems.filter(
      (item) => item.genre_id === selectedGenreId,
    );
  }, [items, yearlyItems, selectedGenreId, selectedPeriod]);

  const handleGenreSelect = (period: ChartPeriod, genreId: number) => {
    setSelectedPeriod(period);
    setSelectedGenreId(genreId);
  };

  const historyTitle =
    selectedPeriod != null && selectedGenre
      ? `${selectedGenre.name} の履歴（${PERIOD_LABELS[selectedPeriod]}）`
      : undefined;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">トップページ</h1>
        <p className="mt-1 text-sm text-gray-500">
          全期間と直近1年間のジャンル別支出を円グラフで確認できます。
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <ExpenseChart
          title="全期間"
          totalAmount={allTimeTotal}
          data={allTimeChartData}
          onGenreSelect={(genreId) => handleGenreSelect("all", genreId)}
        />

        <ExpenseChart
          title="1年間"
          totalAmount={yearlyTotal}
          data={yearlyChartData}
          onGenreSelect={(genreId) => handleGenreSelect("year", genreId)}
        />
      </div>

      {selectedGenreId != null && selectedPeriod != null && (
        <ExpenseHistoryList
          title={historyTitle}
          genre={selectedGenre}
          items={selectedItems}
          genres={genres}
        />
      )}
    </div>
  );
}