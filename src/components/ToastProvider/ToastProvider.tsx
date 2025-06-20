"use client";

import { Toaster } from "react-hot-toast";

/** базовый класс для всех тостов */
const base =
  "shadow-lg rounded-lg border-l-4 bg-white px-4 py-3 text-sm max-w-sm flex gap-2";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 4000,
        success: { className: `${base} border-green-500` },
        error:   { className: `${base} border-red-500`  },
        // «кастомные» тосты (warning / info) будем вызывать через toast.custom
        blank:   { className: `${base} border-blue-500` },
      }}
    />
  );
}
