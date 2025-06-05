"use client";
import React from "react";
import { usePrintData } from "@/providers/PrintProvider";

const PrintSheet: React.FC = () => {
  const { data } = usePrintData();
  if (!data) return null;                      // нет данных – ничего не выводим

  const today = new Date().toLocaleDateString("ru-RU", {
    day:   "2-digit",
    month: "2-digit",
    year:  "numeric",
  });

  return (
    /**
     * В обычном режиме блок скрыт, а при печати показывается.
     * Не меняйте id – он используется в CSS!
     */
  <div
    id="print-area"
    className="hidden print:block font-[11pt] leading-tight
               w-[170mm] mx-auto pt-[15mm] pb-[15mm]"
  >      {/* ───── Шапка ───── */}
      <div className="flex justify-between items-start mb-6">
        <img src="/ka_logo.png" alt="Кыргызалтын" className="h-16 object-contain" />
        <span className="text-sm">{today}</span>
      </div>

      {/* ───── Заголовок ───── */}
      <h1 className="text-center text-lg font-bold uppercase tracking-wide">
        расчёт арендной платы
      </h1>
      <p className="text-center text-base font-semibold mb-6">
        Итоговая стоимость:&nbsp;
        {data.grandTotal.toLocaleString("ru-RU", { maximumFractionDigits: 2 })}
        &nbsp;сом&nbsp;/ месяц
      </p>

      {/* ───── Таблица ───── */}
      <table className="w-full border border-black border-collapse text-[10.5pt]">
        <thead>
          <tr className="bg-[#003680] text-white">
            <th className="w-[65%] text-left font-semibold p-2">Показатель</th>
            <th className="text-right font-semibold p-2">Значение</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((r, i) => (
            <tr key={i} className={i % 2 ? "bg-gray-50" : "bg-white"}>
              <td className="p-2 align-top">{r.label}</td>
              <td className="p-2 text-right whitespace-nowrap">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ───── Подписи ───── */}
      <div className="flex justify-between mt-10 text-sm">
        <div>
          <p>Исполнитель: ____________________________</p>
          <p className="mt-2">Подпись: ______________</p>
        </div>
        <div className="text-right">
          <p>Утверждаю: ____________________________</p>
          <p className="mt-2">Дата: «____» __________ 20___ г.</p>
        </div>
      </div>
    </div>
  );
};

export default PrintSheet;
