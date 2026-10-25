"use client";

import { ExpenseForm } from "@/features/kakeibo/components/expense-form";
import { useGenres } from "@/features/kakeibo/hooks/use-genres";
import { useKakeiboInit } from "@/features/kakeibo/hooks/use-kakeibo-init";

export function ExpenseRegisterPage() {
  useKakeiboInit();

  const genres = useGenres();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">支出登録</h1>
        <p className="mt-1 text-sm text-gray-500">
          日付・金額・ジャンル・種別・メモを入力して支出を登録します。
        </p>
      </header>

      <ExpenseForm genres={genres} />
    </div>
  );
}
