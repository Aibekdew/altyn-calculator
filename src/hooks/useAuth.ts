// src/hooks/useAuth.ts
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import api from "@/utils/api";
import { api as reduxApi } from "@/redux/api";    // <-- импорт RTK Query slice

export default function useAuth() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/login");
      setLoading(false);
      return;
    }
    api
      .get("/auth/me/")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    // Сбрасываем кэш всех RTK Query-запросов
    dispatch(reduxApi.util.resetApiState());
    router.push("/login");
  };

  return { user, loading, logout };
}
