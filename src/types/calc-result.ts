/** Единый тип, чтобы импортировать без циклических зависимостей */
export interface CalcRow {
  label: string;
  value: string;
}

export interface CalcResult {
  rent: number;       // арендная плата за помещение
  landTax: number;    // земельный налог (Az)
  total: number;      // rent + landTax
  ndsValue: number;   // сумма НДС
  nspValue: number;   // сумма НСП
  grandTotal: number; // финал (всё включено)
  rows: CalcRow[];
}
