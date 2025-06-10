// src/components/LoginPage/LogIn.tsx
"use client";

import React, { FC, useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import scss from "./LogIn.module.scss";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import api from "@/utils/api";

const LogIn: FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  // если уже есть токен и /me возвращает 200 — сразу на /home
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      api
        .get("/auth/me/")
        .then(() => router.replace("/home"))
        .catch(() => {});
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Введите логин и пароль");
      return;
    }
    try {
      // 1) получаем пару { access, refresh }
      const res = await api.post("/auth/login/", { username, password });
      const { access, refresh } = res.data;
      // 2) сохраняем в localStorage
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      // 3) проверяем /me — если OK, редиректим
      await api.get("/auth/me/");
      router.push("/home");
    } catch {
      setError("Неверный логин или пароль");
    }
  };

  // 3D-эффекты (как у вас было)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [bgOffset, setBgOffset] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (box.left + box.width / 2);
    const dy = box.top + box.height / 2 - e.clientY;
    const maxA = 10,
      maxO = 20;
    setTilt({
      rotateX: (dy / (box.height / 2)) * maxA,
      rotateY: (dx / (box.width / 2)) * maxA,
    });
    setBgOffset({
      x: -(dx / (box.width / 2)) * maxO,
      y: -(dy / (box.height / 2)) * maxO,
    });
  };
  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setBgOffset({ x: 0, y: 0 });
  };

  return (
    <section
      className={scss.page}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
        <video
    className={scss.background}
    src="/image/backvideo.mp4"       // или путь: public/backvideo.mp4
    autoPlay
    muted
    loop
    playsInline                     // для iOS
  />
      <div
        className={scss.background}
        style={{
          transform: `translate3d(${bgOffset.x}px,${bgOffset.y}px,0) scale(1.1)`,
        }}
      />
      <div
        className={scss.card}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rotateX}deg)
                      rotateY(${tilt.rotateY}deg) scale(1.02)`,
        }}
      >
        <form onSubmit={handleSubmit} className={scss.form}>
          <div className={scss.kyrgyz}>
            <img src="/image/logo.png" alt="logo" />
            <div className={scss.kyrgyz_text}>
              <h1>КЫРГЫЗАЛТЫН</h1>
            </div>
          </div>
          {error && <div className={scss.error}>{error}</div>}

          <div className={scss.inputGroup}>
            <label className={scss.label}>Логин</label>
            <div className={scss.inputWrapper}>
              <input
                type="text"
                className={scss.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <span className={scss.underline} />
            </div>
          </div>

          <div className={scss.inputGroup}>
            <label className={scss.label}>Пароль</label>
            <div className={scss.inputWrapper}>
              <input
                type={showPass ? "text" : "password"}
                className={scss.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className={scss.underline} />
              {password &&
                (showPass ? (
                  <AiOutlineEyeInvisible
                    className={scss.toggleIcon}
                    onClick={() => setShowPass(false)}
                  />
                ) : (
                  <AiOutlineEye
                    className={scss.toggleIcon}
                    onClick={() => setShowPass(true)}
                  />
                ))}
            </div>
          </div>

          <button type="submit" className={scss.button}>
            Войти
          </button>
        </form>
      </div>
    </section>
  );
};

export default LogIn;
