"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, Printer } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { usePrintData } from "@/providers/PrintProvider";

/* ─────────── ЯЗЫКИ ─────────── */


const headerVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

/* ---------- tooltip animation ---------- */
const tipAnim = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const { data: printData } = usePrintData();     // ★ результат из контекста
  const [showTip, setShowTip] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) return null;

  /* ---------- печать ---------- */
  const handlePrint = () => {
    if (!printData) {
      setShowTip(true);
      setTimeout(() => setShowTip(false), 2500);
      return;
    }
    window.print();
  };

  /* ---------- смена языка ---------- */


  /* ---------- выход ---------- */
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie
      .split(";")
      .forEach(
        (c) =>
          (document.cookie =
            c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/")),
      );
    logout();
    window.location.href = "/login";
  };

  return (
    <>
      <motion.header
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="fixed top-0 left-0 w-full z-50 bg-white/20 backdrop-blur-lg border-b border-white/30 shadow-xl print:hidden"
      >
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-2 md:px-6 md:py-3">
          {/* ---------- логотип ---------- */}
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-[20px] mb-[-2px] sm:text-[24px] md:text-[28px] font-bold text-[#003680]">
                КЫРГЫЗАЛТЫН
              </h1>
              <p className="text-[9.5px] mb-[4px] sm:text-[11.4px] md:text-[13.3px] font-medium text-[#003680]">
                АЧЫК АКЦИОНЕРДИК КОМПАНИЯ
              </p>
            </div>
            <img src="/image/logo.png" alt="logo" className="w-16 sm:w-20 md:w-24" />
          </div>

          {/* ---------- desktop zone ---------- */}
          <div className="hidden lg:flex items-center gap-4 ml-auto">
            {/* ---------- ПЕЧАТЬ ---------- */}
            <div className="relative">
              <button
                onClick={handlePrint}
                disabled={!printData}
                className={`inline-flex items-center gap-1 px-4 py-2 rounded-lg shadow
                  ${printData
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
              >
                <Printer size={18} />
                <span className="text-sm">Печать</span>
              </button>

              {/* tooltip */}
              <AnimatePresence>
                {showTip && (
                  <motion.div
                    variants={tipAnim}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute -left-4 top-11 w-max bg-black text-white text-xs rounded px-3 py-1"
                  >
                    Сначала выполните&nbsp;расчёт
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user?.profile.role === "ADMIN" && (
              <Link href="/admin/users" className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg shadow">
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

          {/* ---------- mobile burger ---------- */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 ml-auto">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* ---------- mobile menu ---------- */}
        {mobileOpen && (
          <div className="lg:hidden bg-white/90 backdrop-blur-md border-t border-white/30 shadow-inner px-4 py-2 space-y-2 rounded-b-xl">
            <button
              onClick={() => {
                handlePrint();
                setMobileOpen(false);
              }}
              disabled={!printData}
              className={`w-full text-left px-3 py-2 text-sm rounded
                ${printData
                  ? "bg-white/20 text-black hover:bg-white/30"
                  : "bg-white/10 text-gray-400 cursor-not-allowed"}`}
            >
              <div className="inline-flex items-center gap-2">
                <Printer size={16} />
                <span>Печать</span>
              </div>
            </button>

   

            {user?.profile.role === "ADMIN" && (
              <Link href="/admin/users" className="block w-full text-left px-3 py-2 text-sm text-black bg-white/20 rounded hover:bg-white/30">
                Админ-панель
              </Link>
            )}

            <button onClick={handleLogout} className="w-full text-left px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full">
              Выйти
            </button>
          </div>
        )}
      </motion.header>

      {/* отступ, чтобы контент не уползал под шапку */}
      <div className="h-[72px] lg:h-[56px]" />
    </>
  );
};

export default Header;
