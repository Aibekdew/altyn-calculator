/* ------------------------------------------------------------------
 * UNIVERSAL FULL-WIDTH HEADER
 * ------------------------------------------------------------------ */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Printer, Clock, ChevronLeft } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { usePrintData } from "@/providers/PrintProvider";
import { useAddPrintLogMutation } from "@/redux/api";
import ProfileDropdown from "../ProfileDropdown";

const headerVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.45 } },
};

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { data: printData } = usePrintData();
  const [addPrintLog] = useAddPrintLogMutation();

  const [showTip, setShowTip] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState(false); // ← для всплывашки

  if (loading) return null;

  /* ---------- helpers ---------- */
  const isHistory = pathname.startsWith("/history");

  const handlePrint = async () => {
    if (!printData) {
      setToast(true); // показываем всплывашку
      setTimeout(() => setToast(false), 3000);
      return;
    }
    window.print();
    try {
      await addPrintLog().unwrap();
    } catch {}
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie
      .split(";")
      .forEach(
        (c) =>
          (document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date(0).toUTCString() + ";path=/"
            ))
      );
    logout();
    window.location.href = "/login";
  };

  const btn =
    "inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full text-sm font-medium " +
    "transition-colors transition-transform shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60 " +
    "active:scale-95 active:opacity-80";

  /* ---------------------------------------------------------------- */
  return (
    <>
      <motion.header
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-white/30 shadow-xl print:hidden"
      >
        {/* 100 % ширины, no container */}
        <div className="flex items-center justify-between w-full px-4 py-2 md:px-6 md:py-3">
          {/* ---------- LEFT: back button + logo ---------- */}
          <div className="flex items-center gap-4">
            {isHistory && (
              <button
                onClick={() => router.back()}
                className={`${btn} bg-gray-100 hover:bg-gray-200 text-gray-800`}
              >
                <ChevronLeft size={18} />
                Назад
              </button>
            )}

            <div className="flex items-center gap-3">
              <Link
                href="/home"
                className="flex items-center gap-3 cursor-pointer select-none no-underline"
              >
                <div>
                  <h1 className="text-[20px] mb-[-2px] sm:text-[24px] md:text-[28px] font-bold text-[#003680]">
                    КЫРГЫЗАЛТЫН
                  </h1>
                  <p className="text-[10.8px] mb-[4px] sm:text-[13.4px] md:text-[15.3px] font-medium text-[#003680]">
                    АЧЫК АКЦИОНЕРДИК КООМУ
                  </p>
                </div>
                <img
                  src="/image/logo.png"
                  alt="logo"
                  className="w-16 sm:w-20 md:w-24"
                />
              </Link>
            </div>
          </div>

          {/* ---------- DESKTOP actions ---------- */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/history"
              className={`${btn} bg-gray-100 hover:bg-gray-200 text-gray-800 no-underline`}
            >
              <Clock size={18} />
              История
            </Link>

            <button
              onClick={handlePrint}
              className={`${btn} ${
                printData
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  : "bg-gray-100 text-gray-400" // курсор можно оставить default
              }`}
            >
              <Printer size={18} />
              Печать
            </button>

            {user?.profile.role === "ADMIN" && (
              <Link
                href="/adminpanel/users"
                className={`${btn} bg-gray-800 hover:bg-gray-900 text-white`}
              >
                Админ-панель
              </Link>
            )}

            <ProfileDropdown
              user={user}
              onLogout={handleLogout}
              showTip={showTip}
            />
          </div>

          {/* ---------- BURGER ---------- */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 ml-2"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* ---------- MOBILE menu ---------- */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-md border-t border-white/40 shadow-inner"
            >
              <div className="px-4 py-4 space-y-3">
                {/* блок History / Print */}
                <Link
                  href="/history"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100"
                >
                  <Clock size={18} className="inline align-middle mr-2" />
                  История
                </Link>

                <button
                  onClick={() => {
                    handlePrint();
                    setMobileOpen(false);
                  }}
                  disabled={!printData}
                  className={`block w-full text-left px-3 py-2 rounded-lg ${
                    printData
                      ? "bg-gray-50 hover:bg-gray-100"
                      : "bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Printer size={18} className="inline align-middle mr-2" />
                  Печать
                </button>

                {user?.profile.role === "ADMIN" && (
                  <Link
                    href="/adminpanel/users"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100"
                  >
                    Админ-панель
                  </Link>
                )}

                {/* Профиль + выход */}
                <ProfileDropdown
                  user={user}
                  onLogout={handleLogout}
                  mobile
                  onPrint={handlePrint}
                  canPrint={!!printData}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2
                 px-4 py-2 bg-red-500 text-white text-sm rounded-lg shadow-lg"
            >
              Сначала рассчитайте стоимость аренды
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* spacer для фиксации контента ниже шапки */}
      <div className="h-[72px] lg:h-[60px]" />
    </>
  );
};

export default Header;
