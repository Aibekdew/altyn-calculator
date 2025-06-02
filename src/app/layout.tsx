import "./globals.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import { ReactNode } from "react";
import ClientProviders from "./ClientProviders";
export const metadata = {
  title: "Kyrgyzaltyn",
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
