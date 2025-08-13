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
      w-[200mm] mx-auto
      text-[12px] leading-[1.25]
    "
    >
      {/* ─────────── Описание ─────────── */}
      {description && (
        <p className="whitespace-pre-wrap text-center mb-2">{description}</p>
      )}

      {/* ─────────── Название филиала ─────────── */}
      {affiliateLabel && (
        <p className="text-center font-medium mb-1">{affiliateLabel}</p>
      )}

      {/* ─────────── Заголовок и итог ─────────── */}
      <h1 className="text-center font-bold uppercase tracking-wide mb-1 text-[12px]">
        расчёт арендной платы
      </h1>
      <p className="text-center font-semibold mb-3">
        Итоговая стоимость:&nbsp;
        {data.finalTotal.toLocaleString("ru-RU", { maximumFractionDigits: 2 })}
        &nbsp;сом&nbsp;/ месяц
      </p>

      {/* ─────────── Таблица ─────────── */}
      <table className="w-full border border-black border-collapse">
        <thead>
          <tr className=" text-black">
            <th className="w-[65%] text-left font-semibold">Показатель</th>
            <th className="text-right font-semibold">Значение</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((r, i) => (
            <tr key={i} className={i % 2 ? "bg-gray-50" : "bg-white"}>
              <td className="align-top">{r.label}</td>
              <td className="text-right whitespace-nowrap">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ─────────── Подписи ─────────── */}
      <div className="signatures flex font-bold justify-between mt-6 items-center">
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
