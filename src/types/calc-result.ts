/** Одна – единая – версия интерфейса для всего проекта */
export interface CalcRow {
  label: string;
  value: string;
}

export interface CalcResult {
  rent: number;
  landTax: number;
  total: number;
  ndsValue: number;
  nspValue: number;
  grandTotal: number;
  rows: CalcRow[];
  finalTotal: number; // ← ДОБАВИЛИ!

  affiliate?: string; // выбранный филиал
  description?: string; // произвольный текст (адрес-описание)
}
