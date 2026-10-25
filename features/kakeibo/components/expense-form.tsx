"use client";

import { useState } from "react";

import { EXPENSE_TYPE_LABELS } from "@/features/kakeibo/constants";
import { addKakeiboItem } from "@/features/kakeibo/lib/repository";
import type { ExpenseType, Genre } from "@/features/kakeibo/types";

interface ExpenseFormProps {
  genres: Genre[];
}

export function ExpenseForm({ genres }: ExpenseFormProps) {
  const [date, setDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });
  const [amount, setAmount] = useState("");
  const [genreId, setGenreId] = useState("");
  const [type, setType] = useState<ExpenseType>("variable");
  const [memo, setMemo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!amount || !genreId) {
      setErrorMessage("金額とジャンルを入力してください。");
      return;
    }

    try {
      await addKakeiboItem({
        date,
        amount: Number(amount),
        genre_id: Number(genreId),
        type,
        memo,
      });

      setAmount("");
      setMemo("");
      setSuccessMessage("支出を保存しました。");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "保存に失敗しました。もう一度お試しください。",
      );
    }
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">支出入力</h2>

      {errorMessage && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p role="status" className="mb-4 text-sm text-green-600">
          {successMessage}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">日付</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">金額</span>
          <input
            type="number"
            placeholder="金額"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2"
            min={1}
            step={1}
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">ジャンル</span>
          <select
            value={genreId}
            onChange={(event) => setGenreId(event.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="">ジャンル選択</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">種別</span>
          <select
            value={type}
            onChange={(event) => setType(event.target.value as ExpenseType)}
            className="rounded-md border border-gray-300 px-3 py-2"
          >
            {Object.entries(EXPENSE_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm sm:col-span-2 lg:col-span-1">
          <span className="font-medium text-gray-700">メモ</span>
          <input
            type="text"
            placeholder="メモ"
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2"
          />
        </label>

        <div className="flex items-end sm:col-span-2 lg:col-span-3">
          <button
            type="submit"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            保存
          </button>
        </div>
      </form>
    </section>
  );
}