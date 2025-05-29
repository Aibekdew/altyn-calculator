"use client"
import type { AxiosRequestConfig, AxiosError } from "axios";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import api from "@/utils/api";

/**
 * Универсальный BaseQuery для RTK Query,
 * который использует ваш axios-инстанс с ре-фрешем.
 */
export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method = "get", data, params }) => {
    try {
      const res = await api({ url, method, data, params });
      return { data: res.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status || 500,
          data: err.response?.data || err.message,
        },
      };
    }
  };
