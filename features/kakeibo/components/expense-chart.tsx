"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { CHART_COLORS } from "@/features/kakeibo/constants";
import type { ChartDataItem } from "@/features/kakeibo/types";

interface ExpenseChartProps {
  title: string;
  totalAmount: number;
  data: ChartDataItem[];
  onGenreSelect: (genreId: number) => void;
}

export function ExpenseChart({
  title,
  totalAmount,
  data,
  onGenreSelect,
}: ExpenseChartProps) {
  if (data.length === 0) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-2xl font-bold tracking-tight">
          合計支出：{totalAmount.toLocaleString("ja-JP")}円
        </p>
        <p className="mt-4 text-sm text-gray-500">
          表示する支出データがありません。
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>

      <p className="mt-2 text-2xl font-bold tracking-tight">
        合計支出：{totalAmount.toLocaleString("ja-JP")}円
      </p>

      <div className="mt-2 h-80 w-full min-w-0">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minHeight={320}
          initialDimension={{ width: 400, height: 320 }}
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="70%"
              isAnimationActive={false}
              onClick={(entry) => {
                const genreId = (entry as unknown as ChartDataItem).id;
                if (genreId != null) {
                  onGenreSelect(genreId);
                }
              }}
              cursor="pointer"
            >
              {data.map((item, index) => (
                <Cell
                  key={item.name}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) =>
                `${Number(value).toLocaleString("ja-JP")}円`
              }
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}