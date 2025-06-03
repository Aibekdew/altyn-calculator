import "./globals.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";

import { ReactNode } from "react";
import ClientProviders from "./ClientProviders";
export const metadata = {
  title: "Кыргызалтын",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
