// app/(site)/(home)/page.tsx
"use client"; // ➊ добавляем

import HomeSection from "@/components/pages/HomeSection";

export default function HomePage() {
  // ➋ компонент с заглавной буквы
  return <HomeSection />;
}
