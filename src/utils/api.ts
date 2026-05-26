// src/utils/api.ts
"use client";

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
});

// Перед каждым запросом добавляем Authorization: Bearer <access>
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const access = localStorage.getItem("access");

    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
  }

  return config;
});

// Если получили 401, пробуем обновить access через refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    const refresh = localStorage.getItem("refresh");

    if (error.response?.status === 401 && !originalRequest._retry && refresh) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(`${API_URL}auth/refresh/`, {
          refresh,
        });

        localStorage.setItem("access", data.access);

        api.defaults.headers.common.Authorization = `Bearer ${data.access}`;
        originalRequest.headers.Authorization = `Bearer ${data.access}`;

        return api.request(originalRequest);
      } catch {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;