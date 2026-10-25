import Dexie, { type Table } from "dexie";

import { DB_NAME, DB_VERSION } from "@/features/kakeibo/constants";
import type { AppSetting, Genre, KakeiboItem } from "@/features/kakeibo/types";

export class KakeiboDatabase extends Dexie {
  kakeibo!: Table<KakeiboItem>;
  genres!: Table<Genre>;
  settings!: Table<AppSetting, string>;

  constructor() {
    super(DB_NAME);
    this.version(2).stores({
      kakeibo: "++id, date, genre_id, type",
      genres: "++id, name",
    });
    this.version(DB_VERSION).stores({
      kakeibo: "++id, date, genre_id, type",
      genres: "++id, name",
      settings: "key",
    });
  }
}

export const db = new KakeiboDatabase();
