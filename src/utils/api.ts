// src/utils/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// перед каждым запросом добавляем токен из localStorage
api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;
  const token = localStorage.getItem("access");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
