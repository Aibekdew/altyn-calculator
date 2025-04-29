
import LayoutSite from "@/components/layout/LayoutSite";
import ReduxProvider from "@/providers/ReduxProvider";
import { FC, ReactNode } from "react";

interface ILayoutProps {
  children: ReactNode;
}
const layout: FC<ILayoutProps> = ({ children }) => {
  return (
    <ReduxProvider>
      <LayoutSite>{children}</LayoutSite>
    </ReduxProvider>
  );
};

export default layout;
