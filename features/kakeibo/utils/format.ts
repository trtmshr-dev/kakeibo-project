import { EXPENSE_TYPE_LABELS } from "@/features/kakeibo/constants";
import type { ExpenseType } from "@/features/kakeibo/types";

export function formatAmount(amount: number): string {
  return `${amount.toLocaleString("ja-JP")}円`;
}

export function formatExpenseType(type: ExpenseType): string {
  return EXPENSE_TYPE_LABELS[type];
}
