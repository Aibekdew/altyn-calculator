import axios, { AxiosError, AxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
});

/* ───── 1. access → Authorization ───── */
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("access");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

/* ───── 2. refresh по 401 ───────────── */
api.interceptors.response.use(
  (r) => r,
  async (err: AxiosError) => {
    if (!err.config) return Promise.reject(err);

    const original = err.config as AxiosRequestConfig & { _retry?: boolean };

    if (
      err.response?.status === 401 &&
      !original._retry &&
      localStorage.getItem("refresh")
    ) {
      original._retry = true;

      try {
        const { data } = await axios.post(`${API_URL}auth/refresh/`, {
          refresh: localStorage.getItem("refresh"),
        });

        localStorage.setItem("access", data.access);
        api.defaults.headers.common.Authorization = `Bearer ${data.access}`;
        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${data.access}`,
        };
        return api.request(original);
      } catch {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      }
    }
    return Promise.reject(err);
  }
);

export default api;
