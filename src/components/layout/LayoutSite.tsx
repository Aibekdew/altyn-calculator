import { FC, ReactNode } from "react";
import scss from "./LayoutSite.module.scss";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

interface ILayoutSiteProps {
  children: ReactNode;
}
const LayoutSite: FC<ILayoutSiteProps> = ({ children }) => {
  return (
    <div className={scss.LayoutSite}>
      <div className={scss.block}>
        {/* <div className={scss.nav}>
          <NavBar />
        </div> */}
        <div className={scss.children}>
          <Header />
          <main className={scss.center}>{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default LayoutSite;
