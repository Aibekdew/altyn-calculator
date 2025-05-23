import axios, { AxiosError, AxiosRequestConfig } from "axios";

/* ———————————————————————————————————— */
/* 1. инстанс                                                            */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/",
  timeout: 10_000,
});

/* ———————————————————————————————————— */
/* 2. подставляем access-токен в каждый запрос                            */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ———————————————————————————————————— */
/* 3. перехват 401 и автоматический refresh                                */
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    /* если у ошибки нет config — отдаём дальше */
    if (!error.config) return Promise.reject(error);

    /* приводим к расширенному типу, чтобы было _retry */
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (
      error.response?.status === 401 &&
      !original._retry &&
      localStorage.getItem("refresh")
    ) {
      original._retry = true; // ставим флаг, чтобы второй раз не заходить

      try {
        /* — refresh токена — */
        const { data } = await axios.post(
          `${api.defaults.baseURL}auth/refresh/`,
          { refresh: localStorage.getItem("refresh") }
        );

        /* сохраняем новый access и пробуем исходный запрос заново */
        localStorage.setItem("access", data.access);
        api.defaults.headers.common.Authorization = `Bearer ${data.access}`;
        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${data.access}`,
        };

        /* обязательно вызываем api.request, а не api(original) */
        return api.request(original);
      } catch {
        /* refresh неудачный — чистим всё */
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      }
    }

    /* все прочие ошибки прокидываем дальше */
    return Promise.reject(error);
  }
);

export default api;
