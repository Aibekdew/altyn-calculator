/* ------------------------------------------------------------------
 * src/redux/api/index.ts          (единственная точка RTK-Query)
 * ------------------------------------------------------------------ */
"use client";

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseQueryWithAxios";

/* ────────────────── типы ────────────────── */
export interface HistoryItem {
  id: number;
  created: string;                                // «15.06.2025 10:24:50»
  action: "LOGIN" | "UPDATE_PROF" | "PRINT_CALC"; // сервер отдаёт именно так
  message: string;
  user_full_name: string;
}

export interface HistoryResponse {
  results: HistoryItem[];
  count: number;
  next: string | null;
  previous: string | null;
}

/* параметры, которые мы шлём в query-string */
export interface HistoryRequestParams {
  page?: number;
  search?: string;
  date_after?: string;
  date_before?: string;
  user?: "all";                // ← нужно только администратору
}

/* ────────────────── API ────────────────── */
export const api = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["LandHC2", "History"],
  endpoints: (builder) => ({
    /* ---------- HISTORY ---------- */
    getHistory: builder.query<HistoryResponse, HistoryRequestParams>({
      query: (params) => ({
        url: "history/",
        params,
      }),
      providesTags: ["History"],
    }),

    /* ---------- LOG «Печать» ---------- */
    addPrintLog: builder.mutation<
      { ok: boolean },
      { description?: string; total?: number }
    >({
      query: (body) => ({
        url: "print-log/",
        method: "POST",
        data: body,
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

/* готовые хуки ----------------------------------------------------- */
export const {
  useGetHistoryQuery,
  useAddPrintLogMutation,
  useGetLandHC2Query,
  useUpdateLandHC2Mutation,
} = api;
