"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import useAuth from "@/hooks/useAuth";
import { LogOut, Menu, X, Printer } from "lucide-react";

/* ─────────── ЯЗЫКИ ─────────── */
const LANGS = [
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
  { code: "kg", label: "Кыргызча" },
] as const;
/** "ru" | "en" | "kg" */
type LangCode = (typeof LANGS)[number]["code"];

const headerVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) return null;

  /* ----- Печать ----- */
  const handlePrint = () => window.print();

  /* ----- Смена языка ----- */
  const LANG_CODES = LANGS.map((l) => l.code) as LangCode[]; // ★ привели тип

  const changeLang = (code: LangCode) => {
    const segments = pathname.split("/");

    // ① проверяем, первый сегмент — это язык?
    if (LANG_CODES.includes(segments[1] as LangCode)) {
      segments[1] = code; // меняем
    } else {
      segments.splice(1, 0, code); // добавляем
    }

    router.push(segments.join("/") || "/");
    setMobileOpen(false);
  };

  /* ----- Выход ----- */
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
    });
    logout();
    window.location.href = "/login";
  };

  return (
    <>
      <motion.header
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className="fixed top-0 left-0 w-full z-50 bg-white/20 backdrop-blur-lg border-b border-white/30 shadow-xl"
      >
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-2 md:px-6 md:py-3">
          {/* -------- ЛОГО -------- */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h1 className="text-[20px] sm:text-[24px] md:text-[28px] font-bold text-[#003680]">
                КЫРГЫЗАЛТЫН
              </h1>
              <p className="text-[14px] sm:text-[16px] md:text-[14.5px] font-medium text-[#003680]">
                АЧЫК АКЦИОНЕРДИК КОМПАНИЯ
              </p>
            </div>
            <img
              src="/image/logo.png"
              alt="Kyrgyzaltyn Logo"
              className="w-16 sm:w-20 md:w-24"
            />
          </div>

          {/* -------- Desktop buttons -------- */}
          <div className="hidden lg:flex items-center gap-4 ml-auto">
            <button
              onClick={handlePrint}
              title="Распечатать"
              className="inline-flex items-center gap-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow"
            >
              <Printer size={18} />
              <span className="text-sm">Печать</span>
            </button>

            {user?.profile?.role === "ADMIN" && (
              <Link
                href="/admin/users"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg shadow"
              >
                Админ-панель
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow"
            >
              <LogOut size={18} />
              <span className="text-sm">Выйти</span>
            </button>
          </div>

          {/* -------- Mobile burger -------- */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 ml-auto"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* -------- Mobile menu -------- */}
        {mobileOpen && (
          <div className="lg:hidden bg-white/90 backdrop-blur-md border-t border-white/30 shadow-inner px-4 py-2 space-y-2 rounded-b-xl">
            <button
              onClick={() => {
                handlePrint();
                setMobileOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-black bg-white/20 rounded hover:bg-white/30"
            >
              <div className="inline-flex items-center gap-2">
                <Printer size={16} />
                <span>Печать</span>
              </div>
            </button>

            {LANGS.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLang(lang.code)}
                className="w-full text-left px-3 py-2 text-sm text-black bg-white/20 rounded hover:bg-white/30"
              >
                {lang.label}
              </button>
            ))}

            {user?.profile?.role === "ADMIN" && (
              <Link
                href="/admin/users"
                className="w-full text-left px-3 py-2 text-sm text-black bg-white/20 rounded hover:bg-white/30"
              >
                Админ-панель
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full"
            >
              Выйти
            </button>
          </div>
        )}
      </motion.header>

      {/* отступ под фикс-шапкой */}
      <div className="h-[72px] lg:h-[56px]" />
    </>
  );
};

export default Header;
