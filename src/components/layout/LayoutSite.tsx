"use client";
import { FC, ReactNode } from "react";
import scss from "./LayoutSite.module.scss";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import NavBar from "../pages/NavBarPage/NavBar";

interface ILayoutSiteProps {
  children: ReactNode;
}
const LayoutSite: FC<ILayoutSiteProps> = ({ children }) => {
  return (
    <div className={scss.LayoutSite}>
      <Header />
      <div className={scss.block}>
        <NavBar />
        <div className={scss.block2}>
          <div className={scss.children}>{children}</div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default LayoutSite;
