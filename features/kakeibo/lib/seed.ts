import { DEFAULT_GENRES } from "@/features/kakeibo/constants";
import type { ExpenseType, NewKakeiboItem } from "@/features/kakeibo/types";
import { shiftDays } from "@/features/kakeibo/utils/date-filter";

import { db } from "./db";

interface SeedExpense {
  daysAgo: number;
  amount: number;
  type: ExpenseType;
  memo: string;
  genreIndex: number;
}

/**
 * サンプルデータのバージョン。
 * このバージョンのデータは初回に一度だけ投入する。
 */
const SAMPLE_DATA_VERSION = "realistic-v2";

/** 直近1年分の日常的な支出 */
const PAST_YEAR_EXPENSES: SeedExpense[] = [
  { daysAgo: 3, amount: 680, type: "variable", memo: "コンビニで飲み物・軽食", genreIndex: 0 },
  { daysAgo: 5, amount: 4280, type: "variable", memo: "スーパーで食料品", genreIndex: 0 },
  { daysAgo: 8, amount: 1240, type: "variable", memo: "昼食", genreIndex: 0 },
  { daysAgo: 12, amount: 5980, type: "variable", memo: "スーパーで食料品・惣菜", genreIndex: 0 },
  { daysAgo: 15, amount: 2200, type: "variable", memo: "友人と外食", genreIndex: 0 },
  { daysAgo: 18, amount: 890, type: "variable", memo: "電車代", genreIndex: 2 },
  { daysAgo: 22, amount: 3480, type: "variable", memo: "洗剤・ティッシュなど", genreIndex: 1 },
  { daysAgo: 28, amount: 5400, type: "fixed", memo: "携帯電話料金", genreIndex: 3 },
  { daysAgo: 35, amount: 7200, type: "fixed", memo: "電気代", genreIndex: 3 },
  { daysAgo: 42, amount: 5100, type: "variable", memo: "スーパーで食料品", genreIndex: 0 },
  { daysAgo: 50, amount: 1600, type: "variable", memo: "カフェ", genreIndex: 0 },
  { daysAgo: 60, amount: 3200, type: "variable", memo: "日用品の買い足し", genreIndex: 1 },
  { daysAgo: 75, amount: 6800, type: "fixed", memo: "ガス代", genreIndex: 3 },
  { daysAgo: 90, amount: 4600, type: "variable", memo: "食料品のまとめ買い", genreIndex: 0 },
  { daysAgo: 110, amount: 1200, type: "variable", memo: "バス・電車代", genreIndex: 2 },
  { daysAgo: 135, amount: 2500, type: "variable", memo: "外食", genreIndex: 0 },
  { daysAgo: 160, amount: 5600, type: "fixed", memo: "携帯電話料金", genreIndex: 3 },
  { daysAgo: 190, amount: 4100, type: "variable", memo: "スーパーで食料品", genreIndex: 0 },
  { daysAgo: 220, amount: 2800, type: "variable", memo: "洗剤・キッチン用品", genreIndex: 1 },
  { daysAgo: 250, amount: 7400, type: "fixed", memo: "電気・ガス代", genreIndex: 3 },
  { daysAgo: 285, amount: 1800, type: "variable", memo: "昼食・軽食", genreIndex: 0 },
  { daysAgo: 320, amount: 3600, type: "variable", memo: "スーパーで食料品", genreIndex: 0 },
  { daysAgo: 350, amount: 980, type: "variable", memo: "電車代", genreIndex: 2 },
];

/** 1年より前の支出（全期間グラフ用） */
const ALL_TIME_ONLY_EXPENSES: SeedExpense[] = [
  { daysAgo: 410, amount: 4500, type: "variable", memo: "スーパーで食料品", genreIndex: 0 },
  { daysAgo: 470, amount: 2600, type: "variable", memo: "日用品の購入", genreIndex: 1 },
  { daysAgo: 530, amount: 1400, type: "variable", memo: "電車代", genreIndex: 2 },
  { daysAgo: 600, amount: 6800, type: "fixed", memo: "携帯電話料金", genreIndex: 3 },
  { daysAgo: 680, amount: 5200, type: "variable", memo: "外食", genreIndex: 0 },
  { daysAgo: 760, amount: 6900, type: "fixed", memo: "電気代", genreIndex: 3 },
];

async function seedGenres(): Promise<void> {
  const genreCount = await db.genres.count();

  if (genreCount > 0) {
    return;
  }

  await db.genres.bulkAdd(DEFAULT_GENRES.map((name) => ({ name })));
}

function toKakeiboItems(
  expenses: SeedExpense[],
  genreIds: number[],
): NewKakeiboItem[] {
  return expenses.map((expense) => ({
    date: shiftDays(expense.daysAgo),
    amount: expense.amount,
    type: expense.type,
    memo: expense.memo,
    genre_id: genreIds[expense.genreIndex],
  }));
}

async function seedSampleExpenses(): Promise<void> {
  const currentSeed = await db.settings.get("seedVersion");

  // 同じバージョンのサンプルデータが投入済みなら何もしない
  if (currentSeed?.value === SAMPLE_DATA_VERSION) {
    return;
  }

  const genres = await db.genres.toArray();
  const genreIds = genres.map((genre) => genre.id!);

  const sampleExpenses = [
    ...toKakeiboItems(PAST_YEAR_EXPENSES, genreIds),
    ...toKakeiboItems(ALL_TIME_ONLY_EXPENSES, genreIds),
  ];

  // 初回の入れ替えは、支出テーブルだけを対象にする
  await db.transaction("rw", db.kakeibo, db.settings, async () => {
    await db.kakeibo.clear();
    await db.kakeibo.bulkAdd(sampleExpenses);
    await db.settings.put({
      key: "seedVersion",
      value: SAMPLE_DATA_VERSION,
    });
  });
}

export async function initializeKakeiboData(): Promise<void> {
  await seedGenres();
  await seedSampleExpenses();
}