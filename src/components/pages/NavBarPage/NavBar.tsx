/* components/PixelPerfectSidebar.tsx */
"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Star,
  CalendarDays,
  ListChecks,
  Users,
  BarChart2,
  FileText,
  DollarSign,
  UserCheck,
  MessageSquare,
  Send,
  TrendingUp,
  Settings,
  ChevronRight,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";

/* -------- конфигурация меню -------- */
type Item = {
  id: string;
  label: string;
  icon: React.ElementType;
  children?: Item[];
};

const NAV: Item[] = [
  { id: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "/events", label: "Events", icon: Star },
  {
    id: "/schedule",
    label: "Schedule",
    icon: CalendarDays,
    children: [
      { id: "/schedule/day", label: "Day", icon: CalendarDays },
      { id: "/schedule/week", label: "Week", icon: CalendarDays },
    ],
  },
  {
    id: "/tasks",
    label: "Tasks",
    icon: ListChecks,
    children: [{ id: "/tasks/list", label: "Task list", icon: ListChecks }],
  },
  { id: "/employees", label: "Employees", icon: Users },
  {
    id: "/analytics",
    label: "Analytics",
    icon: BarChart2,
    children: [
      { id: "/analytics/overview", label: "Overview", icon: BarChart2 },
    ],
  },
  { id: "/reports", label: "Reports", icon: FileText },
  {
    id: "/finances",
    label: "Finances",
    icon: DollarSign,
    children: [
      { id: "/finances/invoices", label: "Invoices", icon: DollarSign },
    ],
  },
  { id: "/customers", label: "Customers", icon: UserCheck },
  { id: "/messages", label: "Messages", icon: MessageSquare },
  { id: "/leads", label: "Leads", icon: Send },
  {
    id: "/sales",
    label: "Sales",
    icon: TrendingUp,
    children: [{ id: "/sales/stats", label: "Stats", icon: TrendingUp }],
  },
  {
    id: "/settings",
    label: "Settings",
    icon: Settings,
    children: [{ id: "/settings/profile", label: "Profile", icon: Settings }],
  },
];

export default function PixelPerfectSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [fold, setFold] = useState(false); // ширина sidebar’а
  const [open, setOpen] = useState<string | null>(null); // раскрытый дроп-даун

  /* -------- класс darkMode’ду алмаштыруу -------- */
  const toggleTheme = () => document.documentElement.classList.toggle("dark");

  /* -------- нав-элемент -------- */
  const LinkItem = ({ item, depth = 0 }: { item: Item; depth?: number }) => {
    const active = pathname.startsWith(item.id);
    const hasCh = !!item.children?.length;
    const pad = fold ? "" : `pl-${6 + depth * 4}`;

    return (
      <>
        <button
          onClick={() =>
            hasCh
              ? setOpen(open === item.id ? null : item.id)
              : router.push(item.id)
          }
          className={`
            group flex items-center gap-3 w-full ${pad} pr-3 py-2.5
            ${active ? "bg-active" : "hover:bg-white/10"}
            rounded-md text-white transition-colors
            ${fold && "justify-center px-0"}
          `}
        >
          <item.icon size={18} />
          {!fold && (
            <>
              <span className="flex-1 text-sm">{item.label}</span>
              {hasCh &&
                (open === item.id ? (
                  <ChevronDown size={15} />
                ) : (
                  <ChevronRight size={15} />
                ))}
            </>
          )}
        </button>

        {hasCh && open === item.id && !fold && (
          <div className="space-y-1 mt-1">
            {item.children!.map((ch) => (
              <LinkItem key={ch.id} item={ch} depth={depth + 1} />
            ))}
          </div>
        )}
      </>
    );
  };

  /* -------- разметка -------- */
  return (
    <aside
      className={`
        fixed top-6 left-6 bottom-6 z-40
        bg-sidebar text-white rounded-xl2
        shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)]
        flex flex-col transition-[width] duration-300
        ${fold ? "w-[76px]" : "w-[260px]"}
      `}
    >
      {/* --- Логотип --- */}
      <div
        className={`flex items-center gap-3 pt-6 ${
          fold ? "justify-center" : "px-6"
        }`}
      >
        <Image
          src="/logo.svg"
          alt="logo"
          width={fold ? 34 : 40}
          height={fold ? 34 : 40}
          priority
        />
        {!fold && (
          <span className="text-lg font-semibold tracking-tight">
            Lanp&nbsp;Studio
          </span>
        )}
      </div>

      {/* --- Ак ручка --- */}
      <button
        onClick={() => setFold(!fold)}
        className="
          absolute -right-3 top-28 w-[16px] h-12
          bg-handle rounded-r-full shadow-xl
        "
        aria-label="Toggle sidebar"
      />

      {/* --- Навигация --- */}
      <nav className="flex-1 overflow-y-auto px-3 mt-6">
        {NAV.map((item) => (
          <LinkItem key={item.id} item={item} />
        ))}
      </nav>

      {/* --- Подвал (профиль + тем переключатель) --- */}
      <div
        className={`
          ${fold ? "justify-center" : "px-4"}
          py-4 bg-white/10 flex items-center gap-3
        `}
      >
        <Image
          src="/user.jpg"
          alt="avatar"
          width={38}
          height={38}
          className="rounded-full"
        />
        {!fold && (
          <div className="leading-tight text-[13px]">
            <p>Renata&nbsp;R.</p>
            <p className="text-[11px] opacity-70 -mt-0.5">renata@lanp.com</p>
          </div>
        )}
        {!fold && (
          <button
            onClick={toggleTheme}
            className="ml-auto p-2 rounded-md hover:bg-white/10"
          >
            <Sun className="hidden dark:inline-block" size={16} />
            <Moon className="dark:hidden" size={16} />
          </button>
        )}
      </div>
    </aside>
  );
}
