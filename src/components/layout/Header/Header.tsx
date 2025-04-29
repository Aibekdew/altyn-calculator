// src/components/Header.tsx
"use client";

import React, { FC } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const LANGS = [
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
  { code: "kg", label: "Кыргызча" },
];

const Header: FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const changeLang = (code: string) => {
    // разбиваем путь на сегменты
    const segments = pathname.split("/");
    // проверяем, есть ли в первом сегменте локаль
    if (LANGS.map((l) => l.code).includes(segments[1])) {
      segments[1] = code;
    } else {
      segments.splice(1, 0, code);
    }
    const newPath = segments.join("/") || "/";
    router.push(newPath);
  };

  return (
    <header className="w-full fixed top-0 z-50 bg-white dark:bg-white-900 shadow">
      <div className=" mx-auto flex items-center justify-between py-4 px-6">
        {/* Логотип */}
        <Link href="/" className="flex items-center">
          <Image
            src="/image/logo.png"
            alt="Логотип"
            width={120}
            height={40}
            priority
          />
        </Link>

        {/* Селектор языка */}
        <div className="flex space-x-4">
          {LANGS.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLang(lang.code)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
