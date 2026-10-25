export interface GenreBreakdown {
  genreId: number;
  genreName: string;
  amount: number;
}

export interface MonthlySummary {
  yearMonth: string;
  total: number;
  variableTotal: number;
  fixedTotal: number;
  byGenre: GenreBreakdown[];
  itemCount: number;
}
