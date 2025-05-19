// src/components/layout/Footer.tsx
import React from "react";
import { motion } from "framer-motion";

const footerVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const Footer: React.FC = () => (
  <motion.footer
    initial="hidden"
    animate="visible"
    variants={footerVariants}
    className="bg-gray-100 text-gray-600 py-6 mt-auto"
  >
    <div className="max-w-7xl mx-auto px-6 text-center">
      <p className="text-sm">&copy; {new Date().getFullYear()} KyrgyzAltyn. Все права защищены.</p>
    </div>
  </motion.footer>
);

export default Footer;