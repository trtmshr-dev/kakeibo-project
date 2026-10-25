"use client";

import { useMemo } from "react";

import { useGenres } from "@/features/kakeibo/hooks/use-genres";
import { useKakeiboItems } from "@/features/kakeibo/hooks/use-kakeibo-items";
import type { KakeiboItem } from "@/features/kakeibo/types";
import type { MonthlySummary } from "@/features/reports/types";
import {
  buildMonthlySummary,
  filterItemsByMonth,
} from "@/features/reports/utils/monthly-summary";

interface UseMonthlyReportResult {
  summary: MonthlySummary;
  items: KakeiboItem[];
}

export function useMonthlyReport(yearMonth: string): UseMonthlyReportResult {
  const genres = useGenres();
  const allItems = useKakeiboItems();

  const summary = useMemo(
    () => buildMonthlySummary(allItems, genres, yearMonth),
    [allItems, genres, yearMonth],
  );

  const items = useMemo(
    () =>
      filterItemsByMonth(allItems, yearMonth).sort((a, b) =>
        b.date.localeCompare(a.date),
      ),
    [allItems, yearMonth],
  );

  return { summary, items };
}
