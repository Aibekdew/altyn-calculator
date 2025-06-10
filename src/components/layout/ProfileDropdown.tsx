"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, LogOut, Printer } from "lucide-react";
import api from "@/utils/api";
import type { CurrentUser } from "@/hooks/useAuth";

/* ---------- helpers ---------- */
const initialsFrom = (first = "", last = "") =>
  (first[0] || "").toUpperCase() + (last[0] || "").toUpperCase();

const truncate = (str = "", max = 20) =>
  str.length > max ? str.slice(0, max - 3) + "…" : str;

/* ---------- animations ---------- */
const collapsible = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
};

type Props = {
  user: CurrentUser | null;
  onLogout: () => void;
  showTip?: boolean;
  mobile?: boolean;
  onPrint?: () => void;
  canPrint?: boolean;
};

const ProfileDropdown: React.FC<Props> = ({
  user,
  onLogout,
  showTip,
  mobile = false,
  onPrint,
  canPrint = false,
}) => {
  const [open, setOpen] = useState(false);
  const [editFio, setEditFio] = useState(false);
  const [editPwd, setEditPwd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fio, setFio] = useState({
    first: user?.first_name || "",
    last: user?.last_name || "",
    patr: user?.profile?.patronymic || "",
  });
  const [pwds, setPwds] = useState({ old: "", neu: "" });

  const wrapperRef = useRef<HTMLDivElement>(null); // ★

  const fullName = `${fio.first} ${fio.last}`.trim();

  /* ----- жабуу үчүн тышкы кликти/скролду кармайбыз ----- */
  useEffect(() => {
    if (!open) return;

    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [open]);

  /* ---------- PATCH-запросы ---------- */
  const patchFio = async () => {
    setSaving(true);
    await api.patch("/auth/me/", {
      first_name: fio.first,
      last_name: fio.last,
      patronymic: fio.patr,
    });
    setEditFio(false);
    setSaving(false);
  };

  const patchPwd = async () => {
    if (!pwds.old || !pwds.neu) return;
    setSaving(true);
    await api.patch("/auth/me/", {
      old_password: pwds.old,
      new_password: pwds.neu,
    });
    setPwds({ old: "", neu: "" });
    setEditPwd(false);
    setSaving(false);
    alert("Пароль изменён. Войдите заново.");
    onLogout();
  };

  /* ---------- view ---------- */
  return (
    <div className="relative" ref={wrapperRef}>
      {" "}
      {/* ★ */}
      {/* кнопка-заголовок */}
      <button
        onClick={() => {
          const willOpen = !open;
          setOpen(willOpen);
          if (willOpen) {
            setEditFio(true);
            setEditPwd(true);
          }
        }}
        className="inline-flex items-center gap-2"
      >
        {/* аватар-инициалы */}
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold">
          {initialsFrom(fio.first, fio.last)}
        </span>

        {/* имя + роль */}
        <span className="flex flex-col items-start leading-none text-sm">
          <span className="font-medium">
            {truncate(fullName || user?.username || "", 22)}
          </span>
          <span className="text-gray-500 text-xs">
            {user?.profile?.role === "ADMIN" ? "Администратор" : "Пользователь"}
          </span>
        </span>

        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {/* dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`absolute ${
              mobile ? "left-0 w-full" : "right-0"
            } mt-4 min-w-[260px] bg-white rounded-xl shadow-xl ring-1 ring-black/5 p-4 z-50`}
          >
            {/* --- блок ФИО --- */}
            <div>
              <button
                onClick={() => setEditFio(!editFio)}
                className="w-full flex justify-between items-center text-sm font-semibold mb-1"
              >
                Изменить ФИО
                {editFio ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              <AnimatePresence>
                {editFio && (
                  <motion.div
                    variants={collapsible}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-2"
                  >
                    {["first", "last", "patr"].map((f, i) => (
                      <input
                        key={f}
                        type="text"
                        placeholder={["Имя", "Фамилия", "Отчество"][i]}
                        value={(fio as any)[f]}
                        onChange={(e) =>
                          setFio({ ...fio, [f]: e.target.value })
                        }
                        className="w-full bg-white px-3 py-2 border rounded focus:ring"
                      />
                    ))}

                    <button
                      onClick={patchFio}
                      disabled={saving}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
                    >
                      Изменить
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* --- блок пароля --- */}
            <div className="mt-3">
              <button
                onClick={() => setEditPwd(!editPwd)}
                className="w-full flex justify-between items-center text-sm font-semibold mb-1"
              >
                Изменить пароль
                {editPwd ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              <AnimatePresence>
                {editPwd && (
                  <motion.div
                    variants={collapsible}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-2"
                  >
                    <input
                      type="password"
                      placeholder="Старый пароль"
                      value={pwds.old}
                      onChange={(e) =>
                        setPwds({ ...pwds, old: e.target.value })
                      }
                      className="w-full bg-white px-3 py-2 border rounded focus:ring"
                    />
                    <input
                      type="password"
                      placeholder="Новый пароль"
                      value={pwds.neu}
                      onChange={(e) =>
                        setPwds({ ...pwds, neu: e.target.value })
                      }
                      className="w-full bg-white px-3 py-2 border rounded focus:ring"
                    />

                    <button
                      onClick={patchPwd}
                      disabled={saving}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
                    >
                      Изменить
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* --- печать (mobile) --- */}
            {mobile && onPrint && (
              <button
                onClick={onPrint}
                disabled={!canPrint}
                className={`w-full mt-4 flex items-center justify-center gap-2 py-2 rounded text-sm shadow ${
                  canPrint
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Printer size={16} />
                Печать
              </button>
            )}

            {/* --- выход --- */}
       <button
  onClick={onLogout}
  className="w-full mt-4 py-2 border border-black bg-white text-black rounded flex items-center justify-center gap-2
             hover:bg-black hover:text-white transition-colors"
>
  <LogOut size={16} />
  Выйти
</button>

          </motion.div>
        )}
      </AnimatePresence>
      {/* tooltip (desktop) */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute right-0 mt-12 bg-black text-white text-xs rounded px-3 py-1"
          >
            Сначала выполните расчёт
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
