import { FC } from "react";
import scss from "./Footer.module.scss";

const Footer: FC = () => {
  return (
    <section className={scss.Footer}>
      <div className="px-6 py-4 border-t text-10 text-gray-500">
        © 2025 ОАО Кыргызалтын
      </div>
    </section>
  );
};

export default Footer;
