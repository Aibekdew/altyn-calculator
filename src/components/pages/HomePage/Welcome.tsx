"use client";
import { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiCheck, FiX } from "react-icons/fi"; // +++
import useLandHC2 from "@/hooks/useLandHC2";
import React, { Fragment } from "react";

/* =============================================================
   CONSTANTS – styles that reproduce the look & feel of the mockup
   ============================================================= */
const bgGradient =
  "bg-gradient-to-br bg-cover bg-fixed via-[#0038B8] to-[#148CFF]";
const containerOuter = `relative min-h-screen flex flex-col justify-start lg:justify-center px-4 lg:px-8 py-8 ${bgGradient}`;

/* translucent white cards */
const glassPanel =
  "bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col gap-6";

/* inputs / selects */
const inputBase =
  "w-full px-4 py-3 rounded-xl bg-white shadow-inner text-gray-900 placeholder-gray-400 " +
  "border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 outline-none";

const selectBase = inputBase + " appearance-none pr-10 cursor-pointer";

/* primary CTA button */
const buttonMain =
  "mt-8 inline-block text-lg font-bold text-white bg-gradient-to-r from-[#4F71FF] to-[#894BFF] " +
  "hover:from-[#4062ff]  hover:to-[#7a3dff] rounded-2xl px-10 py-4 shadow-2xl transition-transform " +
  "hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300/60";

/* -------------------------------------------------------------
   ANIMATION VARIANTS
   ------------------------------------------------------------- */
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.45, ease: "easeOut" },
  }),
} as const;
const slideUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: 50, transition: { duration: 0.3, ease: "easeIn" } },
} as const;
/* =============================================================
   TYPES & DATA
   ============================================================= */
type StringKeys =
  | "k1"
  | "k2"
  | "k3"
  | "k4"
  | "areaObject"
  | "areaLand"
  | "landHC"
  | "landHC2"
  | "landTaxRate"
  | "landUse";

interface FormState {
  [key: string]: string | boolean;
  k1: string;
  k2: string;
  k3: string;
  k4: string;
  areaObject: string;
  areaLand: string;
  streetAccess: boolean;
  landHC: string;
  landHC2: string; // *** extra small field next to landHC ***
  landTaxRate: string;
  areaBuilding: string; // ← Площадь здания (новое)
  k1zone: string; // ← зона Бишкека
  landUse: string;
  kInflation: string;
}

type ValCoeff = { value: string; label: string; coeff: number };
type KOption = { value: string; label: string };

export const K1_OPTIONS: ValCoeff[] = [
  { value: "bishkek", label: "г. Бишкек", coeff: 1.0 },
  { value: "issyk_kul", label: "Иссык-Куль (курортная зона)", coeff: 1.2 },
  { value: "osh_city", label: "г. Ош", coeff: 0.9 },
  { value: "osh_region", label: "Ошская область", coeff: 0.8 },
  { value: "chui", label: "Чуйская область", coeff: 0.8 },
  { value: "talas", label: "Таласская область", coeff: 0.8 },
  { value: "issyk_kul_reg", label: "Иссык-Кульская область", coeff: 0.8 },
  { value: "naryn", label: "Нарынская область", coeff: 0.8 },
  { value: "jalal_abad", label: "Джалал-Абадская область", coeff: 0.8 },
  { value: "batken", label: "Баткенская область", coeff: 0.8 },
];

export const K2_OPTIONS: KOption[] = [
  { value: "1.0", label: "удовлетворительное – требуется капитальный ремонт" },
  {
    value: "1.1",
    label: "удовлетворительное – требуется косметический ремонт",
  },
  { value: "1.2", label: "хорошее (не требуется ремонт)" },
];

export const K3_OPTIONS: KOption[] = [
  {
    value: "1.3",
    label: "наличие водопровода, горячей воды, центрального отопления",
  },
  { value: "1.2", label: "наличие водопровода, центрального отопления" },
  { value: "1.1", label: "наличие водопровода" },
  { value: "1.0", label: "техническое обустройство отсутствует" },
];

const K4_GROUPS: Record<number, string[]> = {
  2.5: ["Платёжные терминалы", "Банкоматы"],
  1.7: [
    "Ресторан",
    "Кафе",
    "Гостиница",
    "Ночной клуб",
    "Бильярд",
    "Сауна",
    "Бассейн",
    "Баня",
    "Обменный пункт",
    "Ломбард",
    "Банковские услуги",
    "Выездная касса",
    "Авиакасса",
    "Пункт приема платежей",
  ],
  1.6: [
    "Размещение рекламы",
    "Установка антенн",
    "Оборудования для телекоммуникаций",
    "Швейный цех",
    "Магазин",
    "Ларёк",
    "Торговая точка",
    "Буфет",
    "Салон красоты",
    "Парикмахерская",
    "Реставрация одежды",
    "Салон для новобрачных",
    "Компьютерные услуги и ремонт компьютерной техники",
    "Копировальные услуги",
    "Фото‑услуги",
  ],
  1.5: ["Сооружения для ремонта и тех. обслуживания автотранспорта", "Гараж"],
  1.4: ["Офис", "Кинотеатр", "Помещения"],
  1.3: ["Химчистка", "Ремонт обуви"],
  1.2: ["Автостоянка", "Склад"], // ← добавили сюда
  1.0: ["Производство", "Производственные услуги", "Разное"],
};

export const K4_OPTIONS: ValCoeff[] = Object.entries(K4_GROUPS).flatMap(
  ([num, labels]) =>
    labels.map((label, idx) => ({
      value: `${num}_${idx}`, // уникальный id
      label,
      coeff: Number(num),
    }))
);

const KP_ITEMS: [string, number][] = [
  //  Торговля по площади
  ["магазины, киоски, ларьки и другие учреждения торговли (до 10 м²)", 22.5],
  ["магазины, киоски, ларьки и другие учреждения торговли (10 – 20 м²)", 16.5],
  ["магазины, киоски, ларьки и другие учреждения торговли (20 – 35 м²)", 10.5],
  ["магазины, киоски, ларьки и другие учреждения торговли (35 – 50 м²)", 7.5],
  [
    "магазины, киоски, ларьки и другие учреждения торговли (от 50 м² и выше)",
    6.0,
  ],

  //  Рынки
  ["мини-рынки, рынки, торгово-рыночные комплексы", 7.5],
  ["скотные, фуражные рынки", 4.5],

  //  Сфера услуг
  ["предприятия общественного питания", 3.0],
  ["предприятия гостиничной деятельности", 7.0],
  ["банки, ломбарды, обменные пункты", 5.0],
  ["предприятия игорной деятельности и дискотеки", 7.0],
  ["офисы, бизнес-центры, биржи", 2.5],

  //  Транспорт / логистика / топливо
  ["автозаправочные станции", 10.0],
  ["нефтебазы", 1.5],
  ["автостоянки, предприятия автосервиса", 4.5],
  [
    "административные здания предприятий транспорта (аэро-, авто-, ж/д вокзалы)",
    0.9,
  ],

  //  Реклама
  ["сооружения рекламы", 50.0],

  //  Прочее коммерческое использование
  [
    "предприятия сферы отдыха и развлечений, спортивно-оздоровительных услуг",
    1.5,
  ],
  [
    "предприятия промышленности, транспорта, строительства, связи и энергетики",
    0.5,
  ],
  [
    "здания и сооружения горнодобывающих предприятий, грузовые станции и т.п.",
    0.3,
  ],
  ["разрабатываемые месторождения, карьеры, шахты, разрезы, золоотвалы", 0.05],
  [
    "геологоразведочные, проектно-изыскательские и исследовательские работы",
    0.005,
  ],
  ["воздушные линии связи и электропередачи", 0.01],
  ["учреждения науки, образования, здравоохранения, культуры, ДЮСШ", 0.3],
  ["сельскохозяйственные производственные здания и сооружения", 0.2],
  ["оборонно-спортивно-технические организации", 0.01],
];

/* fields we validate as numbers */
const numericFields = [
  "areaObject",
  "areaLand",
  "areaBuilding", // ▪ добавили
  "landHC",
  "landHC2",
  "landTaxRate",
  "kInflation",
] as const;

const initialForm: FormState = {
  k1: "",
  k2: "",
  k3: "",
  k4: "",
  areaObject: "",
  areaLand: "",
  streetAccess: false,
  landHC: "",
  landHC2: "1", // ← было ""  ➜  ставим "1" по умолчанию
  landTaxRate: "",
  areaBuilding: "",
  k1zone: "",
  landUse: "",
  kInflation: "1",
};
const BASE_RATE_BY_K1: Record<string, number> = {
  bishkek: 100,
  issyk_kul: 100,
  osh_city: 90,
  /* остальные области по 80 */
  osh_region: 80,
  chui: 80,
  talas: 80,
  issyk_kul_reg: 80,
  naryn: 80,
  jalal_abad: 80,
  batken: 80,
};
/* ---- БАЗОВАЯ НАЛОГОВАЯ СТОИМОСТЬ 1 м² (НС) и К-коэфф. по НК ---- */
/*  Значения взяты из ст. 399 НК КР и методики ГНС (2024 г.)        */
const NS_BY_K1: Record<string, { ns: number; hc2: number }> = {
  bishkek: { ns: 150, hc2: 1.0 }, // столица
  osh_city: { ns: 150, hc2: 1.0 }, // крупный город
  issyk_kul: { ns: 100, hc2: 1.2 }, // курортная зона
  issyk_kul_reg: { ns: 50, hc2: 1.0 }, // прочая часть области
  chui: { ns: 100, hc2: 1.0 },
  osh_region: { ns: 50, hc2: 0.9 },
  talas: { ns: 50, hc2: 0.4 },
  naryn: { ns: 50, hc2: 0.4 },
  jalal_abad: { ns: 100, hc2: 0.6 },
  batken: { ns: 50, hc2: 0.3 },
};

/* =============================================================
   COMPONENT
   ============================================================= */
interface KpOption {
  value: string;
  label: string;
  coeff: number;
}
/* ───── добавьте рядом с K-справочниками ───── */
const BISHKEK_ZONE_OPTIONS: ValCoeff[] = [
  {
    value: "zone1",
    label: "границы ул.Боконбаева, Суюмбаева, Фрунзе, пр.Манаса, Боконбаева",
    coeff: 1.3,
  },
  {
    value: "zone2",
    label:
      "пр.Мира, ул.Ахунбаева, ул.Шабдан-Баатыра, ул.Курманжан Датка, пр.Жибек-Жолу, ул.Фучика, ул.Московская, ул.Некрасова.ю ул.Л.Толстого, пр.Мира",
    coeff: 1.2,
  },
  { value: "zone3", label: "остальные районы г.Бишкек", coeff: 1.1 },
];

export const COMMERCIAL_USE_OPTIONS: KpOption[] = KP_ITEMS.map(
  ([label, coeff]) => ({
    label, // что видит пользователь
    value: label, // используем само название как стабильный id
    coeff, // числовое значение Кк
  })
);
const Welcome: FC = () => {
  const { value: backendHC2, loading: hc2Loading, persist } = useLandHC2();
  useEffect(() => {
    if (!hc2Loading) {
      setForm((p) => ({ ...p, landHC2: backendHC2 }));
      setDraftHC2(backendHC2);
    }
  }, [hc2Loading, backendHC2]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<null | {
    rent: number;
    landTax: number;
    total: number;
    rows: { label: string; value: string }[];
  }>(null);
  const [isEditingHC2, setIsEditingHC2] = useState(false); // флаг «режим редактирования»
  const [draftHC2, setDraftHC2] = useState(form.landHC2);
  /* ---------- validation helpers ---------- */
  const validateField = (
    field: (typeof numericFields)[number],
    value: string,
    silent = false
  ): boolean => {
    let msg = "";
    if (!value.trim()) msg = "Заполните поле";
    else if (isNaN(Number(value))) msg = "Введите число";

    if (!silent) setErrors((p) => ({ ...p, [field]: msg }));
    return msg === "";
  };

  const validateForm = () => {
    const newErr: Record<string, string> = {};
    numericFields.forEach((f) => {
      if (!validateField(f, String(form[f]), true))
        newErr[f] = !String(form[f]).trim()
          ? "Заполните поле"
          : "Введите число";
    });
    setErrors(newErr);
    return !Object.keys(newErr).length;
  };

  // ─── handleChange ──────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name as keyof FormState;
    const val =
      e.target instanceof HTMLInputElement && e.target.type === "checkbox"
        ? e.target.checked
        : e.target.value;

    /* ---------- 1. k1   (населённый пункт) ---------------------------- */
    if (name === "k1" && typeof val === "string") {
      const preset = NS_BY_K1[val]; // базовая НС и коэффициент НК
      setForm((prev) => ({
        ...prev,
        k1: val, // обязательно сохраняем выбор!
        landHC: preset ? String(preset.ns) : prev.landHC,
        landHC2: preset ? String(preset.hc2) : prev.landHC2,
      }));
      if (preset) {
        setDraftHC2(String(preset.hc2)); // обновляем маленький инпут
        setErrors((p) => ({ ...p, landHC: "", landHC2: "" }));
      }
    } else {
      /* ---------- 2. все остальные поля --------------------------------- */
      setForm((prev) => ({ ...prev, [name]: val }));
    }

    /* ---------- 3. побочные действия ---------------------------------- */
    setResult(null);
    if (numericFields.includes(name as any))
      validateField(name as (typeof numericFields)[number], String(val));
  };

  /* ---------- calculations ---------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const baseRate = BASE_RATE_BY_K1[form.k1] ?? 100;
    const k1 =
      form.k1 === "bishkek"
        ? (BISHKEK_ZONE_OPTIONS.find((o) => o.value === form.k1zone)?.coeff ??
          1)
        : (K1_OPTIONS.find((o) => o.value === form.k1)?.coeff ?? 1);
    const k2 = parseFloat(form.k2 || "1");
    const k3 = parseFloat(form.k3 || "1");
    const k4Base = K4_OPTIONS.find((o) => o.value === form.k4)?.coeff ?? 1;

    const k4 = form.streetAccess ? Math.max(k4Base - 0.2, 1) : k4Base;

    const areaObject = parseFloat(form.areaObject || "0");
    const rent = baseRate * areaObject * k1 * k2 * k3 * k4;
    const areaLand = parseFloat(form.areaLand || "0");
    const landHC2Coeff = parseFloat(form.landHC2 || "1"); // новый множитель

    const landHC = parseFloat(form.landHC || "0");
    const landHC2 = form.landHC2; // ← теперь эта переменная существует
    const landTaxRate = parseFloat(form.landTaxRate || "0");
    const landUseCoeff =
      COMMERCIAL_USE_OPTIONS.find((o) => o.value === form.landUse)?.coeff ?? 1;

    const kInflation = parseFloat(form.kInflation || "1");
    const Nz =
      areaObject && landTaxRate
        ? (landTaxRate *
            areaObject *
            kInflation *
            landHC2Coeff *
            landUseCoeff) /
          12
        : 0;
    const total = rent + Nz;

    const fmt = (v: number) =>
      v
        ? `${v.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} сом`
        : "—";

    const rows = [
      { label: "Формула", value: "A.пл = Баз.ст*S*K1*K2*K3*K4 + Aз" },
      {
        label: "Формула",
        value: `${baseRate}*${areaObject}*${k1}*${k2}*${k3}*${k4.toFixed(
          2
        )} + ${Nz.toFixed(2)}`,
      },
      {
        label: "Aз (формула)",
        value: `(${landTaxRate} × ${landHC} × ${landHC2} × ${kInflation} × ${landUseCoeff}) / 12`,
      },
      { label: "Aз", value: fmt(Nz) },
      { label: "Площадь объекта", value: `${form.areaObject || "—"} м²` },
      {
        label: "K1",
        value:
          K1_OPTIONS.find((o) => o.value === form.k1)?.label.replace(
            /^г\.\s*/,
            "Г. "
          ) ?? "—",
      },
      { label: "K2", value: form.k2 || "—" },
      { label: "K3", value: form.k3 || "—" },
      { label: "K4 (с учётом входа)", value: k4.toFixed(2) },
      { label: "Площадь здания", value: `${form.areaBuilding || "—"} м²` },
      { label: "Аренда здания", value: fmt(rent) },
      { label: "Земельный налог (месяц)", value: fmt(Nz) },
    ];

    setResult({ rent, landTax: Nz, total, rows });
  };

  const fieldClass = (f: string) =>
    `${inputBase} ${
      errors[f] ? "border-red-500 focus:ring-red-400/60" : "border-transparent"
    }`;

  /* tiny counter for staggering animations */
  let ai = 0;
  const nextAi = () => ai++;

  /* ===========================================================
     RENDER
     =========================================================== */
  return (
    <section
      className={containerOuter}
      style={{ backgroundImage: "url('./image/background.jpg')" }}
    >
      {/* ---------- WAVE DECORATION ---------- */}
      <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {/* ---------- FORM ---------- */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="w-full max-w-7xl mx-auto"
      >
        <motion.form
          variants={fadeInUp}
          custom={nextAi()}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8"
        >
          {/* ===== LEFT COLUMN ===== */}
          <div className={glassPanel + " lg:h-full"}>
            <div className="flex flex-col gap-6 flex-1">
              {" "}
              {/* ➋ flex-1 – тянется */}
              {[
                // объединяем всё в один map
                {
                  id: "k1",
                  label: "Населённый пункт (КН)",
                  options: K1_OPTIONS,
                },
                {
                  id: "k2",
                  label: "Техническое состояние помещения (К2)",
                  options: K2_OPTIONS,
                },
                {
                  id: "k3",
                  label: "Техническое обустройство здания (К3)",
                  options: K3_OPTIONS,
                },
                { id: "k4", label: "Цель аренды (К4)", options: K4_OPTIONS },
              ].map(({ id, label, options }) => (
                <Fragment key={id}>
                  {/* сам селект */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    custom={nextAi()}
                    className="relative"
                  >
                    {" "}
                    <label
                      htmlFor={id}
                      className="block mb-1 text-[#0A2D8F] font-medium"
                    >
                      {label}
                    </label>
                    <select
                      id={id}
                      name={id}
                      value={String(form[id])}
                      onChange={handleChange}
                      className={selectBase}
                    >
                      <option value="">выберите из списка</option>
                      {options.map((o, i) => (
                        <option key={`${o.value}-${i}`} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </motion.div>
                  {/* если это k1 и выбрана «bishkek» — сразу под ним вставляем селект зоны */}
                  {id === "k1" && form.k1 === "bishkek" && (
                    <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    custom={nextAi()}
                    className="relative"
                    >
                      <label
                        htmlFor="k1zone"
                        className="block mb-1 text-[#0A2D8F] font-medium"
                      >
                        Местоположение объекта (зоны г.Бишкек)
                      </label>
                      <select
                        id="k1zone"
                        name="k1zone"
                        value={form.k1zone}
                        onChange={handleChange}
                        className={selectBase}
                      >
                        <option value="">выберите из списка</option>
                        {BISHKEK_ZONE_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </Fragment>
              ))}
              <motion.div
                variants={fadeInUp}
                custom={nextAi()}
                className="flex items-center pt-4 border-t border-white/40"
              >
                <input
                  id="streetAccess"
                  type="checkbox"
                  name="streetAccess"
                  checked={form.streetAccess}
                  onChange={handleChange}
                  className="h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-300"
                />
                <label
                  htmlFor="streetAccess"
                  className="ml-2 text-gray-900 font-medium"
                >
                  Объект имеет отдельный вход/выход вдоль улицы
                </label>
              </motion.div>
            </div>
          </div>

          {/* ===== RIGHT COLUMN ===== */}
          <div className={glassPanel}>
            {[
              { id: "areaObject", label: "Площадь арендуемого объекта (S)" },
              { id: "areaLand", label: "Площадь земельного участка (S)" },
            ].map(({ id, label }) => (
              <motion.div key={id} variants={fadeInUp} custom={nextAi()}>
                <label
                  htmlFor={id}
                  className="block mb-1 text-[#0A2D8F] font-medium"
                >
                  {label}
                </label>
                <input
                  type="text"
                  id={id}
                  name={id}
                  value={String(form[id])}
                  onChange={handleChange}
                  placeholder="Введите число"
                  className={fieldClass(id)}
                />
                {errors[id] && (
                  <p className="text-red-500 text-sm mt-1">{errors[id]}</p>
                )}
              </motion.div>
            ))}
            {/* в правой колонке добавьте сразу после areaObject */}
            <motion.div variants={fadeInUp} custom={nextAi()}>
              <label
                htmlFor="areaBuilding"
                className="block mb-1 text-[#0A2D8F] font-medium"
              >
                Площадь здания (Sз)
              </label>
              <input
                type="text"
                id="areaBuilding"
                name="areaBuilding"
                value={form.areaBuilding}
                onChange={handleChange}
                placeholder="Введите число"
                className={fieldClass("areaBuilding")}
              />
              {errors.areaBuilding && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.areaBuilding}
                </p>
              )}
            </motion.div>

            {/* NS (налоговая стоимость) – two aligned inputs */}
            {/* NS (налоговая стоимость) – two aligned inputs */}
            <motion.div variants={fadeInUp} custom={nextAi()}>
              <label
                htmlFor="landHC"
                className="block mb-1 text-[#0A2D8F] font-medium"
              >
                NS (налоговая стоимость м², сом)
              </label>

              <div className="flex gap-3 items-start">
                {/* --- Первый (основной) инпут остаётся как был --- */}
                <input
                  style={{ width: "80%" }}
                  type="text"
                  id="landHC"
                  name="landHC"
                  value={form.landHC}
                  onChange={handleChange}
                  placeholder="авто после выбора КН"
                  className={fieldClass("landHC") + " flex-1"}
                />

                {/* --- Второй инпут + кнопки --- */}
                <div className="flex items-center gap-2">
                  <input
                    style={{ width: "6rem" }}
                    type="text"
                    id="landHC2"
                    name="landHC2"
                    value={isEditingHC2 ? draftHC2 : form.landHC2}
                    onChange={(e) =>
                      isEditingHC2 && setDraftHC2(e.target.value)
                    }
                    readOnly={!isEditingHC2}
                    placeholder="..."
                    className={fieldClass("landHC2")}
                  />

                  {/* Кнопки управления */}
                  {!isEditingHC2 ? (
                    /* ✏  ВКЛЮЧИТЬ редактирование */
                    <button
                      type="button"
                      onClick={() => {
                        setDraftHC2(form.landHC2); // заполняем черновик
                        setIsEditingHC2(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Изменить"
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                  ) : (
                    <>
                      {/* ✔  СОХРАНИТЬ */}
                      <button
                        type="button"
                        onClick={async () => {
                          if (!/^\d+(\.\d+)?$/.test(draftHC2)) {
                            setErrors((p) => ({
                              ...p,
                              landHC2: "Только число",
                            }));
                            return;
                          }
                          await persist(draftHC2); // PATCH → backend
                          setForm((p) => ({ ...p, landHC2: draftHC2 }));
                          setIsEditingHC2(false);
                        }}
                        className="text-green-600 hover:text-green-800 transition"
                        title="Сохранить"
                      >
                        <FiCheck className="w-5 h-5" />
                      </button>
                      {/* ✖  ОТМЕНА */}
                      <button
                        type="button"
                        onClick={() => {
                          setDraftHC2(form.landHC2); // откат
                          setIsEditingHC2(false);
                          setErrors((p) => ({ ...p, landHC2: "" }));
                        }}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Отмена"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {errors.landHC && (
                <p className="text-red-500 text-sm mt-1">{errors.landHC}</p>
              )}
              {errors.landHC2 && (
                <p className="text-red-500 text-sm mt-1">{errors.landHC}</p>
              )}
            </motion.div>

            {/* C (ставка налога) */}
            <motion.div variants={fadeInUp} custom={nextAi()}>
              <label
                htmlFor="landTaxRate"
                className="block mb-1 text-[#0A2D8F] font-medium"
              >
                C (ставка налога, коэффициент)
              </label>
              <input
                type="text"
                id="landTaxRate"
                name="landTaxRate"
                value={form.landTaxRate}
                onChange={handleChange}
                placeholder="Введите число"
                className={fieldClass("landTaxRate")}
              />
              {errors.landTaxRate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.landTaxRate}
                </p>
              )}
            </motion.div>

            {/* land use coefficient */}
            <motion.div
              className="relative"
              variants={fadeInUp}
              custom={nextAi()}
            >
              <label
                htmlFor="landUse"
                className="block mb-1 text-[#0A2D8F] font-medium"
              >
                Коммерческое использование земли
              </label>
              <select
                id="landUse"
                name="landUse"
                value={form.landUse}
                onChange={handleChange}
                className={selectBase}
              >
                <option value="">выберите из списка</option> {/* NEW */}
                {COMMERCIAL_USE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* submit */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={fadeInUp}
            custom={nextAi()}
            type="submit"
            className={`${buttonMain} lg:col-span-2 self-center`}
          >
            Рассчитать стоимость аренды
          </motion.button>
        </motion.form>

        {/* ---------- RESULT ---------- */}
        <AnimatePresence>
          {result && (
            <motion.div
              key="result"
              variants={slideUp} // ← здесь
              initial="hidden" // ← вместо inline initial
              animate="visible" // ← вместо inline animate
              exit="exit" // ← вместо inline exit
              className="mt-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Заголовок над таблицей */}
              <div className="px-6 py-4">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Результаты расчётов
                </h3>
              </div>

              {/* Собственно таблица */}
              <div className="border-t-4 border-green-500">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-4 text-left font-medium">
                        Стоимость аренды
                      </th>
                      <th className="p-4 text-right text-green-600 text-xl font-bold">
                        {result.total.toLocaleString("ru-RU", {
                          maximumFractionDigits: 2,
                        })}{" "}
                        сом/месяц
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {result.rows.map((r, i) => (
                      <tr key={i} className={i % 2 ? "bg-gray-50" : ""}>
                        <td className="p-4 text-gray-700">{r.label}</td>
                        <td className="p-4 text-right text-gray-900">
                          {r.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Welcome;
