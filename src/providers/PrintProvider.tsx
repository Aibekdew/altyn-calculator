"use client";
import React, { createContext, useContext, useState } from "react";
import type { CalcResult } from "@/types/calc-result";

interface Ctx {
  data: CalcResult | null;
  setData: (d: CalcResult | null) => void;
}

const PrintCtx = createContext<Ctx | undefined>(undefined);

export function PrintProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CalcResult | null>(null);
  return (
    <PrintCtx.Provider value={{ data, setData }}>{children}</PrintCtx.Provider>
  );
}

/* ⬇️  аргумент убираем — он не нужен */
export const usePrintData = () => {
  const ctx = useContext(PrintCtx);
  if (!ctx) throw new Error("usePrintData must be used within PrintProvider");
  return ctx;
};
