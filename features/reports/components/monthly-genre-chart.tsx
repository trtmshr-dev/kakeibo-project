"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CHART_COLORS } from "@/features/kakeibo/constants";
import type { GenreBreakdown } from "@/features/reports/types";

interface MonthlyGenreChartProps {
  data: GenreBreakdown[];
}

export function MonthlyGenreChart({ data }: MonthlyGenreChartProps) {
  if (data.length === 0) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">ジャンル別支出</h2>
        <p className="text-sm text-gray-500">この月の支出データがありません。</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">ジャンル別支出</h2>
      <div className="h-80 w-full min-w-0">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minHeight={320}
          initialDimension={{ width: 480, height: 320 }}
        >
          <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="genreName" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(value) => `${Number(value).toLocaleString("ja-JP")}`} />
            <Tooltip
              formatter={(value) => `${Number(value).toLocaleString("ja-JP")}円`}
            />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={entry.genreId}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
