import type { Genre, KakeiboItem } from "@/features/kakeibo/types";
import {
  formatAmount,
  formatExpenseType,
} from "@/features/kakeibo/utils/format";

interface MonthlyExpenseTableProps {
  items: KakeiboItem[];
  genres: Genre[];
}

export function MonthlyExpenseTable({ items, genres }: MonthlyExpenseTableProps) {
  const genreMap = new Map(genres.map((genre) => [genre.id, genre.name]));

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">支出一覧</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">この月の支出はありません。</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="px-3 py-2 font-medium">日付</th>
                <th className="px-3 py-2 font-medium">ジャンル</th>
                <th className="px-3 py-2 font-medium">種別</th>
                <th className="px-3 py-2 font-medium text-right">金額</th>
                <th className="px-3 py-2 font-medium">メモ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-3 py-2">{item.date}</td>
                  <td className="px-3 py-2">{genreMap.get(item.genre_id) ?? "不明"}</td>
                  <td className="px-3 py-2">{formatExpenseType(item.type)}</td>
                  <td className="px-3 py-2 text-right">{formatAmount(item.amount)}</td>
                  <td className="px-3 py-2 text-gray-600">{item.memo || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
