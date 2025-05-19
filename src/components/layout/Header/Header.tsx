// src/components/layout/Header.tsx
"use client";

import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import useAuth from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

const LANGS = [
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
  { code: "kg", label: "Кыргызча" },
];

const headerVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

// —————————————————————————————————————
// Вот наши новые классы:
const headerClass =
  "relative top-0 left-[16.3%] w-[67.3%] bg-white/20 backdrop-blur-lg border-b border-white/30 shadow-xl z-50 mt-[1%] rounded-xl  ";
const navContainerClass =
  "max-w-7xl mx-auto px-6 py-4 flex items-center justify-between";
const logoBoxClass =
  "flex items-center space-x-2 p-2 bg-white/30 backdrop-blur-sm rounded-lg";
const siteTitleClass = "text-2xl font-extrabold text-black";
const pageTitleClass = "text-2xl font-medium text-black";
const langBtnClass =
  "px-3 py-1 text-sm text-black bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition";
const logoutBtnClass =
  "flex items-center space-x-1 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-md transition";
// —————————————————————————————————————

const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const changeLang = (code: string) => {
    const segments = pathname.split("/");
    if (LANGS.map((l) => l.code).includes(segments[1])) {
      segments[1] = code;
    } else {
      segments.splice(1, 0, code);
    }
    router.push(segments.join("/") || "/");
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      className={headerClass}
    >
      <div className={navContainerClass}>
        {/* Логотип */}
        <Link href="/home" className={logoBoxClass}>
          <Image
            src="/image/logo.png"
            alt="Логотип"
            width={48}
            height={48}
          />
          <span className={siteTitleClass}>КЫРГЫЗАЛТЫН</span>
        </Link>

        {/* Заголовок страницы */}

        {/* Языки + выход */}
        <div className="flex items-center space-x-4">
          {LANGS.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLang(lang.code)}
              className={langBtnClass}
            >
              {lang.label}
            </button>
          ))}

          <button onClick={logout} className={logoutBtnClass}>
            <LogOut size={18} className="text-white" />
            <span className="text-sm">Выйти</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
