// src/components/layout/Header.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import useAuth from "@/hooks/useAuth";
import { LogOut, Menu, X } from "lucide-react";

/* ─────────────────────────────────────────────
   Языки (литеральные типы)
   ───────────────────────────────────────────── */
const LANGS = [
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
  { code: "kg", label: "Кыргызча" },
] as const;

/** Союз всех кодов — "ru" | "en" | "kg" */
type LangCode = (typeof LANGS)[number]["code"];

/* ─────────────────────────────────────────────
   Анимация появления шапки
   ───────────────────────────────────────────── */
const headerVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

/* ─────────────────────────────────────────────
   Header component
   ───────────────────────────────────────────── */
const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // состояния для модальных окон
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);

  // отдельный массив строк, чтобы .includes() принимал обычный string
  const LANG_CODES: string[] = LANGS.map((l) => l.code);

  /* ——— смена языка ——————————————————————— */
  const changeLang = (code: LangCode) => {
    const segments = pathname.split("/");

    if (LANG_CODES.includes(segments[1])) {
      segments[1] = code; // заменяем существующий код
    } else {
      segments.splice(1, 0, code); // вставляем код после ведущего /
    }

    router.push(segments.join("/") || "/");
    setMobileOpen(false);
  };

  return (
    <>
      <motion.header
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className="top-0 left-0 w-full md:left-[5.1%] md:w-[100%] z-50 px-4 py-2 sm:px-6 sm:py-3 rounded-b-xl bg-white/20 backdrop-blur-lg border-b border-white/30 shadow-xl transition-all"
      >
        {/* Внутренний контейнер */}
        <div className="max-w-full mx-auto flex items-center justify-between flex-nowrap gap-x-4 overflow-hidden">
          {/* —— ЛОГО —— */}
          <div className="flex justify-center items-start">
            <div className="flex flex-col md:text-left">
              <h1 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[31.1px] tracking-wide font-bold leading-none text-black dark:text-white">
                КЫРГЫЗАЛТЫН
              </h1>
              <p className="text-[14px] sm:text-[16px] md:text-[17px] font-medium leading-none text-black dark:text-white">
                АЧЫК АКЦИОНЕРДИК КОООМУ
              </p>
            </div>
            <img
              src="image/logo.png"
              alt="Kyrgyzaltyn Logo"
              className="w-20 sm:w-24 md:w-28 lg:w-32"
            />
          </div>

          {/* —— DESKTOP: языки + новые кнопки + выход —— */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4 ml-auto flex-shrink-0">
            {/* Кнопки модальных окон */}
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-3 py-1 text-sm text-white bg-green-500 hover:bg-green-600 rounded-lg shadow-md transition whitespace-nowrap"
            >
              Добавить пользователя
            </button>
            <button
              onClick={() => setIsEditUserModalOpen(true)}
              className="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow-md transition whitespace-nowrap"
            >
              Изменить пользователя
            </button>

            {/* Кнопка выхода */}
            <button
              onClick={logout}
              className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-md transition whitespace-nowrap"
            >
              <LogOut size={18} />
              <span className="text-sm">Выйти</span>
            </button>
          </div>

          {/* —— MOBILE: кнопка меню —— */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 ml-auto flex-shrink-0"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* —— MOBILE DROPDOWN —— */}
        {mobileOpen && (
          <div className="lg:hidden bg-white/90 backdrop-blur-md border-t border-white/30 shadow-inner px-4 py-2 space-y-2 rounded-b-xl">
            {LANGS.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLang(lang.code)}
                className="w-full text-left px-3 py-1 text-sm text-black bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition whitespace-nowrap"
              >
                {lang.label}
              </button>
            ))}
            <button
              onClick={logout}
              className="w-full text-left px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-md transition"
            >
              Выйти
            </button>
          </div>
        )}
      </motion.header>

      {/* =========================
          МОДАЛЬНОЕ ОКНО: Добавить пользователя
         ========================= */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md mx-4 p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Добавить пользователя
              </h2>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            {/* Здесь можно разместить вашу форму или любой контент */}
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Имя
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите имя"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  E-mail
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите e-mail"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          МОДАЛЬНОЕ ОКНО: Изменить пользователя
         ========================= */}
      {isEditUserModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md mx-4 p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Изменить пользователя
              </h2>
              <button
                onClick={() => setIsEditUserModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            {/* Здесь можно разместить вашу форму или любой контент */}
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Выберите пользователя
                </label>
                <select className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Пользователь 1</option>
                  <option>Пользователь 2</option>
                  <option>Пользователь 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Новое имя
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите новое имя"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditUserModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
