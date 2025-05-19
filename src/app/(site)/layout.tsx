// src/app/(site)/layout.tsx
import React, { ReactNode } from "react";
import LayoutSite from "@/components/layout/LayoutSite";

interface SiteLayoutProps {
  children: ReactNode;
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return <LayoutSite>{children}</LayoutSite>;
}
