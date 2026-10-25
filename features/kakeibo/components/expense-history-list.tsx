"use client";

import { useState } from "react";

import { EXPENSE_TYPE_LABELS } from "@/features/kakeibo/constants";
import {
  deleteKakeiboItem,
  updateKakeiboItem,
} from "@/features/kakeibo/lib/repository";
import type {
  ExpenseType,
  Genre,
  KakeiboItem,
} from "@/features/kakeibo/types";
import {
  formatAmount,
  formatExpenseType,
} from "@/features/kakeibo/utils/format";

interface ExpenseHistoryListProps {
  title?: string;
  genre: Genre | undefined;
  genres: Genre[];
  items: KakeiboItem[];
}

export function ExpenseHistoryList({
  title,
  genre,
  genres,
  items,
}: ExpenseHistoryListProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [genreId, setGenreId] = useState("");
  const [type, setType] = useState<ExpenseType>("variable");
  const [memo, setMemo] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!genre) {
    return null;
  }

  const heading = title ?? `${genre.name} の履歴`;

  const startEditing = (item: KakeiboItem) => {
    if (item.id === undefined) {
      setErrorMessage("編集する支出のIDが見つかりません。");
      return;
    }

    setErrorMessage("");
    setEditingId(item.id);
    setDate(item.date);
    setAmount(String(item.amount));
    setGenreId(String(item.genre_id));
    setType(item.type);
    setMemo(item.memo);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setErrorMessage("");
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingId === null) {
      return;
    }

    setErrorMessage("");
    setIsSaving(true);

    try {
      await updateKakeiboItem(editingId, {
        date,
        amount: Number(amount),
        genre_id: Number(genreId),
        type,
        memo,
      });

      setEditingId(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "更新に失敗しました。もう一度お試しください。",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: KakeiboItem) => {
    if (item.id === undefined) {
      setErrorMessage("削除する支出のIDが見つかりません。");
      return;
    }

    const confirmed = window.confirm(
      `${item.date} の ${formatAmount(item.amount)} を削除しますか？`,
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage("");

    try {
      await deleteKakeiboItem(item.id);

      if (editingId === item.id) {
        setEditingId(null);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "削除に失敗しました。もう一度お試しください。",
      );
    }
  };

  return (
    <section className="rounded-lg bg-gray-100 p-6">
      <h2 className="mb-4 text-lg font-semibold">{heading}</h2>

      {errorMessage && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">
          このジャンルの支出はありません。
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-md bg-white px-4 py-3 text-sm shadow-sm"
            >
              {editingId === item.id ? (
                <form onSubmit={handleUpdate} className="grid gap-3">
                  <label className="flex flex-col gap-1">
                    <span className="font-medium text-gray-700">日付</span>
                    <input
                      type="date"
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      className="rounded-md border border-gray-300 px-3 py-2"
                      required
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="font-medium text-gray-700">金額</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      className="rounded-md border border-gray-300 px-3 py-2"
                      min={1}
                      step={1}
                      required
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="font-medium text-gray-700">ジャンル</span>
                    <select
                      value={genreId}
                      onChange={(event) => setGenreId(event.target.value)}
                      className="rounded-md border border-gray-300 px-3 py-2"
                      required
                    >
                      <option value="">ジャンル選択</option>
                      {genres.map((entry) => (
                        <option key={entry.id} value={entry.id}>
                          {entry.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="font-medium text-gray-700">種別</span>
                    <select
                      value={type}
                      onChange={(event) =>
                        setType(event.target.value as ExpenseType)
                      }
                      className="rounded-md border border-gray-300 px-3 py-2"
                    >
                      {Object.entries(EXPENSE_TYPE_LABELS).map(
                        ([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ),
                      )}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="font-medium text-gray-700">メモ</span>
                    <input
                      type="text"
                      value={memo}
                      onChange={(event) => setMemo(event.target.value)}
                      className="rounded-md border border-gray-300 px-3 py-2"
                    />
                  </label>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="rounded-md bg-gray-900 px-3 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
                    >
                      {isSaving ? "更新中..." : "更新"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={isSaving}
                      className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
                    >
                      キャンセル
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="font-medium">{item.date}</span>
                    {": "}
                    {formatAmount(item.amount)}
                    {" ["}
                    {formatExpenseType(item.type)}
                    {"]"}
                    {item.memo ? ` (${item.memo})` : ""}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEditing(item)}
                      className="rounded-md border border-gray-300 px-3 py-1.5 hover:bg-gray-50"
                    >
                      編集
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="rounded-md border border-red-300 px-3 py-1.5 text-red-600 hover:bg-red-50"
                    >
                      削除
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}