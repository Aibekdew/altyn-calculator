"use client";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import ReduxProvider from "@/providers/ReduxProvider";
import { PrintProvider } from "@/providers/PrintProvider";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <PrintProvider>
        <ThemeProvider attribute="class">{children}</ThemeProvider>
      </PrintProvider>
    </ReduxProvider>
  );
}
