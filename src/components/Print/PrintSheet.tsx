/* ------------------------------------------------------------------
 * components/Print/PrintSheet.tsx
 * Отрисовывается только в режиме печати (`print:block`).
 * Шрифт по-умолчанию — 14 pt, поэтому Word «схватывает» размеры один-к-одному.
 * ------------------------------------------------------------------ */

"use client";
import React from "react";
import { usePrintData } from "@/providers/PrintProvider";
import { AFFILIATE_OPTIONS } from "../pages/HomePage/Welcome";
import useAuth from "@/hooks/useAuth";           // ★ NEW

const PrintSheet: React.FC = () => {
  const { data } = usePrintData();
  const { user }  = useAuth();                  // ★ NEW

  if (!data) return null;

  /* ——— название филиала (может быть пустым) ——— */
  const affiliateLabel =
    data.affiliate &&
    (AFFILIATE_OPTIONS.find(o => o.value === data.affiliate)?.label ??
      data.affiliate);
  const execLast  = user?.last_name?.trim()        || "";
  const execFirst = user?.first_name?.trim()       || "";
  const execPatr  = user?.profile?.patronymic?.trim() || "";

  const executorLabel = execLast
    ? `${execLast} ${execFirst.charAt(0).toUpperCase()}. ${execPatr.charAt(0).toUpperCase()}.`
    : "____________________________";
  return (
    <div
      id="print-area"
      /* 170 mm =  480 pt  — остаётся 20 mm по краям A4 (210 mm)   */
      className="
        hidden print:block
        w-[170mm] mx-auto
        font-[14pt] leading-tight
         text-[14px]          /* верхний отступ почти нулевой */
      "
    >
      {/* ─────────── Описание объекта ─────────── */}
      {data.description && (
        <p className="whitespace-pre-wrap text-center mb-4 text-[14px] ">
          {data.description}
        </p>
      )}

      {/* ─────────── Название филиала ─────────── */}
      {affiliateLabel && (
        <p className="text-center font-medium mb-2 text-[14px] ">{affiliateLabel}</p>
      )}

      {/* ─────────── Заголовки ─────────── */}
      <h1 className="text-center  font-bold uppercase tracking-wide mb-1 text-[14px] ">
        расчёт арендной платы
      </h1>
      <p className="text-center font-semibold mb-6 text-[14px] ">
        Итоговая стоимость:&nbsp;
        {data.finalTotal.toLocaleString("ru-RU", { maximumFractionDigits: 2 })}
        &nbsp;сом&nbsp;/ месяц
      </p>

      {/* ─────────── Таблица результатов ─────────── */}
      <table className="w-full border border-black border-collapse text-[14px] ">
        <thead>
          <tr className="bg-[#003680] text-white text-[14px] ">
            <th className="w-[65%] text-left font-semibold p-2 text-[14px] ">Показатель</th>
            <th className="text-right font-semibold p-2 text-[14px] ">Значение</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((r, i) => (
            <tr key={i} className={i % 2 ? "bg-gray-50" : "bg-white"}>
              <td className="p-2 align-top text-[14px] ">{r.label}</td>
              <td className="p-2 text-right whitespace-nowrap text-[14px] ">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ─────────── Подписи ─────────── */}
        <div className="flex justify-between mt-10">
        {/* --- Исполнитель --- */}
        <div>
          <p>Исполнитель:&nbsp;{executorLabel}</p>
          <p className="mt-2">Подпись: ______________</p>
        </div>

        {/* --- Утверждаю --- */}
        <div>
          <p>Утверждаю:&nbsp;Мусаева&nbsp;М.&nbsp;Э.</p>
          <p className="mt-2">Подпись: ______________</p>
        </div>
      </div>
    </div>
  );
};

export default PrintSheet;
