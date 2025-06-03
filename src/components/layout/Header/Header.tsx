// src/components/layout/Header.tsx
"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import useAuth from "@/hooks/useAuth";
import { LogOut, Menu, X } from "lucide-react";

// Список языков
const LANGS = [
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
  { code: "kg", label: "Кыргызча" },
] as const;
type LangCode = (typeof LANGS)[number]["code"];

// Анимация появления заголовка
const headerVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Пока идёт загрузка данных пользователя, не рендерим шапку
  if (loading) {
    return null;
  }

  // Собираем массив кодов языков для замены сегмента пути
  const LANG_CODES: string[] = LANGS.map((l) => l.code);

  const changeLang = (code: LangCode) => {
    const segments = pathname.split("/");
    if (LANG_CODES.includes(segments[1])) {
      segments[1] = code;
    } else {
      segments.splice(1, 0, code);
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
        className="fixed top-0 left-0 w-full z-50 bg-white/20 backdrop-blur-lg border-b border-white/30 shadow-xl transition-all"
      >
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-2 md:px-6 md:py-3">
          {/* Логотип и название */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h1 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-bold text-black dark:text-white">
                КЫРГЫЗАЛТЫН
              </h1>
              <p className="text-[14px] sm:text-[16px] md:text-[17px] font-medium text-black dark:text-white">
                АЧЫК АКЦИОНЕРДИК КОООМУ
              </p>
            </div>
            <img
              src="/image/logo.png"
              alt="Kyrgyzaltyn Logo"
              className="w-16 sm:w-20 md:w-24 lg:w-28"
            />
          </div>

          {/* Десктоп: кнопки справа */}
          <div className="hidden lg:flex items-center gap-4 ml-auto">
            {/* Появится только если роль ADMIN */}
            {user?.profile?.role === "ADMIN" && (
              <Link
                href="/admin/users"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg shadow transition"
              >
                Админ-панель
              </Link>
            )}
            <button
              onClick={logout}
              className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow transition"
            >
              <LogOut size={18} />
              <span className="text-sm">Выйти</span>
            </button>
          </div>

          {/* Мобильный переключатель */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden p-2 ml-auto"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Мобильное меню */}
        {mobileOpen && (
          <div className="lg:hidden bg-white/90 backdrop-blur-md border-t border-white/30 shadow-inner px-4 py-2 space-y-2 rounded-b-xl">
            {LANGS.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLang(lang.code)}
                className="w-full text-left px-3 py-2 text-sm text-black bg-white/20 rounded hover:bg-white/30 transition"
              >
                {lang.label}
              </button>
            ))}

            {user?.profile?.role === "ADMIN" && (
              <Link
                href="/admin/users"
                className="w-full text-left px-3 py-2 text-sm text-black bg-white/20 rounded hover:bg-white/30 transition"
              >
                Админ-панель
              </Link>
            )}

            <button
              onClick={logout}
              className="w-full text-left px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full transition"
            >
              Выйти
            </button>
          </div>
        )}
      </motion.header>

      {/* Отступ, чтобы контент не ушёл под шапку */}
      <div className="h-[72px] lg:h-[56px]"></div>
    </>
  );
};

export default Header;
