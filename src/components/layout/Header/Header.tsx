"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, Printer } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { usePrintData } from "@/providers/PrintProvider";
import ProfileDropdown from "../ProfileDropdown";

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

  const { data: printData } = usePrintData(); // ★ результат из контекста
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
    "transition-colors shadow focus:outline-none focus:ring-2 focus:ring-blue-400/60";

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
              <p className="text-[10.8px] mb-[4px] sm:text-[13.4px] md:text-[15.3px] font-medium text-[#003680]">
                АЧЫК АКЦИОНЕРДИК КООМУ
              </p>
            </div>
            <img
              src="/image/logo.png"
              alt="logo"
              className="w-16 sm:w-20 md:w-24"
            />
          </div>

          {/* ---------- desktop zone ---------- */}
          <div className="hidden lg:flex items-center gap-3">
            {/* печать */}
            <button
              onClick={handlePrint}
              disabled={!printData}
              className={`${btn} ${
                printData
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Printer size={18} />
              Печать
            </button>

            {/* админ-панель */}
            {user?.profile.role === "ADMIN" && (
              <Link
                href="/adminpanel/users"
                className={`${btn} bg-gray-800 hover:bg-gray-900 text-white`}
              >
                Админ-панель
              </Link>
            )}

            {/* профиль + выход (выпадающее меню) */}
            <ProfileDropdown
              user={user}
              onLogout={handleLogout}
              showTip={showTip}
            />
          </div>

          {/* ---------- MOBILE burger ---------- */}
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
              <div className="px-4 py-3 space-y-3">
                {/* профиль + печать + выход — уже внутри компонента */}
                <ProfileDropdown
                  user={user}
                  onLogout={handleLogout}
                  mobile
                  onPrint={handlePrint}
                  canPrint={!!printData}
                />

                {/* админ-панель */}
                {user?.profile.role === "ADMIN" && (
                  <Link
                    href="/adminpanel/users"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm"
                  >
                    Админ-панель
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* отступ, чтобы контент не уползал под шапку */}
      <div className="h-[72px] lg:h-[60px]" />
    </>
  );
};

export default Header;
