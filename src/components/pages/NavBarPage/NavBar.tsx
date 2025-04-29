// components/NavBarAlt.tsx
"use client";
import { FC, useState } from "react";
import {
  FiGrid,
  FiCreditCard,
  FiTool,
  FiInbox,
  FiHome,
  FiUsers,
  FiRepeat,
  FiDollarSign,
  FiPercent,
  FiBarChart2,
} from "react-icons/fi";

type Item = {
  icon: FC<{ size?: number; className?: string }>;
  label: string;
  count?: number;
};

const SECTIONS: { title: string; items: Item[] }[] = [
  {
    title: "Меню",
    items: [
      { icon: FiHome, label: "Недвижимость" },
      { icon: FiUsers, label: "Арендаторы" },
      { icon: FiRepeat, label: "Транзакции" },
      { icon: FiDollarSign, label: "Финансы" },
      { icon: FiPercent, label: "Комиссии" },
      { icon: FiBarChart2, label: "Отчёты" },
    ],
  },
];

const NavBarAlt: FC = () => {
  const [active, setActive] = useState("Обзор");

  return (
    <aside className="w-60 h-screen fixed bg-white shadow-md flex flex-col">
      <nav className="flex-1 overflow-y-auto py-10">
        {SECTIONS.map((sec) => (
          <div key={sec.title} className="mb-6">
            <p className="px-6 mb-2 text-10 font-semibold text-gray-500 uppercase">
              {sec.title}
            </p>
            <ul>
              {sec.items.map(({ icon: Icon, label, count }) => {
                const isActive = active === label;
                return (
                  <li key={label}>
                    <button
                      onClick={() => setActive(label)}
                      className={`
                        group flex gap-3 items-center w-full px-6 py-3 mb-1
                        text-10 text-gray-700 font-medium
                        rounded-r-full
                        transition-colors duration-200
                        
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                            : "hover:bg-blue-100 hover:text-blue-700"
                        }
                      `}
                    >
                      <Icon
                        size={18}
                        className={`
                          ${
                            isActive
                              ? "text-blue-600"
                              : "text-gray-400 group-hover:text-blue-600"
                          }
                        `}
                      />
                      <span className="ml-3 flex">{label}</span>
                      {/* {count != null && (
                        <span
                          className={`
                            inline-flex items-center justify-center
                            px-2 py-0.5 text-xs font-semibold
                            ${
                              isActive
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 text-gray-600"
                            }
                            rounded-full
                          `}
                        >
                          {count}
                        </span>
                      )} */}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default NavBarAlt;
