import type { Genre, KakeiboItem, NewKakeiboItem } from "@/features/kakeibo/types";

import { db } from "./db";
import { initializeKakeiboData } from "./seed";

function validateKakeiboItem(item: NewKakeiboItem): void {
  if (!Number.isSafeInteger(item.amount) || item.amount <= 0) {
    throw new Error("金額は1以上の整数で入力してください。");
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date)) {
    throw new Error("日付は正しい形式で入力してください。");
  }

  const [year, month, day] = item.date.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error("実在する日付を入力してください。");
  }

  if (!Number.isSafeInteger(item.genre_id) || item.genre_id <= 0) {
    throw new Error("ジャンルを選択してください。");
  }

  if (item.type !== "variable" && item.type !== "fixed") {
    throw new Error("支出の種別が正しくありません。");
  }

  if (typeof item.memo !== "string") {
    throw new Error("メモは文字列で入力してください。");
  }
}

async function validateGenreExists(genreId: number): Promise<void> {
  const genre = await db.genres.get(genreId);

  if (!genre) {
    throw new Error("選択したジャンルが見つかりません。");
  }
}

export async function ensureKakeiboInitialized(): Promise<void> {
  await initializeKakeiboData();
}

export async function getAllGenres(): Promise<Genre[]> {
  return db.genres.toArray();
}

export async function getAllKakeiboItems(): Promise<KakeiboItem[]> {
  return db.kakeibo.toArray();
}

export async function addKakeiboItem(item: NewKakeiboItem): Promise<number> {
  validateKakeiboItem(item);
  await validateGenreExists(item.genre_id);

  return db.kakeibo.add(item);
}

export async function updateKakeiboItem(
  id: number,
  item: NewKakeiboItem,
): Promise<void> {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("更新する支出のIDが正しくありません。");
  }

  validateKakeiboItem(item);
  await validateGenreExists(item.genre_id);

  const updatedCount = await db.kakeibo.update(id, item);

  if (updatedCount === 0) {
    throw new Error("更新する支出が見つかりません。");
  }
}

export async function deleteKakeiboItem(id: number): Promise<void> {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("削除する支出のIDが正しくありません。");
  }

  const existingItem = await db.kakeibo.get(id);

  if (!existingItem) {
    throw new Error("削除する支出が見つかりません。");
  }

  await db.kakeibo.delete(id);
}

export async function getKakeiboItemsByGenre(
  genreId: number,
): Promise<KakeiboItem[]> {
  return db.kakeibo.where("genre_id").equals(genreId).toArray();
}