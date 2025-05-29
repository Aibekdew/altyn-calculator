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

  /* ——— render ————————————————————————————— */
  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      className=" top-0 left-0 w-full md:left-[5.1%] md:w-[100%]  z-50 px-4 py-2 sm:px-6 sm:py-3 rounded-b-xl bg-white/20 backdrop-blur-lg border-b border-white/30 shadow-xl transition-all"
    >
      {/* Внутренний контейнер */}
      <div className="max-w-full mx-auto flex items-center justify-between flex-nowrap gap-x-4 overflow-hidden">
        {/* —— ЛОГО —— */}
                <div className="flex justify-center items-start ">
            <div className="flex flex-col md:text-left ">
              <h1 className="text-[20px] sm:text-[24px] md:text-[28px]  lg:text-[31.1px] tracking-wide font-bold leading-none text-black dark:text-white">
                КЫРГЫЗАЛТЫН
              </h1>
              <p className="text-[14px] sm:text-[16px] md:text-[17px]  font-medium leading-none text-black dark:text-white">
                АЧЫК АКЦИОНЕРДИК КОООМУ
              </p>
            </div>
            <img
              src='image/logo.png'
              alt="Kyrgyzaltyn Logo"
              className="w-20 sm:w-24 md:w-28 lg:w-32"
            />
          </div>

        {/* —— DESKTOP: языки + выход —— */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-4 ml-auto flex-shrink-0">
          {/* {LANGS.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLang(lang.code)}
              className="px-3 py-1 text-sm text-black bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition whitespace-nowrap"
            >
              {lang.label}
            </button>
          ))} */}

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
  );
};

export default Header;
