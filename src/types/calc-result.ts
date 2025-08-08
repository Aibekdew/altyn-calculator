/** Одна – единая – версия интерфейса для всего проекта */
export interface CalcRow {
  label: string;
  value: string;
}

export interface CalcResult {
  rent: number;
  landTax: number;
  propertyTax: number;
  ndsValue: number;
  nspValue: number;
  grandTotal: number;
  perSq: number; // ← новое
  finalTotal: number;
  rows: CalcRow[];
  affiliate?: string;
  description?: string;
  total: number;
}
