"use client";
import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* =============================================================
   CONSTANTS – styles that reproduce the look & feel of the mockup
   ============================================================= */
const bgGradient =
  "bg-gradient-to-br from-[#0A2D8F] via-[#0038B8] to-[#148CFF]";

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
  "hover:from-[#4062ff] hover:to-[#7a3dff] rounded-2xl px-10 py-4 shadow-2xl transition-transform " +
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
  landUse: string;
  kInflation: string;
}

type KOption = { value: string; label: string };

export const K1_OPTIONS: KOption[] = [
  { value: "1.0", label: "г.Бишкек" },
  { value: "1.0", label: "Иссык-Куль (курортная зона)" },
  { value: "0.9", label: "г.Ош" },
  { value: "0.8", label: "Ошская область" },
  { value: "0.8", label: "Чуйская область" },
  { value: "0.8", label: "Таласская область" },
  { value: "0.8", label: "Иссык-Кульская область" },
  { value: "0.8", label: "Нарынская область" },
  { value: "0.8", label: "Джалал‑Абадская область" },
  { value: "0.8", label: "Баткенская область" },
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
  1.2: ["Автостоянка"],
  1.0: ["Склад", "Производство", "Производственные услуги", "Разное"],
};

export const K4_OPTIONS: KOption[] = Object.entries(K4_GROUPS).flatMap(
  ([value, labels]) => labels.map((label) => ({ value, label }))
);

/* -------------------------------------------------------------
   EXTRA coefficient options (Kп)
   ------------------------------------------------------------- */
const KP_ITEMS: [string, number][] = [
  ["магазины, киоски, лавки и другие учреждения' (до 10 м²)", 1.0],
  ["магазины, киоски, лавки и другие учреждения' (10‑20 м²)", 1.05],
  ["магазины, киоски, лавки и другие учреждения' (20‑35 м²)", 1.1],
  ["магазины, киоски, лавки и другие учреждения' (35‑50 м²)", 1.15],
  ["магазины, киоски, лавки и другие учреждения' (от 50 м² и выше)", 1.2],
  ["мини‑рынки, рынки, торгово‑рыночные комплексы", 1.3],
  ["скотные, фуражные рынки", 1.2],
  ["предприятия общественного питания", 1.1],
  ["предприятия гостиничной деятельности", 1.2],
  ["банки, ломбарды, обменные пункты", 1.2],
  ["предприятия игорной деятельности и дискотеки", 1.5],
  ["офисы, бизнес‑центры, биржи", 1.1],
  ["автозаправочные станции", 1.2],
  ["нефтебазы", 1.3],
  ["автостоянки, предприятия автосервиса", 1.2],
  ["сооружения рекламы", 1.1],
];

export const COMMERCIAL_USE_OPTIONS: KOption[] = KP_ITEMS.map(([label, v]) => ({
  label,
  value: v.toString(),
}));

/* fields we validate as numbers */
const numericFields = [
  "areaObject",
  "areaLand",
  "landHC",
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
  landHC2: "",
  landTaxRate: "",
  landUse: "",
  kInflation: "1",
};

/* =============================================================
   COMPONENT
   ============================================================= */
const Welcome: FC = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<null | {
    rent: number;
    landTax: number;
    total: number;
    rows: { label: string; value: string }[];
  }>(null);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

  /* ---------- calculations ---------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // — базовая ставка определяется городом/районом (K1)
    const baseRate = 100; // демонстрационное значение, оставляем логику прежней

    const k1 = parseFloat(form.k1 || "1");
    const k2 = parseFloat(form.k2 || "1");
    const k3 = parseFloat(form.k3 || "1");

    const k4Base = parseFloat(form.k4 || "1");
    const k4 = k4Base + (form.streetAccess && form.k4 ? 0.1 : 0);

    const areaObject = parseFloat(form.areaObject || "0");
    const rent = baseRate * areaObject * k1 * k2 * k3 * k4;

    const areaLand = parseFloat(form.areaLand || "0");
    const landHC = parseFloat(form.landHC || "0");
    const landTaxRate = parseFloat(form.landTaxRate || "0");
    const landUseCoeff = parseFloat(form.landUse || "1");

    const kInflation = parseFloat(form.kInflation || "1");
    const Nz =
      areaLand && landHC && landTaxRate
        ? (landHC * landUseCoeff * kInflation * areaLand * landTaxRate) / 12
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
        label: "Aз(формула)",
        value: `(${form.landTaxRate}*${form.landHC}*${form.kInflation}*${landUseCoeff})/12`,
      },
      { label: "Aз", value: fmt(Nz) },
      { label: "Площадь объекта", value: `${form.areaObject || "—"} м²` },
      { label: "K1", value: form.k1 || "—" },
      { label: "K2", value: form.k2 || "—" },
      { label: "K3", value: form.k3 || "—" },
      { label: "K4 (c надбавкой)", value: k4.toFixed(2) },
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
    <section className={containerOuter}>
      {/* ---------- WAVE DECORATION ---------- */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 opacity-40">
        <svg
          viewBox="0 0 1440 200"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 100 Q360 0 720 100 T1440 100 V200 H0 Z"
            fill="none"
            stroke="#00A3FF"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
          <path
            d="M0 150 Q360 50 720 150 T1440 150"
            fill="none"
            stroke="#00A3FF"
            strokeWidth="1"
            strokeOpacity="0.4"
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
          <div className={glassPanel}>
            {[
              { id: "k1", label: "Населённый пункт (КН)", options: K1_OPTIONS },
              { id: "k2", label: "Тех. состояние (КТ)", options: K2_OPTIONS },
              { id: "k3", label: "Категория земель (К)", options: K3_OPTIONS },
              { id: "k4", label: "Цель аренды (КЦ)", options: K4_OPTIONS },
            ].map(({ id, label, options }) => (
              <motion.div
                key={id}
                variants={fadeInUp}
                custom={nextAi()}
                className="relative"
              >
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
            ))}

            {/* checkbox */}
            <motion.div
              variants={fadeInUp}
              custom={nextAi()}
              className="flex items-center"
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

            {/* NS (налоговая стоимость) – two aligned inputs */}
            <motion.div variants={fadeInUp} custom={nextAi()}>
              <label
                htmlFor="landHC"
                className="block mb-1 text-[#0A2D8F] font-medium"
              >
                NS (налоговая стоимость м², сом)
              </label>
              <div className="flex gap-3">
                <input
                  style={{
                    width: "80%",
                  }}
                  type="number"
                  id="landHC"
                  name="landHC"
                  value={form.landHC}
                  onChange={handleChange}
                  placeholder="Введите число"
                  className={fieldClass("landHC") + " flex-1"}
                />
                <input
                  style={{
                    width: "20%",
                  }}
                  type="text"
                  id="landHC2"
                  name="landHC2"
                  value={form.landHC2}
                  onChange={handleChange}
                  placeholder="..."
                  className={fieldClass("landHC2") + " w-28"}
                />
              </div>
              {errors.landHC && (
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
            <motion.div variants={fadeInUp} custom={nextAi()}>
              <label
                htmlFor="landUse"
                className="block mb-1 text-[#0A2D8F] font-medium"
              >
                Коэффициент (K) (учёт, назначение участка)
              </label>
              <select
                id="landUse"
                name="landUse"
                value={form.landUse}
                onChange={handleChange}
                className={selectBase}
              >
                {COMMERCIAL_USE_OPTIONS.map((o, idx) => (
                  <option key={`${o.value}-${idx}`} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
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
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
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
