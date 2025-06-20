/* ------------------------------------------------------------------
 * components/Print/PrintSheet.tsx
 * Печать үчүн даяр барак.
 * ------------------------------------------------------------------ */

"use client";
import React from "react";
import { usePrintData } from "@/providers/PrintProvider";
import { AFFILIATE_OPTIONS } from "../pages/HomePage/Welcome";
import useAuth from "@/hooks/useAuth";
import { useGetPrintSettingsQuery } from "@/redux/api";

const PrintSheet: React.FC = () => {
  const { data } = usePrintData();
  const { user } = useAuth();
  const { data: ps } = useGetPrintSettingsQuery(); // ← подписи

  if (!data) return null;

  /* ────────── Филиал ────────── */
  const affiliateLabel =
    data.affiliate &&
    (AFFILIATE_OPTIONS.find((o) => o.value === data.affiliate)?.label ??
      data.affiliate);

  /* ────────── Описание объекта (обрезаем «расположенным по адресу …») ────────── */
  const rawDescription = data.description ?? "";
  const description = rawDescription
    .replace(/,\s*располож.*$/i, "") // убираем хвост с адресом
    .trim();

  /* ────────── Исполнитель ────────── */
  const execLast = user?.last_name?.trim() || "";
  const execFirst = user?.first_name?.trim() || "";
  const execPatr = user?.profile?.patronymic?.trim() || "";

  const executorLabel = execLast
    ? `${execLast} ${execFirst.charAt(0).toUpperCase()}. ${execPatr
        .charAt(0)
        .toUpperCase()}.`
    : "____________________________";

  return (
    <div
      id="print-area"
      className="
        hidden print:block
        w-[170mm] mx-auto
        font-[14pt] leading-tight text-[14px]
      "
    >
      {/* ─────────── Описание ─────────── */}
      {description && (
        <p className="whitespace-pre-wrap text-center text-[14px] font-bold mb-4">
          {description}
        </p>
      )}

      {/* ─────────── Название филиала ─────────── */}
      {affiliateLabel && (
        <p className="text-center text-[14px] font-medium mb-2">
          {affiliateLabel}
        </p>
      )}

      {/* ─────────── Заголовок и итог ─────────── */}
      <h1 className="text-center  font-bold uppercase tracking-wide mb-1 text-[14px] ">
        расчёт арендной платы
      </h1>
      <p className="text-center font-semibold mb-6 text-[14px] ">
        Итоговая стоимость:&nbsp;
        {data.finalTotal.toLocaleString("ru-RU", {
          maximumFractionDigits: 2,
        })}
        &nbsp;сом&nbsp;/ месяц
      </p>

      {/* ─────────── Таблица ─────────── */}
      <table className="w-full border border-black border-collapse">
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

      {/* ─────────── Подписи ─────────── */}
      <div className="flex font-bold justify-between mt-10 items-center">
        <div>
          <p className="mb-[-1px]">{ps?.left_title ?? "Начальник УЭАиП"}</p>
          <p>{ps?.left_subtitle ?? "ОАО «Кыргызалтын»"}</p>
        </div>
        <div>
          <p>{ps?.right_executor ?? "Мусаева Э. М."}</p>
        </div>
      </div>
    </div>
  );
};

export default PrintSheet;
