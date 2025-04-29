"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// пример, если baseQueryWithReauth.ts находится уровнем выше

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery(),
  tagTypes: ["Rooms", "Booking"],
  endpoints: () => ({}),
});

export default api;
