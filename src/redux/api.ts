"use client";
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./baseQueryWithAxios";

export const api = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),   // 👈  заменили fetchBaseQuery
  tagTypes: ["LandHC2"],
  endpoints: (builder) => ({
    /*  --------  profile/land-hc2  -------- */
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

/* 👉 хуки */
export const {
  useGetLandHC2Query,
  useUpdateLandHC2Mutation,
} = api;
