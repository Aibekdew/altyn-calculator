"use client";
import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ───── анимация ─────────────────────────────────────────── */
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};
// тип ключей, значения которых строковые
type StringKeys =
  | "k1"
  | "k2"
  | "k3"
  | "k4"
  | "areaObject"
  | "areaLand"
  | "landHC"
  | "landTaxRate"
  | "landUse";

// полное состояние формы
// Убрать `extends Record<…>`
interface FormState {
  // <-- Вот это добавляем
  [key: string]: string | boolean;

  k1: string;
  k2: string;
  k3: string;
  k4: string;

  areaObject: string;
  areaLand: string;

  streetAccess: boolean;

  landHC: string;
  landTaxRate: string;
  landUse: string;
}

/* ───── справочники ──────────────────────────────────────── */
type KOption = { value: string; label: string };

type K1Option = KOption & { baseRate: number };  
export const K1_OPTIONS: K1Option[] = [
  { value: "1.0", label: "г.Бишкек", baseRate: 100 },
  { value: "1.0", label: "Иссык-Куль (курортная зона)", baseRate: 100 },
  { value: "0.9", label: "г.Ош", baseRate: 90 },
  { value: "0.9", label: "Ошская область", baseRate: 80 },
  { value: "0.9", label: "Чуйская область", baseRate: 80 },
  { value: "0.9", label: "Таласская область", baseRate: 80 },
  { value: "0.9", label: "Иссык-Кульская область", baseRate: 80 },
  { value: "0.9", label: "Нарынская область", baseRate: 80 },
  { value: "0.9", label: "Джалал-Абадская область", baseRate: 80 },
  { value: "0.9", label: "Баткенская область", baseRate: 80 },
];

export const K2_OPTIONS: KOption[] = [
  { value: "1.0", label: "удовлетворительное – требуется капитальный ремонт" },
  { value: "1.1", label: "удовлетворительное – требуется косметический ремонт" },
  { value: "1.2", label: "хорошее (не требуется ремонт)" },
];

export const K3_OPTIONS: KOption[] = [
  { value: "1.3", label: "наличие водопровода, горячей воды, центрального отопления" },
  { value: "1.2", label: "наличие водопровода, центрального отопления" },
  { value: "1.1", label: "наличие водопровода" },
  { value: "1.0", label: "техническое обустройство отсутствует" },
];

const K4_GROUPS: Record<number, string[]> = {
  2.5: ["Платёжные терминалы", "Банкоматы"],

  1.7: [
    "Ресторан", "Кафе", "Гостиница", "Ночной клуб",
    "Бильярд", "Сауна", "Бассейн", "Баня",
    "Обменный пункт", "Ломбард", "Банковские услуги",
    "Выездная касса", "Авиакасса", "Пункт приема платежей"
  ],

  1.6: [
    "Размещение рекламы", "Установка антенн", "Оборудования для телекоммуникаций",
    "Швейных цех", "Магазин", "Ларек", "Торговая точка", "Буфет",
    "Салон красоты", "Парикмахерская", "Реставрация одежды",
    "Салон для новобрачных",
    "Компьютерные услуги и ремонт компьютерной техники",
    "Копировальные услуги", "Фото услуги"
  ],

  1.5: [
    "Сооружения для ремонта и технического обслуживания автотранспорта",
    "Гараж"
  ],

  1.4: ["Офис", "Кинотеатр", "Помещения"],

  1.3: ["Химчистка", "Ремонт обуви"],

  1.2: ["Автостоянка"],           // отдельный коэффициент

  1.0: [
    "Склад", "Производство", "Производственные услуги", "Разное"
  ],
};

export const K4_OPTIONS: KOption[] = Object.entries(K4_GROUPS).flatMap(
  ([value, labels]) => labels.map((label) => ({ value, label }))
);

/* ─── Kп: функциональное назначение земли ──────────────── */
const KP_ITEMS: [string, number][] = [
  [
    "магазины, киоски, ларьки и другие учреждения торговли (до 10 м²)",
    1.00,
  ],
  [
    "магазины, киоски, ларьки и другие учреждения торговли (10-20 м²)",
    1.05,
  ],
  [
    "магазины, киоски, ларьки и другие учреждения торговли (20-35 м²)",
    1.10,
  ],
  [
    "магазины, киоски, ларьки и другие учреждения торговли (35-50 м²)",
    1.15,
  ],
  [
    "магазины, киоски, ларьки и другие учреждения торговли (от 50 м² и выше)",
    1.20,
  ],
  ["мини-рынки, рынки, торгово-рыночные комплексы", 1.30],
  ["скотные, фуражные рынки", 1.20],
  ["предприятия общественного питания", 1.10],
  ["предприятия гостиничной деятельности", 1.20],
  ["банки, ломбарды, обменные пункты", 1.20],
  ["предприятия игорной деятельности и дискотеки", 1.50],
  ["офисы, бизнес-центры, биржи", 1.10],
  ["автозаправочные станции", 1.20],
  ["нефтебазы", 1.30],
  ["автостоянки, предприятия автосервиса", 1.20],
  ["сооружения рекламы", 1.10],
];

export const COMMERCIAL_USE_OPTIONS: KOption[] = KP_ITEMS.map(
  ([label, value]) => ({ label, value: value.toString() })
);

/* ───── общие утилиты ─────────────────────────────────────── */
const numericFields = [
  "areaObject",
  "areaLand",
  "landHC",
  "landTaxRate",
] as const;

const baseFieldClass =
  "w-full h-10 bg-white border rounded-md px-3 text-gray-900 placeholder-gray-400 transition-colors appearance-none focus:outline-none focus:ring-2";
const initialForm: FormState = {
  k1: "",
  k2: "",
  k3: "",
  k4: "",
  areaObject: "",
  areaLand: "",
  streetAccess: false,
  landHC: "",
  landTaxRate: "",
  landUse: "",
};
/* ───── главный компонент ────────────────────────────────── */
const Welcome: FC = () => {
  /* состояние формы */
  const [form, setForm] = useState<FormState>(initialForm);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<null | {
    rent: number;
    landTax: number;
    total: number;
    rows: { label: string; value: string }[];
  }>(null);

  /* ── валидация ─────────────────────────────────────────── */
  const validateField = (
    field: (typeof numericFields)[number],
    value: string,
    silent = false
  ) => {
    let m = "";
    if (value.trim()) {
      if (isNaN(Number(value)) || Number(value) < 0) m = "Некорректное число";
    }
    if (!silent) setErrors((p) => ({ ...p, [field]: m }));
    return m === "";
  };

  const validateForm = () => {
    const newErr: Record<string, string> = {};
    numericFields.forEach((f) => {
      if (!validateField(f, (form as any)[f], true))
        newErr[f] = "Введите число";
    });
    setErrors(newErr);
    return !Object.keys(newErr).length;
  };

  /* ── обработчики ───────────────────────────────────────── */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    // <-- приведение типа
    const name = e.target.name as keyof FormState;
    const val =
      e.target instanceof HTMLInputElement && e.target.type === "checkbox"
        ? e.target.checked
        : e.target.value;

    setForm((p) => ({ ...p, [name]: val }));
    setResult(null);

    if (numericFields.includes(name as any))
      validateField(name as (typeof numericFields)[number], val as string);
  };

  /* ── расчёт ────────────────────────────────────────────── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    /* ---- подготовка коэффициентов ---- */
    const k1Obj = K1_OPTIONS.find((o) => o.value === form.k1);
    const baseRate = k1Obj?.baseRate ?? 0;
    const k1 = parseFloat(form.k1 || "1");
    const k2 = parseFloat(form.k2 || "1");
    const k3 = parseFloat(form.k3 || "1");
    const k4Base = parseFloat(form.k4 || "1");

    const k4 = k4Base + (form.streetAccess && form.k4 ? 0.1 : 0); // надбавка за отдельный вход

    const areaObject = parseFloat(form.areaObject || "0");

    /* ---- аренда здания ---- */
    const rent = baseRate * areaObject * k1 * k2 * k3 * k4;

    /* ---- земельный налог Nz ---- */
    const areaLand = parseFloat(form.areaLand || "0");
    const landHC = parseFloat(form.landHC || "0"); // НС
    const landTaxRate = parseFloat(form.landTaxRate || "0"); // C
    const landUseCoeff = parseFloat(form.landUse || "1"); // Kп

    const Nz =
      areaLand && landHC && landTaxRate
        ? (landHC * landUseCoeff * areaLand * landTaxRate) / 12
        : 0;

    /* ---- суммарно ---- */
    const total = rent + Nz;

    /* ---- оформляем результат ---- */
    const fmt = (v: number) =>
      v
        ? `${v.toLocaleString("ru-RU", {
            maximumFractionDigits: 2,
          })} сом`
        : "—";

    const rows = [
      {
        label: "Базовая ставка (сом/м²)",
        value: baseRate ? baseRate.toString() : "—",
      },
      {
        label: "Площадь объекта",
        value: fmt(areaObject) + " / " + form.areaObject + " м²",
      },
      { label: "K1", value: form.k1 || "—" },
      { label: "K2", value: form.k2 || "—" },
      { label: "K3", value: form.k3 || "—" },
      { label: "K4 (с надбавкой)", value: k4.toFixed(2) },
      { label: "Аренда здания", value: fmt(rent) },
      { label: "Площадь земли", value: form.areaLand || "—" },
      { label: "НС (налого-стоимость)", value: form.landHC || "—" },
      { label: "C (ставка налога)", value: form.landTaxRate || "—" },
      { label: "Kп (коммерч. исп.)", value: form.landUse || "1" },
      { label: "Земельный налог (месяц)", value: fmt(Nz) },
    ];

    setResult({ rent, landTax: Nz, total, rows });
  };

  /* ── helpers для стилей ───────────────────────────────── */
  const fieldClass = (f: string) =>
    `${baseFieldClass} ${
      errors[f]
        ? "border-red-500 focus:ring-red-500"
        : "border-black focus:ring-green-600"
    }`;

  let ai = 0;
  const nextAi = () => ai++;

  /* ── render ───────────────────────────────────────────── */
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
          <motion.h2
            variants={fadeInUp}
            custom={nextAi()}
            className="text-2xl font-semibold text-gray-900"
          >
            Калькулятор арендной платы
          </motion.h2>

          {/* ---------- РЕЗУЛЬТАТЫ ---------- */}
          <AnimatePresence>
            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="mt-6 mb-8 border rounded-lg shadow-sm overflow-hidden bg-gray-50"
              >
                <div className="px-4 py-2 bg-white flex items-center">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    Итог
                  </h3>
                </div>

                <div className="border-t-4 border-green-600">
                  <div className="flex px-4 py-3 bg-white">
                    <span className="font-medium">Всего в месяц</span>
                    <span className="ml-auto font-bold text-green-600">
                      {result.total.toLocaleString("ru-RU", {
                        maximumFractionDigits: 2,
                      })}{" "}
                      сом
                    </span>
                  </div>

                  {result.rows.map((r, i) => (
                    <div
                      key={i}
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
              {/* левая колонка */}
              <div className="flex flex-col gap-6 w-full lg:w-1/2">
                {/* K1-K4 */}
                {(
                  [
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
                    {
                      id: "k4",
                      label: "Цель аренды (K4)",
                      options: K4_OPTIONS,
                    },
                  ] as { id: StringKeys; label: string; options: KOption[] }[]
                ).map(({ id, label, options }) => (
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
                      id={`${id}`}
                      name={`${id}`}
                      value={String(form[id])}
                      onChange={handleChange}
                      className={fieldClass(id)}
                    >
                      <option value="">выберите…</option>
                      {options.map((o, idx) => (
                        <option key={`${o.value}-${idx}`} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                ))}
              </div>

              {/* правая колонка */}
              <div className="flex flex-col gap-6 w-full lg:w-1/2">
                {/* площади */}
                {[
                  {
                    id: "areaObject",
                    label: "Площадь арендуемого объекта (м²)",
                  },
                  {
                    id: "areaLand",
                    label: "Площадь земельного участка (м²)",
                  },
                ].map(({ id, label }) => (
                  <motion.div
                    key={id}
                    variants={fadeInUp}
                    custom={nextAi()}
                    className="transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <label
                      htmlFor={`${id}`}
                      className="block mb-1 text-blue-600"
                    >
                      {label}
                    </label>
                    <input
                      type="text"
                      id={String(id)}
                      name={String(id)}
                      value={String(form[id])}
                      onChange={handleChange}
                      placeholder="Число"
                      className={fieldClass(id)}
                    />
                    {errors[id] && (
                      <p className="text-red-600 text-sm mt-1">{errors[id]}</p>
                    )}
                  </motion.div>
                ))}

                {/* земля: НС и ставка */}
                {[
                  {
                    id: "landHC",
                    label: "НС (налого-стоимость 1 м² земли), сом",
                  },
                  {
                    id: "landTaxRate",
                    label: "С (ставка налога, коэф.)",
                  },
                ].map(({ id, label }) => (
                  <motion.div
                    key={id}
                    variants={fadeInUp}
                    custom={nextAi()}
                    className="transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <label
                      htmlFor={`${id}`}
                      className="block mb-1 text-blue-600"
                    >
                      {label}
                    </label>
                    <input
                      type="text"
                      id={`${id}`}
                      name={`${id}`}
                      value={String(form[id])}
                      onChange={handleChange}
                      placeholder="Число"
                      className={fieldClass(id)}
                    />
                    {errors[id] && (
                      <p className="text-red-600 text-sm mt-1">{errors[id]}</p>
                    )}
                  </motion.div>
                ))}

                {/* Kп – коммерч. использование */}
                <motion.div
                  variants={fadeInUp}
                  custom={nextAi()}
                  className="transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <label htmlFor="landUse" className="block mb-1 text-blue-600">
                    Коэффициент Kп (функц. назначение земли)
                  </label>
                  <select
                    id="landUse"
                    name="landUse"
                    value={form.landUse}
                    onChange={handleChange}
                    className={fieldClass("landUse")}
                  >
{COMMERCIAL_USE_OPTIONS.map((o, idx) => (
  <option key={`${o.value}-${idx}`} value={o.value}>
    {o.label}
  </option>
))}
                  </select>
                </motion.div>
              </div>
            </div>

            {/* отдельный вход */}
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
                Объект имеет отдельный вход/выход вдоль улицы
              </label>
            </motion.div>

            {/* кнопка */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={fadeInUp}
              custom={nextAi()}
              type="submit"
              className="mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-green-600 transition-all"
            >
              Рассчитать
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Welcome;
