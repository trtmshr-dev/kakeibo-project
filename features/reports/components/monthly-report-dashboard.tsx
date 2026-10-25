"use client";

import { useState } from "react";

import { useGenres } from "@/features/kakeibo/hooks/use-genres";
import { useKakeiboInit } from "@/features/kakeibo/hooks/use-kakeibo-init";
import { useKakeiboItems } from "@/features/kakeibo/hooks/use-kakeibo-items";
import { MonthlyExpenseTable } from "@/features/reports/components/monthly-expense-table";
import { MonthlyGenreChart } from "@/features/reports/components/monthly-genre-chart";
import { MonthlySummaryCards } from "@/features/reports/components/monthly-summary-cards";
import { MonthSelector } from "@/features/reports/components/month-selector";
import { useMonthlyReport } from "@/features/reports/hooks/use-monthly-report";
import { getLatestMonthWithData } from "@/features/reports/utils/monthly-summary";

export function MonthlyReportDashboard() {
  useKakeiboInit();

  const genres = useGenres();
  const allItems = useKakeiboItems();

  const [selectedYearMonth, setSelectedYearMonth] = useState<string | null>(
    null,
  );

  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}`;

  const yearMonth =
    selectedYearMonth ??
    (allItems.length > 0
      ? getLatestMonthWithData(allItems)
      : currentYearMonth);

  const { summary, items } = useMonthlyReport(yearMonth);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">月次レポート</h1>
          <p className="mt-1 text-sm text-gray-500">
            月ごとの支出合計・ジャンル別内訳・明細を確認できます。
          </p>
        </div>
        <MonthSelector value={yearMonth} onChange={setSelectedYearMonth} />
      </header>

      <MonthlySummaryCards summary={summary} />
      <MonthlyGenreChart data={summary.byGenre} />
      <MonthlyExpenseTable items={items} genres={genres} />
    </div>
  );
}