/* ------------------------------------------------------------------
 * HISTORY PAGE (full-width layout)
 * ------------------------------------------------------------------ */
"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header/Header";
import { useGetHistoryQuery } from "@/redux/api";
import { Loader2 } from "lucide-react";

const bgGradient =
  "bg-gradient-to-br from-[#c9d6ff] via-[#e2e8f0]/60 to-[#c9d6ff] bg-cover bg-fixed";

const HistoryPage: React.FC = () => {
  const [search, setSearch]       = useState("");
  const [dateAfter, setDateAfter] = useState("");
  const [dateBefore, setDateBefore] = useState("");
  const [page, setPage]           = useState(1);

  const { data, isFetching } = useGetHistoryQuery(
    {
      page,
      search:      search      || undefined,
      date_after:  dateAfter   || undefined,
      date_before: dateBefore  || undefined,
    },
    { refetchOnMountOrArgChange: true }
  );

  const pageCount = data ? Math.ceil(data.count / 10) : 1;
  const pages     = Array.from({ length: pageCount }, (_, i) => i + 1);

  const resetFilters = () => {
    setSearch("");
    setDateAfter("");
    setDateBefore("");
    setPage(1);
  };

  return (
    <>
      <Header />

      <section className={`min-h-screen ${bgGradient} py-10 px-4`}>
        <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8">
          {/* ------------- фильтры ------------- */}
          <div className="flex flex-wrap gap-3 mb-6">
            <input
              placeholder="Поиск…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded w-full sm:w-auto flex-1"
            />
            <input
              type="date"
              value={dateAfter}
              onChange={(e) => setDateAfter(e.target.value)}
              className="px-4 py-2 border rounded"
            />
            <input
              type="date"
              value={dateBefore}
              onChange={(e) => setDateBefore(e.target.value)}
              className="px-4 py-2 border rounded"
            />
            <button
              onClick={resetFilters}
              className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Очистить
            </button>
          </div>

          {/* ------------- таблица ------------- */}
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full bg-white text-sm text-gray-800">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="w-12 p-3">
                    <input type="checkbox" disabled className="opacity-60" />
                  </th>
                  <th className="w-14 p-3 text-left">№</th>
                  <th className="w-44 p-3 text-left">Дата / время</th>
                  <th className="p-3 text-left">Описание</th>
                  <th className="w-56 p-3 text-left">ФИО</th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <tr>
                    <td colSpan={5} className="text-center p-10">
                      <Loader2 className="animate-spin inline-block mr-2" />
                      Загрузка…
                    </td>
                  </tr>
                ) : data && data.results.length ? (
                  data.results.map((row, idx) => (
                    <tr
                      key={row.id}
                      className={idx % 2 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="p-3 text-center">
                        <input type="checkbox" disabled />
                      </td>
                      <td className="p-3">{idx + 1 + (page - 1) * 10}</td>
                      <td className="p-3 whitespace-nowrap">{row.created}</td>
                      <td className="p-3">
                        <span className="font-semibold">
                          {row.action === "LOGIN"
                            ? "Вход"
                            : row.action === "UPDATE"
                            ? "Обновление"
                            : "Печать"}
                        </span>{" "}
                        {row.message}
                      </td>
                      <td className="p-3">{row.user_full_name}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-gray-500">
                      Записей нет
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ------------- пагинация ------------- */}
          {pageCount > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 select-none">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-40"
              >
                ◂
              </button>

              {pages.map((p) => {
                if (p === 1 || p === pageCount || (p >= page - 2 && p <= page + 2)) {
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 border rounded ${
                        p === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  );
                }
                if ((p === page - 3 && p > 1) || (p === page + 3 && p < pageCount)) {
                  return <span key={p} className="px-1">…</span>;
                }
                return null;
              })}

              <button
                onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
                disabled={page === pageCount}
                className="w-9 h-9 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-40"
              >
                ▸
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default HistoryPage;
