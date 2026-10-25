import { formatAmount } from "@/features/kakeibo/utils/format";
import type { MonthlySummary } from "@/features/reports/types";

interface MonthlySummaryCardsProps {
  summary: MonthlySummary;
}

export function MonthlySummaryCards({ summary }: MonthlySummaryCardsProps) {
  const cards = [
    { label: "合計支出", value: summary.total },
    { label: "変動費", value: summary.variableTotal },
    { label: "固定費", value: summary.fixedTotal },
    { label: "件数", value: summary.itemCount, isCount: true },
  ] as const;

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <p className="text-sm text-gray-500">{card.label}</p>
          <p className="mt-1 text-2xl font-bold">
            {"isCount" in card && card.isCount
              ? `${card.value}件`
              : formatAmount(card.value)}
          </p>
        </article>
      ))}
    </section>
  );
}
