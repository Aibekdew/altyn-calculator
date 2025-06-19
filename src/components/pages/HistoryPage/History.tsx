/* ------------------------------------------------------------------
 * HISTORY PAGE  (debounced global search + animated loader)
 * ------------------------------------------------------------------ */
"use client";

import React, { useState, useEffect } from "react";
import {
  Loader2,
  LogIn,
  Printer,
  UserCog,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import Header                 from "@/components/layout/Header/Header";
import { useGetHistoryQuery } from "@/redux/api";
import useAuth                from "@/hooks/useAuth";

/* -------------------------------------------------------------
 * 1.  Вспомогательный debounce-хук
 * ------------------------------------------------------------- */
function useDebounce<T>(value: T, ms = 400) {
  const [d, setD] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setD(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return d;
}

/* -------------------------------------------------------------
 * 2.  Оформление и константы
 * ------------------------------------------------------------- */
const bgGradient =
  "bg-gradient-to-br from-[#edf3ff] via-[#eff2fb] to-[#f4f4ff] bg-fixed";

const card =
  "bg-white/90 backdrop-blur-lg shadow-xl ring-1 ring-black/5 rounded-3xl";

const ACTION_META = {
  LOGIN: {
    icon : <LogIn    size={16} />,
    bg   : "bg-emerald-100",
    fg   : "text-emerald-600",
    label: "Вход в систему",
  },
  PRINT_CALC: {
    icon : <Printer  size={16} />,
    bg   : "bg-indigo-100",
    fg   : "text-indigo-600",
    label: "Печать расчёта",
  },
  UPDATE_PROF: {
    icon : <UserCog  size={16} />,
    bg   : "bg-amber-100",
    fg   : "text-amber-600",
    label: "Изменение профиля",
  },
} as const;

/* -------------------------------------------------------------
 * 3.  Компонент
 * ------------------------------------------------------------- */
const HistoryPage: React.FC = () => {
  /* --- поля фильтра --- */
  const [query , setQuery]  = useState("");
  const [dateA , setDateA]  = useState("");
  const [dateB , setDateB]  = useState("");
  const [page  , setPage]   = useState(1);

  /* --- debounce, чтобы запрос уходил не каждую букву --- */
  const search = useDebounce(query.trim(), 400);

  /* --- права пользователя --- */
  const { user } = useAuth();
  const isAdmin  = user?.profile.role === "ADMIN";

  /* --- загрузка данных --- */
  const { data, isFetching, isLoading } = useGetHistoryQuery(
    {
      page,
      search      : search || undefined,
      date_after  : dateA  || undefined,
      date_before : dateB  || undefined,
      ...(isAdmin ? { user: "all" } : {}),
    },
    { refetchOnMountOrArgChange: true }
  );

  const pageCount = data ? Math.ceil(data.count / 10) : 1;
  const pages     = Array.from({ length: pageCount }, (_, i) => i + 1);

  /* --- при новом поиске возвращаемся на 1-ю страницу --- */
  useEffect(() => setPage(1), [search, dateA, dateB]);

  /* --- утилитарные cls --- */
  const input =
    "h-10 px-4 rounded-xl border border-gray-300 bg-white focus:ring-2 " +
    "focus:ring-blue-400/40 focus:border-blue-400 outline-none  ";

  /* --------------------------------------------------------- */
  interface ExpandableTextProps {
  text: string;
  maxLength?: number;          // сколько символов показывать, прежде чем обрезать
}
const ExpandableText: React.FC<ExpandableTextProps> = ({
  text,
  maxLength = 80,
}) => {
  const [expanded, setExpanded] = useState(false);
  if (text.length <= maxLength) return <span>{text}</span>;

  return (
    <span>
      {expanded ? text : text.slice(0, maxLength) + "…"}{" "}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-blue-600 hover:underline focus:outline-none"
      >
        {expanded ? "Свернуть" : "Развернуть"}
      </button>
    </span>
  );
};
  return (
    <>
      <Header />

      <section className={`min-h-screen ${bgGradient} py-10 px-4`}>
        <div className={`max-w-7xl mx-auto p-8 ${card} space-y-6`}>

          {/* ─── ФИЛЬТРЫ ─── */}
          <div className="flex flex-wrap gap-3">
            <input
              placeholder="Поиск по журналу…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`${input} flex-1 min-w-[12rem]`}
            />
            <input type="date" value={dateA} onChange={(e) => setDateA(e.target.value)} className={input} />
            <input type="date" value={dateB} onChange={(e) => setDateB(e.target.value)} className={input} />
            <button
              onClick={() => { setQuery(""); setDateA(""); setDateB(""); }}
              className="h-10 px-6 rounded-xl bg-gray-100 hover:bg-gray-200 transition font-medium"
            >
              Очистить
            </button>
          </div>

          {/* ─── ТАБЛИЦА ─── */}
          <div className="relative">
            {/* плавный, полупрозрачный loader поверх таблицы ------------- */}
            <AnimatePresence>
              {(isFetching && !isLoading) && (
                <motion.div
                  key="overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center
                             backdrop-blur-[2px] bg-white/70 rounded-2xl z-10"
                >
                  {/* анимированный спиннер */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                    className="p-2 rounded-full border-4 border-dashed border-blue-500/40 h-12 w-12"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="overflow-auto rounded-2xl ring-1 ring-gray-200">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
                  <tr>
                    <th className="w-12 py-3"></th>
                    <th className="px-4 py-3">Событие</th>
                    <th className="px-4 py-3">Дата / время</th>
                    <th className="px-4 py-3 whitespace-nowrap">Пользователь</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    /* первичная загрузка – крупный спиннер */
                    <tr>
                      <td colSpan={4} className="py-16 text-center">
                        <Loader2 className="animate-spin inline mr-2" />
                        Загружаем журнал…
                      </td>
                    </tr>
 ) : data && data.results.length ? (
    data.results.map((r) => {
      const m = ACTION_META[r.action as keyof typeof ACTION_META];
      return (
        <tr key={r.id} className="odd:bg-white even:bg-gray-50">
          <td className="pl-6 pr-2 py-3">
            {/* ... иконка */}
          </td>
          <td className="px-4 py-3">
            <div className="font-medium text-gray-900">{m.label}</div>
            {/* здесь заменяем line-clamp на ExpandableText */}
            <div className="text-gray-500 text-sm">
              <ExpandableText text={r.message} maxLength={60} />
            </div>
          </td>
          <td className="px-4 py-3 font-mono text-gray-700">{r.created}</td>
          <td className="px-4 py-3">{r.user_full_name}</td>
        </tr>
      );
    })
  ) : (
                    <tr>
                      <td colSpan={4} className="py-14 text-center text-gray-500">
                        Записей нет
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ─── ПАГИНАЦИЯ ─── */}
          {pageCount > 1 && (
            <div className="flex justify-center gap-2 select-none">
              <Page onClick={() => setPage((p) => p - 1)} disabled={page === 1}>◂</Page>
              {pages.map((p) =>
                Math.abs(page - p) <= 2 || p === 1 || p === pageCount ? (
                  <Page key={p} onClick={() => setPage(p)} active={p === page}>{p}</Page>
                ) : p === page - 3 || p === page + 3 ? (
                  <span key={p} className="px-1 text-gray-400">…</span>
                ) : null
              )}
              <Page onClick={() => setPage((p) => p + 1)} disabled={page === pageCount}>▸</Page>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

/* ––– маленькая кнопка страниц ––– */
const Page: React.FC<
  React.PropsWithChildren<{ onClick?: () => void; disabled?: boolean; active?: boolean }>
> = ({ children, onClick, disabled, active }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-9 h-9 rounded-lg border text-sm transition
      ${active ? "bg-blue-600 text-white" : "hover:bg-gray-100"}
      disabled:opacity-40`}
  >
    {children}
  </button>
);

export default HistoryPage;
