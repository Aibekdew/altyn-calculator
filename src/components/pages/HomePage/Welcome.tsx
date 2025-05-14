"use client";
import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── animation preset ──────────────────────────────────── */
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

/* ─── option lists (добавляйте пункты здесь) ─────────────── */
const K1_OPTIONS = [
  { value: "1.0", label: "г.Бишкек" },
  { value: "0.8", label: "г.Ош" },
  { value: "0.8", label: "Чуйская область" },
  { value: "0.8", label: "Таласская область" },
  { value: "0.8", label: "Иссык-Кульская область" },
  { value: "0.8", label: "Иссык-Кульская область(курортная зона)" },
  { value: "0.8", label: "Нарынская область" },
  { value: "0.8", label: "Ошская область" },
  { value: "0.8", label: "Джалал-Абадская область" },
  { value: "0.8", label: "Баткенская область" },
];

const K2_OPTIONS = [
  { value: "1.0", label: "удовлетворительное – требуется капитальный ремонт" },
  {
    value: "0.9",
    label: "удовлетворительное – требуется косметический ремонт",
  },
  { value: "0.9", label: "хорошее (не требуется ремонт)" },
];

const K3_OPTIONS = [
  {
    value: "1.3",
    label: "наличие водопровода, горячей воды, центрального отопления",
  },
  { value: "1.1", label: "наличие водопровода, центрального отопления" },
  { value: "1.1", label: "наличие водопровода" },
  { value: "1.1", label: "техническое обустройство отсутствует" },
];

const K4_OPTIONS = [
  { value: "1.0", label: "Ресторан" },
  { value: "1.2", label: "Кафе" },
  { value: "1.2", label: "Гостиница" },
  { value: "1.2", label: "Бильярд" },
  { value: "1.2", label: "Сауна" },
  { value: "1.2", label: "Бассейн" },
  { value: "1.2", label: "Баня" },
  { value: "1.2", label: "Обменный пункт" },
  { value: "1.2", label: "Ломбард" },
  { value: "1.2", label: "Банковские услуги" },
  { value: "1.2", label: "Выездная касса" },
  { value: "1.2", label: "Авиакасса" },
  { value: "1.2", label: "Пункт приема платежей" },
  { value: "1.2", label: "Размещение рекламы" },
  { value: "1.2", label: "Установка антенн" },
  { value: "1.2", label: "Оборудования для телекоммуникаций" },
  { value: "1.2", label: "Швейных цех" },
  { value: "1.2", label: "Производство" },
  { value: "1.2", label: "Производственные услуги" },
  { value: "1.2", label: "Магазин" },
  { value: "1.2", label: "Ларек" },
  { value: "1.2", label: "Торговая точка" },
  { value: "1.2", label: "Буфет" },
  { value: "1.2", label: "Столовая аптека" },
  { value: "1.2", label: "Спортивно-оздоровительные услуги" },
  { value: "1.2", label: "Кинотеатр" },
  { value: "1.2", label: "Офис" },
  { value: "1.2", label: "Склад" },
  { value: "1.2", label: "Химчистка" },
  { value: "1.2", label: "Ремонт обуви" },
  { value: "1.2", label: "Парикмахерская" },
  { value: "1.2", label: "Салон красоты" },
  { value: "1.2", label: "Реставрация одежды" },
  { value: "1.2", label: "Салон для новобрачных" },
  { value: "1.2", label: "Компьютерные услуги и ремонт компьютерной техники" },
  { value: "1.2", label: "Копировальные услуги" },
  { value: "1.2", label: "Фото услуги" },
  { value: "1.2", label: "Помещения" },
  {
    value: "1.2",
    label: "Сооружения для ремонта и технического обслуживания автотранспорта",
  },
  { value: "1.2", label: "Автостоянка" },
  { value: "1.2", label: "Гараж" },
  { value: "1.2", label: "Автозаправочные станции" },
  { value: "1.2", label: "Медицинские услуги" },
  { value: "1.2", label: "Фитобар" },
  { value: "1.2", label: "Учебные центры" },
  { value: "1.2", label: "Разное" },
];

const COMMERCIAL_USE_OPTIONS = [
  {
    value: "0.9",
    label:
      "магазины, киоски, ларьки и другие учреждения торговли (площадью до 10 кв.метра) ",
  },
  {
    value: "0.9",
    label:
      "магазины, киоски, ларьки и другие учреждения торговли (площадью от 10 до 20 кв.метра)",
  },
  {
    value: "0.9",
    label:
      "магазины, киоски, ларьки и другие учреждения торговли (площадью от 20 до 35 кв.метра) ",
  },
  {
    value: "0.9",
    label:
      "магазины, киоски, ларьки и другие учреждения торговли (площадью от 35 до 50 кв.метра) ",
  },
  {
    value: "0.9",
    label:
      "магазины, киоски, ларьки и другие учреждения торговли (площадью от 50 кв.метра и выше) ",
  },
  {
    value: "0.9",
    label: "мини-рынки, рынки, торгово-рыночные комплексы ",
  },
  {
    value: "0.9",
    label: "скотные, фуражные рынки ",
  },
  {
    value: "0.9",
    label: "предприятия общественного питания ",
  },
  {
    value: "0.9",
    label: "предприятия гостиничной деятельности ",
  },
  {
    value: "0.9",
    label: "банки, ломбарды, обменные пункты",
  },
  {
    value: "0.9",
    label: "предприятия игорной деятельности и дискотеки",
  },
  {
    value: "0.9",
    label: "офисы, бизнес-центры, биржи ",
  },
  {
    value: "0.9",
    label: "автозаправочные станции ",
  },
  {
    value: "0.9",
    label: "нефтебазы ",
  },
  {
    value: "0.9",
    label: "автостоянки, предприятия автосервиса ",
  },
  {
    value: "0.9",
    label: "сооружения рекламы",
  },
  {
    value: "0.9",
    label: "",
  },
];

/* ─── helpers / constants ────────────────────────────────── */
const numericFields = ["areaObject", "areaLand", "areaBuilding"] as const;

const baseFieldClass =
  "w-full h-10 bg-white border rounded-md px-3 text-gray-900 placeholder-gray-400 transition-colors appearance-none focus:outline-none focus:ring-2";

/* ─── component ──────────────────────────────────────────── */
const Welcome: FC = () => {
  /* state */
  const [form, setForm] = useState({
    k1: "",
    k2: "",
    k3: "",
    k4: "",
    areaObject: "",
    areaLand: "",
    areaBuilding: "",
    commercialUse: "",
    streetAccess: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<null | {
    cost: string;
    rows: { label: string; value: string }[];
  }>(null);

  /* ─── validation ───────────────────────────────────────── */
  const validateField = (
    field: (typeof numericFields)[number],
    value: string,
    silent = false
  ) => {
    let m = "";
    if (!value.trim()) m = "Заполните поле";
    else if (isNaN(Number(value)) || Number(value) <= 0)
      m = "Введите положительное число";
    if (!silent) setErrors((p) => ({ ...p, [field]: m }));
    return m === "";
  };

  const validateForm = () => {
    const newErr: Record<string, string> = {};
    numericFields.forEach((f) => {
      if (!validateField(f, (form as any)[f], true)) newErr[f] = "Ошибка";
    });
    setErrors(newErr);
    return !Object.keys(newErr).length;
  };

  /* ─── handlers ─────────────────────────────────────────── */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type } = e.target;
    const val =
      e.target instanceof HTMLInputElement && type === "checkbox"
        ? e.target.checked
        : e.target.value;
    setForm((p) => ({ ...p, [name]: val }));
    setResult(null); // очищаем предыдущий расчёт
    if (numericFields.includes(name as any))
      validateField(name as (typeof numericFields)[number], val as string);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    /* ─── ваша формула расчёта ──────────────────────────── */
    const area = parseFloat(form.areaObject || "0");
    const costNum = isFinite(area) ? area * 100 : 0;
    const cost = `${costNum.toLocaleString("ru-RU")} сом/месяц`;

    const rows = [
      { label: "Площадь объекта", value: `${form.areaObject || "—"} кв.м` },
      { label: "Площадь зем. участка", value: `${form.areaLand || "—"} кв.м` },
      { label: "Площадь здания", value: `${form.areaBuilding || "—"} кв.м` },
      { label: "K1", value: form.k1 || "—" },
      { label: "K2", value: form.k2 || "—" },
      { label: "K3", value: form.k3 || "—" },
      { label: "K4", value: form.k4 || "—" },
      {
        label: "Коммерч. использование",
        value: form.commercialUse ? `${form.commercialUse} (коэфф.)` : "—",
      },
      {
        label: "Отдельный вход",
        value: form.streetAccess ? "Да" : "Нет",
      },
    ];

    setResult({ cost, rows });
  };

  /* ─── UI helpers ──────────────────────────────────────── */
  let ai = 0;
  const nextAi = () => ai++;
  const fieldClass = (f: string) =>
    `${baseFieldClass} ${
      errors[f]
        ? "border-red-500 focus:ring-red-500"
        : "border-black focus:ring-green-600"
    }`;

  /* ─── render ─────────────────────────────────────────── */
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="bg-gray-100 py-8"
    >
      <div className="w-full max-w-7xl mx-auto px-4">
        <motion.div
          variants={fadeInUp}
          custom={nextAi()}
          className="bg-white shadow-sm rounded-lg p-6"
        >
          {/* Заголовок */}
          <motion.h2
            variants={fadeInUp}
            custom={nextAi()}
            className="text-2xl font-semibold text-gray-900"
          >
            Калькулятор аренды
          </motion.h2>
          <motion.div
            variants={fadeInUp}
            custom={nextAi()}
            className="w-16 h-1 bg-green-600 mt-2 mb-4"
          />
          <hr className="border-t border-gray-200 mb-6" />

          {/* ---------- РЕЗУЛЬТАТЫ ---------- */}
          <AnimatePresence>
            {result && (
              <motion.div
                key="result-card"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="mb-8 border rounded-lg shadow-sm overflow-hidden bg-gray-50"
              >
                <div className="px-4 py-2 bg-white flex items-center">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    Результаты расчётов
                  </h3>
                </div>

                <div className="border-t-4 border-green-600">
                  <div className="flex px-4 py-3 bg-white">
                    <span className="font-medium">Стоимость аренды</span>
                    <span className="ml-auto font-bold text-green-600">
                      {result.cost}
                    </span>
                  </div>

                  {result.rows.map((r, i) => (
                    <div
                      key={r.label}
                      className={`flex px-4 py-2 text-sm ${
                        i % 2 ? "bg-gray-100" : "bg-gray-50"
                      }`}
                    >
                      <span className="w-1/2 text-gray-700">{r.label}</span>
                      <span className="w-1/2 text-gray-900">{r.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ---------- ФОРМА ---------- */}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Левая колонка (select-поля) */}
              <div className="flex flex-col gap-6 w-full lg:w-1/2">
                {[
                  {
                    id: "k1",
                    label: "Населённый пункт (K1)",
                    options: K1_OPTIONS,
                  },
                  {
                    id: "k2",
                    label: "Тех. состояние (K2)",
                    options: K2_OPTIONS,
                  },
                  {
                    id: "k3",
                    label: "Тех. обустройство (K3)",
                    options: K3_OPTIONS,
                  },
                  { id: "k4", label: "Цель аренды (K4)", options: K4_OPTIONS },
                ].map(({ id, label, options }) => (
                  <motion.div
                    key={id}
                    variants={fadeInUp}
                    custom={nextAi()}
                    className="transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <label htmlFor={id} className="block mb-1 text-blue-600">
                      {label}
                    </label>
                    <select
                      id={id}
                      name={id}
                      value={(form as any)[id]}
                      onChange={handleChange}
                      className={fieldClass(id)}
                    >
                      <option value="">выберите из списка</option>

                      {options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                ))}
              </div>

              {/* Правая колонка (числовые inputs + commercialUse) */}
              <div className="flex flex-col gap-6 w-full lg:w-1/2">
                {[
                  {
                    id: "areaObject",
                    label: "Площадь арендуемого объекта (кв.м)",
                  },
                  {
                    id: "areaLand",
                    label: "Площадь земельного участка (кв.м)",
                  },
                  { id: "areaBuilding", label: "Площадь здания (кв.м)" },
                ].map(({ id, label }) => (
                  <motion.div
                    key={id}
                    variants={fadeInUp}
                    custom={nextAi()}
                    className="transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <label htmlFor={id} className="block mb-1 text-blue-600">
                      {label}
                    </label>
                    <input
                      type="text"
                      id={id}
                      name={id}
                      value={(form as any)[id]}
                      onChange={handleChange}
                      placeholder="Введите число"
                      className={fieldClass(id)}
                    />
                    {errors[id] && (
                      <p className="text-red-600 text-sm mt-1">{errors[id]}</p>
                    )}
                  </motion.div>
                ))}

                {/* commercialUse */}
                <motion.div
                  variants={fadeInUp}
                  custom={nextAi()}
                  className="transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <label
                    htmlFor="commercialUse"
                    className="block mb-1 text-blue-600"
                  >
                    Коммерческое использование земли
                  </label>
                  <select
                    id="commercialUse"
                    name="commercialUse"
                    value={form.commercialUse}
                    onChange={handleChange}
                    className={fieldClass("commercialUse")}
                  >
                    <option value="">выберите из списка</option>
                    {COMMERCIAL_USE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </motion.div>
              </div>
            </div>

            {/* streetAccess */}
            <motion.div
              variants={fadeInUp}
              custom={nextAi()}
              className="mt-4 flex items-center transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <input
                id="streetAccess"
                type="checkbox"
                name="streetAccess"
                checked={form.streetAccess}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 border-black rounded focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors"
              />
              <label htmlFor="streetAccess" className="ml-2 text-gray-800">
                Объект расположен вдоль улицы и имеет отдельный вход/выход
              </label>
            </motion.div>

            {/* button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={fadeInUp}
              custom={nextAi()}
              type="submit"
              className="mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
            >
              Рассчитать стоимость аренды
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Welcome;
