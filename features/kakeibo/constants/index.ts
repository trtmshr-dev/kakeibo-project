import type { ExpenseType } from "@/features/kakeibo/types";

export const DEFAULT_GENRES = ["食費", "日用品", "交通費", "その他"] as const;

export const EXPENSE_TYPE_LABELS: Record<ExpenseType, string> = {
  variable: "変動費",
  fixed: "固定費",
};

export const CHART_COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
] as const;

export const DB_NAME = "KakeiboDB";
export const DB_VERSION = 3;
export const SEED_VERSION = 2;
