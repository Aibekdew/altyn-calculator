// src/app/admin/users/page.tsx   или   src/pages/admin/users.tsx

"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import useAuth, { CurrentUser } from "@/hooks/useAuth";
import { AiOutlinePlus, AiOutlineEdit, AiOutlinePrinter, AiOutlineArrowLeft } from "react-icons/ai";
import { HiOutlineUser } from "react-icons/hi";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";              // ← NEW

// Тип, который приходит из API (UserManagementSerializer)
interface UserItem {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  patronymic_read: string;
  role_read: "ADMIN" | "USER";
  is_active_read: boolean;
}
interface PrintSettings {
  left_title: string;
  left_subtitle: string;
  right_executor: string;
}
const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};
const AdminUsersPage: React.FC = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
    const [uLoading, setULoading] = useState(true);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ps, setPs] = useState<PrintSettings>({
    left_title: "",
    left_subtitle: "",
    right_executor: "",
  });
  const [psSaving, setPsSaving] = useState(false);
  // Состояния для модалок
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [view, setView] = useState<"users" | "print">("users");


  // Поля для «Добавить пользователя»
  const [newUsername, setNewUsername] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newPatronymic, setNewPatronymic] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [newRole, setNewRole] = useState<"ADMIN" | "USER">("USER");
  const [newIsActive, setNewIsActive] = useState<boolean>(true);

  // Поля для «Редактировать пользователя»
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editPatronymic, setEditPatronymic] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editConfirmPassword, setEditConfirmPassword] = useState("");
  const [editRole, setEditRole] = useState<"ADMIN" | "USER">("USER");
  const [editIsActive, setEditIsActive] = useState<boolean>(true);

  // Поля для валидации
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // 1) Защищаем страницу: если authLoading == false и (user == null OR role != "ADMIN") → редирект "/"
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        return; // useAuth сам отправит на /login
      }
      if (user.profile.role !== "ADMIN") {
        router.replace("/");
      }
    }
  }, [user, authLoading, router]);

  // 2) Функция загрузки списка пользователей
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get<UserItem[]>("/users/");
      setUsers(res.data);
    } catch {
      setError("Не удалось загрузить список пользователей.");
    } finally {
      setLoading(false);
    }
  };

 const fetchPrintSettings = async () => {
    try {
      const { data } = await api.get<PrintSettings>("/print-settings/");
      setPs(data);
    } catch {
      setError("Не удалось загрузить настройки печати.");
    }
  };

  useEffect(() => {
    if (!authLoading && user?.profile.role === "ADMIN") {
      fetchUsers();
      fetchPrintSettings();
    }
  }, [authLoading, user]);

  /* =========== СОХРАНИТЬ print-settings =========== */
const savePrintSettings = async () => {
  setPsSaving(true);
  try {
    await api.put("/print-settings/", ps);
    toast.success("Подписи успешно сохранены");       // ← NEW
  } catch {
    toast.error("Не удалось сохранить подписи");      // ← NEW
  } finally {
    setPsSaving(false);
  }
};


  // 3) Обработчик «Добавить пользователя»
  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!newUsername.trim()) errors.username = "Логин обязателен.";
    if (!newFirstName.trim()) errors.first_name = "Имя обязательно.";
    if (!newLastName.trim()) errors.last_name = "Фамилия обязательна.";
    if (!newPassword) errors.password = "Пароль обязателен.";
    if (!newConfirmPassword) errors.confirm_password = "Подтвердите пароль.";
    if (
      newPassword &&
      newConfirmPassword &&
      newPassword !== newConfirmPassword
    ) {
      errors.confirm_password = "Пароли не совпадают.";
    }
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    try {
      await api.post("/users/", {
        username: newUsername,
        first_name: newFirstName,
        last_name: newLastName,
        patronymic: newPatronymic,
        password: newPassword,
        confirm_password: newConfirmPassword,
        role: newRole,
        is_active: newIsActive,
      });
      setIsAddModalOpen(false);

      setNewUsername("");
      setNewFirstName("");
      setNewLastName("");
      setNewPatronymic("");
      setNewPassword("");
      setNewConfirmPassword("");
      setNewRole("USER");
      setNewIsActive(true);

      fetchUsers();
        toast.success("Пользователь добавлен");        
    } catch (err: any) {
      if (err.response?.data) {
        const apiErrors = err.response.data;
        const newErrors: Record<string, string> = {};
        Object.entries(apiErrors).forEach(([key, val]) => {
          newErrors[key] = Array.isArray(val)
            ? (val as string[])[0]
            : String(val);
        });
        setFieldErrors(newErrors);
      } else {
        setError("Ошибка при создании пользователя.");
      }
        toast.error("Ошибка при создании пользователя");    // ← NEW

    }
  };

  // 4) Открыть модалку «Редактировать», заполнить поля данными пользователя
  const openEditModal = (u: UserItem) => {
    setFieldErrors({});
    setEditUserId(u.id);
    setEditUsername(u.username);
    setEditFirstName(u.first_name);
    setEditLastName(u.last_name);
    setEditPatronymic(u.patronymic_read);
    setEditPassword("");
    setEditConfirmPassword("");
    setEditRole(u.role_read);
    setEditIsActive(u.is_active_read);
    setIsEditModalOpen(true);
  };

  // 5) Обработчик «Сохранить изменения» при редактировании
  const handleEditUser = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!editUserId) {
      setError("Некорректный пользователь.");
      return;
    }
    const errors: Record<string, string> = {};
    if (!editFirstName.trim()) errors.first_name = "Имя обязательно.";
    if (!editLastName.trim()) errors.last_name = "Фамилия обязательна.";
    if (
      (editPassword || editConfirmPassword) &&
      editPassword !== editConfirmPassword
    ) {
      errors.confirm_password = "Пароли не совпадают.";
    }
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    try {
      await api.patch(`/users/${editUserId}/`, {
        username: editUsername,
        first_name: editFirstName,
        last_name: editLastName,
        patronymic: editPatronymic,
        password: editPassword,
        confirm_password: editConfirmPassword,
        role: editRole,
        is_active: editIsActive,
      });
      setIsEditModalOpen(false);
      fetchUsers();
       toast.success("Изменения сохранены"); 
    } catch (err: any) {
      if (err.response?.data) {
        const apiErrors = err.response.data;
        const newErrors: Record<string, string> = {};
        Object.entries(apiErrors).forEach(([key, val]) => {
          newErrors[key] = Array.isArray(val)
            ? (val as string[])[0]
            : String(val);
        });
        setFieldErrors(newErrors);
      } else {
        setError("Ошибка при сохранении изменений.");
      }
        toast.error("Не удалось сохранить изменения");      // ← NEW

    }
  };

  // 6) Активация/деактивация пользователя
  const toggleActive = async (u: UserItem) => {
    try {
      await api.patch(`/users/${u.id}/`, {
        is_active: !u.is_active_read,
      });
      fetchUsers();
    } catch {
      setError("Ошибка при смене статуса.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Кнопка «Назад» */}
<div className="flex items-center justify-between px-4 py-3 bg-[#003680] mb-4">
        {/* Заголовок страницы */}
        <h1 className="text-3xl font-bold text-white">
          Админ-панель: Пользователи
        </h1>
        <button
          onClick={() => router.back()}
          className=" inline-flex items-center text-[20px] gap-1 text-white hover:text-gray-900"
        >
          ← Назад
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-200 rounded">
          {error}
        </div>
      )}

      {/* Блок кнопок: «Добавить» и «Обновить» */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => {
            setError(null);
            setFieldErrors({});
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
        >
          <AiOutlinePlus size={20} />
          <span className="font-medium">Добавить</span>
        </button>
        <button
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 px-5 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow transition"
        >
          <AiOutlineEdit size={20} />
          <span className="font-medium">Обновить</span>
        </button>
<button
  onClick={() => setView(view === "print" ? "users" : "print")}
  className={`
    inline-flex items-center gap-2 px-5 py-3 rounded-lg shadow transition
    ${view === "print"
      ? "bg-gray-200 hover:bg-gray-300 text-gray-800"   // при виде «print» — светлая «назад»
      : "bg-indigo-600 hover:bg-indigo-700 text-white"  // при виде «users» — яркая «печать»
    }
  `}
>
  {view === "print" ? (
    <>
      <AiOutlineArrowLeft size={20} />
      К списку
    </>
  ) : (
    <>
      <AiOutlinePrinter size={20} />
      Настройки печати
    </>
  )}
</button>
      </div>
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-100 text-red-800 border border-red-200 rounded">
          {error}
        </div>
      )}


      {/* Модальное окно «Добавить пользователя» */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg">
            {/* Заголовок модалки */}
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Добавить пользователя
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {/* Форма внутри */}
            <form onSubmit={handleAddUser} className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Логин */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Логин *
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                    className={`mt-1 block w-full px-3 py-2 bg-white text-gray-800 border rounded focus:outline-none focus:ring-2 ${
                      fieldErrors.username
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {fieldErrors.username && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.username}
                    </p>
                  )}
                </div>

                {/* Роль */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Роль *
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) =>
                      setNewRole(e.target.value as "ADMIN" | "USER")
                    }
                    className="mt-1 block w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ADMIN">Администратор</option>
                    <option value="USER">Пользователь</option>
                  </select>
                </div>

                {/* Имя */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Имя *
                  </label>
                  <input
                    type="text"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    required
                    className={`mt-1 block w-full px-3 py-2 bg-white text-gray-800 border rounded focus:outline-none focus:ring-2 ${
                      fieldErrors.first_name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {fieldErrors.first_name && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.first_name}
                    </p>
                  )}
                </div>

                {/* Фамилия */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Фамилия *
                  </label>
                  <input
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    required
                    className={`mt-1 block w-full px-3 py-2 bg-white text-gray-800 border rounded focus:outline-none focus:ring-2 ${
                      fieldErrors.last_name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {fieldErrors.last_name && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.last_name}
                    </p>
                  )}
                </div>

                {/* Отчество */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Отчество
                  </label>
                  <input
                    type="text"
                    value={newPatronymic}
                    onChange={(e) => setNewPatronymic(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Пароль */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Пароль *
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className={`mt-1 block w-full px-3 py-2 bg-white text-gray-800 border rounded focus:outline-none focus:ring-2 ${
                      fieldErrors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {fieldErrors.password && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {/* Подтвердите пароль */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Подтвердите пароль *
                  </label>
                  <input
                    type="password"
                    value={newConfirmPassword}
                    onChange={(e) => setNewConfirmPassword(e.target.value)}
                    required
                    className={`mt-1 block w-full px-3 py-2 bg-white text-gray-800 border rounded focus:outline-none focus:ring-2 ${
                      fieldErrors.confirm_password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {fieldErrors.confirm_password && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.confirm_password}
                    </p>
                  )}
                </div>

                {/* Активен? */}
                <div className="sm:col-span-2 flex items-center mt-2">
                  <input
                    id="newIsActive"
                    type="checkbox"
                    checked={newIsActive}
                    onChange={(e) => setNewIsActive(e.target.checked)}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label
                    htmlFor="newIsActive"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Активен
                  </label>
                </div>
              </div>

              {/* Кнопки «Отмена» / «Сохранить» */}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="mr-3 px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно «Редактировать пользователя» */}
      {isEditModalOpen && editUserId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-lg bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Редактировать пользователя
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleEditUser} className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Логин */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Логин *
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    required
                    className={`mt-1 block w-full px-3 py-2 bg-white text-gray-800 border rounded focus:outline-none focus:ring-2 ${
                      fieldErrors.username
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {fieldErrors.username && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.username}
                    </p>
                  )}
                </div>

                {/* Роль */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Роль *
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) =>
                      setEditRole(e.target.value as "ADMIN" | "USER")
                    }
                    className="mt-1 block w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ADMIN">Администратор</option>
                    <option value="USER">Пользователь</option>
                  </select>
                </div>

                {/* Имя */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Имя *
                  </label>
                  <input
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    required
                    className={`mt-1 block w-full px-3 py-2 bg-white text-gray-800 border rounded focus:outline-none focus:ring-2 ${
                      fieldErrors.first_name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {fieldErrors.first_name && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.first_name}
                    </p>
                  )}
                </div>

                {/* Фамилия */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Фамилия *
                  </label>
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    required
                    className={`mt-1 block w-full px-3 py-2 bg-white text-gray-800 border rounded focus:outline-none focus:ring-2 ${
                      fieldErrors.last_name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {fieldErrors.last_name && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.last_name}
                    </p>
                  )}
                </div>

                {/* Отчество */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Отчество
                  </label>
                  <input
                    type="text"
                    value={editPatronymic}
                    onChange={(e) => setEditPatronymic(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Новый пароль */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Новый пароль
                  </label>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 bg-white text-gray-800 border rounded focus:outline-none focus:ring-2 ${
                      fieldErrors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {fieldErrors.password && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {/* Подтвердите пароль */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Подтвердите пароль
                  </label>
                  <input
                    type="password"
                    value={editConfirmPassword}
                    onChange={(e) => setEditConfirmPassword(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 bg-white text-gray-800 border rounded focus:outline-none focus:ring-2 ${
                      fieldErrors.confirm_password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {fieldErrors.confirm_password && (
                    <p className="mt-1 text-xs text-red-600">
                      {fieldErrors.confirm_password}
                    </p>
                  )}
                </div>

                {/* Активен? */}
                <div className="sm:col-span-2 flex items-center mt-2">
                  <input
                    id="editIsActive"
                    type="checkbox"
                    checked={editIsActive}
                    onChange={(e) => setEditIsActive(e.target.checked)}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label
                    htmlFor="editIsActive"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Активен
                  </label>
                </div>
              </div>

              {/* Кнопки «Отмена» / «Сохранить» */}
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="mr-3 px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        <AnimatePresence mode="wait">
        {view === "users" ? (
          <motion.div
            key="users"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="px-6 mt-8"
          >
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((u) => {
            const fullName = `${u.first_name} ${u.last_name}${
              u.patronymic_read ? " " + u.patronymic_read : ""
            }`;
            return (
              <div
                key={u.id}
                className={`
                  flex flex-col justify-between
                  border-l-4
                  ${
                    u.is_active_read
                      ? "border-green-500 bg-white"
                      : "border-red-500 bg-white"
                  }
                  rounded-lg shadow-md
                  overflow-hidden
                `}
              >
                {/* Содержимое карточки */}
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <HiOutlineUser size={28} className="text-gray-700" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {fullName}
                      </h2>
                      <p className="text-[20px] text-gray-600">{u.username}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    {u.is_active_read ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center gap-1">
                        <span className="h-2 w-2 bg-green-600 rounded-full block" />
                        Активен
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full flex items-center gap-1">
                        <span className="h-2 w-2 bg-red-600 rounded-full block" />
                        Неактивен
                      </span>
                    )}
                  </div>
                </div>

                {/* Кнопки: «Редактировать» и «Активировать/Деактивировать» */}
                <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
                  <button
                    onClick={() => openEditModal(u)}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded transition"
                  >
                    <AiOutlineEdit size={16} /> Редактировать
                  </button>
                  <button
                    onClick={() => toggleActive(u)}
                    className={`px-3 py-2 text-sm rounded transition ${
                      u.is_active_read
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {u.is_active_read ? "Деактивировать" : "Активировать"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
          </motion.div>
        ) : (
          <motion.div
            key="print"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="px-6 mt-8 flex justify-center"
          >
            <div className="w-full max-w-xl bg-white rounded-xl shadow p-8 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 text-center">
                Подписи для печати
              </h2>

              {[
                { label: "Левая строка 1",   key: "left_title"     },
                { label: "Левая строка 2",   key: "left_subtitle"  },
                { label: "Правая строка",    key: "right_executor" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block mb-1 font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    value={(ps as any)[key]}
                    onChange={(e) => setPs({ ...ps, [key]: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 bg-white py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 "
                  />
                </div>
              ))}

              <div className="text-center pt-2">
                <button
                  onClick={savePrintSettings}
                  disabled={psSaving}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60
                             text-white rounded-lg shadow transition"
                >
                  {psSaving ? "Сохраняю…" : "Сохранить"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsersPage;
