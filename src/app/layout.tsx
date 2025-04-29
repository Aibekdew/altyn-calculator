// src/app/layout.tsx
"use  client";
import "./globals.scss";
// src/app/layout.tsx
import "bootstrap/dist/css/bootstrap.min.css";

import ReduxProvider from "@/providers/ReduxProvider";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
export const metadata = {
  title: "My App",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Оборачиваем всё в ReduxProvider, чтобы RTK Query работал */}
        <ThemeProvider attribute="class">
          <ReduxProvider>{children}</ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
