export type ExpenseType = "variable" | "fixed";

export interface KakeiboItem {
  id?: number;
  date: string;
  amount: number;
  genre_id: number;
  memo: string;
  type: ExpenseType;
}

export interface Genre {
  id?: number;
  name: string;
}

export interface ChartDataItem {
  id?: number;
  name: string;
  value: number;
}

export type NewKakeiboItem = Omit<KakeiboItem, "id">;

export interface AppSetting {
  key: string;
  value: number | string;
}
