/* ------------------------------------------------------------------
 * src/redux/api/index.ts
 * Единственная точка подключения RTK-Query во всём проекте
 * ------------------------------------------------------------------ */
"use client";

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseQueryWithAxios";

/* ──────────────────────────────────────────────────────────────
   Типы данных
   ────────────────────────────────────────────────────────────── */
export interface HistoryItem {
  id: number;
  created: string;        // «15.06.2025 10:24:50»
  action: "LOGIN" | "UPDATE" | "PRINT";
  message: string;
  user_full_name: string;
}

export interface HistoryResponse {
  results: HistoryItem[];
  count: number;
  next: string | null;
  previous: string | null;
}

/* ──────────────────────────────────────────────────────────────
   API
   ────────────────────────────────────────────────────────────── */
export const api = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),          // наш кастомный axios-baseQuery
  // NB: обязательно указываем ВСЕ tagTypes, которые используем дальше
  tagTypes: ["LandHC2", "History"],
  endpoints: (builder) => ({
    /* ---------- HISTORY ---------- */
    getHistory: builder.query<
      HistoryResponse,
      { page?: number; search?: string; date_after?: string; date_before?: string }
    >({
      query: (params) => ({
        url: "history/",
        params,                      // ?page=…&search=…&date_after=…
      }),
      providesTags: ["History"],
    }),

    /* логируем «Печать» вручную с фронта */
    addPrintLog: builder.mutation<{ ok: boolean }, void>({
      query: () => ({
        url: "print-log/",
        method: "POST",
      }),
      invalidatesTags: ["History"],
    }),

    /* ---------- PROFILE / land-hc2 ---------- */
    getLandHC2: builder.query<{ default_land_hc2: string }, void>({
      query: () => ({ url: "profile/land-hc2/" }),
      providesTags: ["LandHC2"],
    }),

    updateLandHC2: builder.mutation<
      { default_land_hc2: string },
      { default_land_hc2: string }
    >({
      query: (body) => ({
        url: "profile/land-hc2/",
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["LandHC2"],
    }),
  }),
});

/* ──────────────────────────────────────────────────────────────
   Экспорт готовых хуков
   ────────────────────────────────────────────────────────────── */
export const {
  /* History */
  useGetHistoryQuery,
  useAddPrintLogMutation,

  /* LandHC2 */
  useGetLandHC2Query,
  useUpdateLandHC2Mutation,
} = api;
