"use client";
import React from "react";
import { usePrintData } from "@/providers/PrintProvider";

/**
 * Блок рендерится ТОЛЬКО в режиме печати
 * (на экране его не видно благодаря `hidden print:block`)
 */
const PrintSheet: React.FC = () => {
  const { data } = usePrintData();
  if (!data) return null; // ещё ничего не рассчитано — ничего не выводим

  /* Локальный формат даты без сторонних библиотек */
  const now = new Date().toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div
      id="print-area"
      className="hidden print:block font-[10pt] leading-tight text-black"
    >
      {/* ---------- Логотип + дата ---------- */}
      <header className="flex justify-between items-start mb-6">
        {/* логотип — замените src, если путь другой */}
        <img
          src="/ka_logo.png"
          alt="Логотип Кыргызалтын"
          className="h-14 object-contain"
        />

        {/* текущая дата */}
        <p className="text-xs">{now}</p>
      </header>

      {/* ---------- Заголовки ---------- */}
      <h1 className="text-center text-lg font-bold mb-1 uppercase tracking-wide">
        Расчёт арендной платы
      </h1>

      <h2 className="text-center text-base font-semibold mb-6">
        Итоговая стоимость:&nbsp;
        {data.grandTotal.toLocaleString("ru-RU", {
          maximumFractionDigits: 2,
        })}{" "}
        сом / мес.
      </h2>

      {/* ---------- Таблица результатов ---------- */}
      <table className="w-full border border-black border-collapse text-[10pt]">
        <thead>
          <tr className="bg-gray-200">
            <th className="w-[70%] text-left font-semibold p-2">Показатель</th>
            <th className="text-right font-semibold p-2">Значение</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((r, i) => (
            <tr key={i} className="odd:bg-white even:bg-gray-50">
              <td className="p-2 align-top">{r.label}</td>
              <td className="p-2 text-right">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------- Подписи ---------- */}
      <footer className="flex justify-between mt-10 text-xs">
        <div>
          <p>Исполнитель: ____________________________</p>
          <p className="mt-2">Подпись: ______________</p>
        </div>

        <div className="text-right">
          <p>Утверждаю: ____________________________</p>
          <p className="mt-2">Дата: «____» ____________ 20___ г.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrintSheet;
