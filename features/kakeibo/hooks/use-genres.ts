"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { db } from "@/features/kakeibo/lib/db";

export function useGenres() {
  return useLiveQuery(() => db.genres.toArray(), []) ?? [];
}
