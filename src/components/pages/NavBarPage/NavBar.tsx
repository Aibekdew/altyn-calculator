import { FC } from "react";
import scss from "./NavBar.module.scss";

const NavBar: FC = () => {
  return (
    <section className={scss.NavBar}>
      <div className="container">
        <div className={scss.content}>NavBar</div>
      </div>
    </section>
  );
};

export default NavBar;
