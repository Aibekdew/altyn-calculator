// src/hooks/useAuth.ts
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import api from "@/utils/api";
import { api as reduxApi } from "@/redux/api";

interface ProfileData {
  role: string;
  patronymic: string;
  default_land_hc2: string; // если вам всё ещё нужен этот параметр
}

export interface CurrentUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  profile: ProfileData;
}

export default function useAuth() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/login");
      setLoading(false);
      return;
    }
    api
      .get<CurrentUser>("/auth/me/")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router, dispatch]);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    dispatch(reduxApi.util.resetApiState());
    router.push("/login");
  };

  return { user, loading, logout };
}
