"use client";
import { FC, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiCheck, FiX } from "react-icons/fi"; // +++
import useLandHC2 from "@/hooks/useLandHC2";
import React, { Fragment } from "react";
import { usePrintData } from "@/providers/PrintProvider";
import PrintSheet from "@/components/Print/PrintSheet";
import type { CalcResult } from "@/types/calc-result";
import {
  useAnimation,
  MotionValue,
  animate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Check } from "lucide-react";
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
  | "landUse"
  | "nds"
  | "nsp";

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
  nds: string; // ← новое
  nsp: string; // ← новое
  profit: string; // ← НОВОЕ
  affiliate: string;
  objectName: string;
  popBand: string;
  defC: string;
  defKp: string;
  defKn: string;
  wallMaterial: string; // выбранный материал
  wallServiceLife: string; // выбранный срок эксплуатации
  wallBaseCost: string;
}
type ValCoeff = { value: string; label: string; coeff: number };
type Affiliate = { value: string; label: string };
const SORT_BY_LABEL = <T extends { label: string }>(arr: T[]) =>
  arr.slice().sort((a, b) => a.label.localeCompare(b.label, "ru"));

export const K1_OPTIONS = SORT_BY_LABEL([
  { value: "batken", label: "Баткенская область", coeff: 1 },
  { value: "bishkek", label: "г. Бишкек", coeff: 0 },
  { value: "chui", label: "Чуйская область", coeff: 1 },
  { value: "issyk_kul", label: "Иссык-Куль (курортная зона)", coeff: 1.2 },
  { value: "issyk_kul_reg", label: "Иссык-Кульская область", coeff: 1 },
  { value: "jalal_abad", label: "Джалал-Абадская область", coeff: 1 },
  { value: "naryn", label: "Нарынская область", coeff: 1 },
  { value: "osh_city", label: "г. Ош", coeff: 1.1 },
  { value: "osh_region", label: "Ошская область", coeff: 1 },
  { value: "talas", label: "Таласская область", coeff: 1 },
]);

export const K2_OPTIONS = SORT_BY_LABEL([
  {
    value: "1.1",
    label: "удовлетворительное – требуется косметический ремонт",
  },
  { value: "1", label: "удовлетворительное – требуется капитальный ремонт" },
  { value: "1.2", label: "хорошее (не требуется ремонт)" },
]);

export const K3_OPTIONS = SORT_BY_LABEL([
  { value: "1", label: "техническое обустройство отсутствует" },
  { value: "1.2", label: "наличие водопровода, центрального отопления" },
  { value: "1.1", label: "наличие водопровода" },
  {
    value: "1.3",
    label: "наличие водопровода, горячей воды, центрального отопления",
  },
]);

const K4_GROUPS: Record<number, string[]> = {
  2.5: ["Платёжные терминалы", "Банкоматы"],
  1.7: [
    "Авиакасса",
    "Выездная касса",
    "Гостиница",
    "Кафе",
    "Ломбард",
    "Ночной клуб",
    "Обменный пункт",
    "Пункт приема платежей",
    "Ресторан",
    "Сауна",
    "Бассейн",
    "Банковские услуги",
    "Бильярд",
    "Баня",
  ],
  1.6: [
    "Буфет",
    "Компьютерные услуги и ремонт компьютерной техники",
    "Копировальные услуги",
    "Ларёк",
    "Магазин",
    "Оборудования для телекоммуникаций",
    "Размещение рекламы",
    "Реставрация одежды",
    "Салон красоты",
    "Салон для новобрачных",
    "Фото-услуги",
    "Швейный цех",
    "Торговая точка",
    "Установка антенн",
  ],
  1.5: ["Гараж", "Сооружения для ремонта и тех. обслуживания автотранспорта"],
  1.4: ["Кинотеатр", "Офис", "Помещения"],
  1.3: ["Химчистка", "Ремонт обуви"],
  1.2: ["Автостоянка", "Склад"],
  1: ["Производство", "Производственные услуги", "Разное"],
};

// в начале файла, рядом с K4_OPTIONS и COMMERCIAL_USE_OPTIONS
export const KN_FUNCTIONAL_OPTIONS: ValCoeff[] = [
  {
    value: "hotels_lombards_exchange",
    label: "Гостиницы, ломбарды, обменные пункты",
    coeff: 1.6,
  },
  {
    value: "residential_on_resort_territory",
    label:
      "Жилые здания и помещения, расположенные на территории курортно-оздоровительных учреждений",
    coeff: 1.5,
  },
  {
    value: "gas_stations",
    label: "Автозаправочные станции",
    coeff: 1.5,
  },
  {
    value: "mini_markets",
    label:
      "Мини-рынки, рынки, торгово-рыночные центры, комплексы, торговые центры",
    coeff: 1.6,
  },
  {
    value: "public_catering_retail_services",
    label: "Объекты имущества общественного питания, торговли, сферы услуг",
    coeff: 1.0,
  },
  {
    value: "rail_and_bus_terminals",
    label:
      "Железнодорожные вокзалы и автовокзалы, автостоянки, грузовые станции железнодорожного транспорта",
    coeff: 0.8,
  },
  {
    value: "administrative_offices",
    label:
      "Административные, офисные здания, бизнес-центры, банки, а также капитальные строения или помещения некоммерческих организаций",
    coeff: 0.6,
  },
  {
    value: "transport_service_energy",
    label:
      "Объекты имущества предприятий транспорта, предприятий автосервиса, связи и энергетики",
    coeff: 0.5,
  },
  {
    value: "defense_sport_technical",
    label: "Оборонно-спортивно-технические объекты имущества",
    coeff: 0.3,
  },
  {
    value: "agricultural_production_buildings",
    label: "Сельскохозяйственные производственные здания",
    coeff: 0.3,
  },
  {
    value: "sanatoriums_pensions",
    label: "Санатории, пансионаты, дома отдыха",
    coeff: 0.8,
  },
];

/* плоский массив + алфавитная сортировка --------------------------- */
export const K4_OPTIONS: ValCoeff[] = Object.entries(K4_GROUPS)
  .flatMap(([num, labels]) =>
    labels.map((label, idx) => ({
      value: `${num}_${idx}`, // уникальный ID сохранён
      label,
      coeff: Number(num),
    }))
  )
  .sort((a, b) => a.label.localeCompare(b.label, "ru")); // <- алфавит

/* ------------------------------------------------------------------ */
/* 2.  КОЭФФ. КОММЕРЧЕСКОГО ИСПОЛЬЗОВАНИЯ ЗЕМЛИ (landUse)             */
/* ------------------------------------------------------------------ */
const KP_ITEMS: [string, number][] = [
  /* значения не меняли — просто оставили как есть */
  ["автозаправочные станции", 10.0],
  ["автостоянки, предприятия автосервиса", 4.5],
  [
    "административные здания предприятий транспорта (аэро-, авто-, ж/д вокзалы)",
    0.9,
  ],
  ["банки, ломбарды, обменные пункты", 5.0],
  ["воздушные линии связи и электропередачи", 0.01],
  [
    "геологоразведочные, проектно-изыскательские и исследовательские работы",
    0.005,
  ],
  [
    "здания и сооружения горнодобывающих предприятий, грузовые станции и т.п.",
    0.3,
  ],
  ["мини-рынки, рынки, торгово-рыночные комплексы", 7.5],
  ["нефтебазы", 1.5],
  ["оборонно-спортивно-технические организации", 0.01],
  ["офисы, бизнес-центры, биржи", 2.5],
  ["предприятия гостиничной деятельности", 7.0],
  ["предприятия игорной деятельности и дискотеки", 7.0],
  ["предприятия общественного питания", 3.0],
  [
    "предприятия промышленности, транспорта, строительства, связи и энергетики",
    0.5,
  ],
  [
    "предприятия сферы отдыха и развлечений, спортивно-оздоровительных услуг",
    1.5,
  ],
  ["разрабатываемые месторождения, карьеры, шахты, разрезы, золоотвалы", 0.05],
  ["сооружения рекламы", 50.0],
  ["сельскохозяйственные производственные здания и сооружения", 0.2],
  ["скотные, фуражные рынки", 4.5],
  ["учреждения науки, образования, здравоохранения, культуры, ДЮСШ", 0.3],
  ["магазины, киоски, ларьки и другие учреждения торговли (до 10 м²)", 22.5],
  ["магазины, киоски, ларьки и другие учреждения торговли (10 – 20 м²)", 16.5],
  ["магазины, киоски, ларьки и другие учреждения торговли (20 – 35 м²)", 10.5],
  ["магазины, киоски, ларьки и другие учреждения торговли (35 – 50 м²)", 7.5],
  [
    "магазины, киоски, ларьки и другие учреждения торговли (от 50 м² и выше)",
    6.0,
  ],
];
export const AFFILIATE_BRANCHES: Affiliate[] = [
  { value: "makmal", label: "Комбинат «Макмалзолото»" },
  { value: "solton", label: "Рудник «Солтон-Сары»" },
  { value: "tereksay", label: "«Терексайский рудник»" },
  { value: "affinage", label: "«Аффинажный завод»" },
  { value: "autotrans", label: "«Автотранспортное предприятие»" },
  { value: "kg_kyuluu", label: "«Кыргызалтын – Курулуш»" },
  { value: "kyrgyz_sea_resort", label: "Санаторий «Кыргызское Взморье»" },
];

/* ─── дочерние предприятия ─── */
export const AFFILIATE_SUBSIDIARIES: Affiliate[] = [
  { value: "kumtor", label: "ЗАО «Кумтор Голд Компани»" },
  { value: "makmal_gold", label: "ОсОО «Макмал Голд Компани»" },
  {
    value: "karabalta_gok",
    label: "ОсОО «Карабалтинский Горнорудный Комбинат»",
  },
  { value: "chakyl", label: "ОсОО «Чакуш»" },
  { value: "minteke", label: "ОсОО «Минтеке»" },
  { value: "balajan", label: "ОсОО «Балажан»" },
  { value: "orol_too", label: "ОсОО «Орол-Тоо»" },
  { value: "shiber_too", label: "ОсОО «Шибер-Тоо»" },
  { value: "karakala_terek", label: "ОсОО «Каракала-Терек»" },
  { value: "chekchey", label: "ОсОО «Чекчей»" },
  { value: "altyn_logistic", label: "ОсОО «Алтын-Логистик»" },
  { value: "cnil", label: "ОсОО «ЦНИЛ»" },
  { value: "mate", label: "ОсОО «МАТЭ»" },
];

/* плоский список (нужен для поиска label по value в PrintSheet) */
export const AFFILIATE_OPTIONS: Affiliate[] = [
  ...AFFILIATE_BRANCHES,
  ...AFFILIATE_SUBSIDIARIES,
];
/* fields we validate as numbers */
const numericFields = [
  "areaObject",
  "areaLand",
  "landHC",
  "landHC2",
  "landTaxRate",
  "kInflation",
  "nds",
  "nsp",
  "profit",
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
  kInflation: "1.108",
  nds: "0", // ← «по умолчанию 0 %»
  nsp: "0",
  profit: "",
  affiliate: "",
  objectName: "",
  popBand: "",
  defC: "",
  defKp: "",
  defKn: "",
  wallMaterial: "",
  wallServiceLife: "",
  wallBaseCost: "",
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

const getBandsForRegion = (region: string) =>
  POP_BANDS.filter(
    (b) =>
      NS_BY_REGION_POP[region]?.[
        b.value as keyof (typeof NS_BY_REGION_POP)[string]
      ] !== undefined
  );

/** БНС (сом/м²) по регионам и диапазонам численности населения
 *  источник — ст. 404 НК КР (ред. 2023) */

/** Калк санынын диапазондору */
export const POP_BANDS = [
  { value: "p5", label: "0 – 5 миң" },
  { value: "p10", label: "5 – 10 миң" },
  { value: "p20", label: "10 – 20 миң" },
  { value: "p50", label: "20 – 50 миң" },
  { value: "p100", label: "50 – 100 миң" },
  { value: "p200", label: "100 – 200 миң" },
  { value: "p500", label: "200 – 500 миң" },
  { value: "p500+", label: "500 миң ↑" },
] as const;

/** БНС (сом/м²) – регион + диапазон */
export const NS_BY_REGION_POP: Record<
  string, // region value
  Partial<Record<(typeof POP_BANDS)[number]["value"], number>>
> = {
  batken: { p5: 90, p10: 140, p20: 150, p50: 170, p100: 170 },
  jalal_abad: { p5: 120, p10: 160, p20: 180, p50: 200, p100: 210, p200: 240 },
  issyk_kul: { p5: 120, p10: 160, p20: 180, p50: 200, p100: 210 },
  naryn: { p5: 100, p10: 140, p20: 160, p50: 170, p100: 180 },
  osh_region: {
    p5: 130,
    p10: 160,
    p20: 180,
    p50: 200,
    p100: 230,
    p200: 240,
    p500: 260,
  },
  talas: { p5: 110, p10: 150, p20: 170, p50: 190 },
  chui: {
    p5: 120,
    p10: 160,
    p20: 180,
    p50: 200,
    p100: 230,
    p200: 240,
    p500: 290,
  },
  bishkek: {
    p5: 120,
    p10: 160,
    p20: 180,
    p50: 200,
    p100: 230,
    p200: 240,
    p500: 290,
  },
  osh_city: {
    p5: 130,
    p10: 160,
    p20: 180,
    p50: 200,
    p100: 230,
    p200: 240,
    p500: 260,
  },
};

/* =============================================================
   COMPONENT
   ============================================================= */
interface KpOption {
  value: string;
  label: string;
  coeff: number;
}

interface LifeOption {
  label: string;
  coeff: number;
}
interface RegionalOption {
  label: string;
  coeff: number;
}
interface RegionalGroup {
  region: string;
  options: RegionalOption[];
}
// 1. Объявляем список ставок налога (ст. 379 НК КР)
interface RateOption {
  label: string;
  coeff: number;
}

const C_RATE_OPTIONS: RateOption[] = [
  { label: "Жилые здания и помещения", coeff: 0.35 },
  { label: "Нежилые здания, сооружения и помещения", coeff: 0.8 },
  { label: "Земельные участки, кроме сельскохозяйственных угодий", coeff: 1 },
  { label: "Сельскохозяйственные угодья", coeff: 0.01 },
  {
    label:
      "Транспортные средства с двигателем внутреннего сгорания (установленный объем)",
    coeff: 1,
  },
  {
    label:
      "Транспортные средства без установленного объема или без двигателя внутреннего сгорания",
    coeff: 0.5,
  },
];

const REGIONAL_KP_OPTIONS: RegionalGroup[] = [
  {
    region: "Баткенская область",
    options: [
      { label: "Баткенский район", coeff: 0.2 },
      { label: "Лейлекский район", coeff: 0.2 },
      { label: "Кадамжайский район", coeff: 0.2 },
      { label: "город Кызыл-Кия", coeff: 0.1 },
      { label: "город Сулюкта", coeff: 0.1 },
    ],
  },
  {
    region: "Джалал-Абадская область",
    options: [
      { label: "Ноокенский район", coeff: 0.2 },
      { label: "Базар-Коргонский район", coeff: 0.2 },
      { label: "Сузакский район", coeff: 0.3 },
      { label: "Тогуз-Тороуский район", coeff: 0.1 },
      { label: "Чаткальский район", coeff: 0.1 },
      { label: "город Джалал-Абад", coeff: 0.8 },
      { label: "город Майлуу-Суу", coeff: 0.1 },
      { label: "город Кара-Куль", coeff: 0.1 },
      { label: "город Таш-Кумыр", coeff: 0.1 },
    ],
  },
  {
    region: "Иссык-Кульская область",
    options: [
      { label: "Ак-Суйский район", coeff: 0.3 },
      { label: "Джети-Огузский район", coeff: 0.3 },
      { label: "Ыссык-Кульский район", coeff: 0.3 },
      { label: "Тонский район", coeff: 0.2 },
      { label: "Тюпский район", coeff: 0.2 },
      { label: "город Каракол", coeff: 0.6 },
      { label: "город Балыкчы", coeff: 0.3 },
    ],
  },
  {
    region: "Таласская область",
    options: [
      { label: "Манасский район", coeff: 0.1 },
      { label: "Таласский район", coeff: 0.2 },
      { label: "город Талас", coeff: 0.4 },
    ],
  },
  {
    region: "Нарынская область",
    options: [
      { label: "город Нарын", coeff: 0.3 },
      { label: "Ак-Талинский район", coeff: 0.1 },
      { label: "Ат-Башинский район", coeff: 0.1 },
      { label: "Джумгальский район", coeff: 0.1 },
      { label: "Кочкорский район", coeff: 0.2 },
      { label: "Нарынский район", coeff: 0.2 },
    ],
  },
  {
    region: "Ошская область",
    options: [
      { label: "Алайский район", coeff: 0.2 },
      { label: "Араванский район", coeff: 0.3 },
      { label: "Кара-Кульджинский район", coeff: 0.2 },
      { label: "Кара-Суйский район", coeff: 0.6 },
      { label: "Ноокатский район", coeff: 0.3 },
      { label: "Узгенский район", coeff: 0.3 },
      { label: "Чон-Алайский район", coeff: 0.1 },
      { label: "город Ош", coeff: 0.9 },
    ],
  },
  {
    region: "Чуйская область",
    options: [
      { label: "Аламудунский район", coeff: 0.8 },
      { label: "Жайылский район", coeff: 0.4 },
      { label: "Ысык-Атинский район", coeff: 0.4 },
      { label: "Кеминский район", coeff: 0.3 },
      { label: "Московский район", coeff: 0.4 },
      { label: "Панфиловский район", coeff: 0.2 },
      { label: "Сокулукский район", coeff: 0.7 },
      { label: "Чуйский район", coeff: 0.4 },
      { label: "город Токмок", coeff: 0.6 },
      { label: "город Кара-Балта", coeff: 0.6 },
    ],
  },
  {
    region: "Город Бишкек",
    options: [{ label: "город Бишкек", coeff: 1.0 }],
  },
];

/* ───── добавьте рядом с K-справочниками ───── */
const BISHKEK_ZONE_OPTIONS: ValCoeff[] = [
  {
    value: "zone1",
    label: "границы ул.Боконбаева, Суюмбаева, Фрунзе, пр.Манаса, Боконбаева",
    coeff: 1.2,
  },
  {
    value: "zone2",
    label:
      "пр.Мира, ул.Ахунбаева, ул.Шабдан-Баатыра, ул.Курманжан Датка, пр.Жибек-Жолу, ул.Фучика, ул.Московская, ул.Некрасова.ю ул.Л.Толстого, пр.Мира",
    coeff: 1.1,
  },
  { value: "zone3", label: "остальные районы г.Бишкек", coeff: 1 },
];
const buildAddress = (k1: string, k1zone: string) => {
  /* Название населённого пункта */
  const cityLabel = K1_OPTIONS.find((o) => o.value === k1)?.label ?? ""; // "г. Бишкек"

  /* Для Бишкека добавляем зону, если она выбрана */
  if (k1 === "bishkek" && k1zone) {
    const zoneLabel =
      BISHKEK_ZONE_OPTIONS.find((o) => o.value === k1zone)?.label ?? "";
    if (zoneLabel) return `${cityLabel}, ${zoneLabel}`;
  }
  return cityLabel; // для всех остальных городов
};
export const COMMERCIAL_USE_OPTIONS: KpOption[] = KP_ITEMS.map(
  ([label, coeff]) => ({
    label, // что видит пользователь
    value: label, // используем само название как стабильный id
    coeff, // числовое значение Кк
  })
);
const Welcome: FC = () => {
  const { setData } = usePrintData();
  const { value: backendHC2, loading: hc2Loading, persist } = useLandHC2();
  useEffect(() => {
    if (!hc2Loading) {
      setForm((p) => ({ ...p, landHC2: backendHC2 }));
      setDraftHC2(backendHC2);
    }
  }, [hc2Loading, backendHC2]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CalcResult | null>(null);
  const bandsToShow = form.k1 ? getBandsForRegion(form.k1) : POP_BANDS;
  const resultRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [progressPct, setProgressPct] = useState(0); // 0‒100 %

  const barValue: MotionValue<number> = useMotionValue(0);
  const barWidth: MotionValue<string> = useTransform(barValue, (v) => `${v}%`);
  // Натыйжа даяр болгондо баракты жылма жылдырып көрсөтүү
  useEffect(() => {
    if (result && resultRef.current) {
      const OFFSET = 150; // керегине жараша ɵзгɵртɵңʏз
      const y =
        resultRef.current.getBoundingClientRect().top +
        window.pageYOffset -
        OFFSET;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  }, [result]);

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

  const WALL_LIFE_OPTIONS: Record<string, LifeOption[]> = {
    // Кирпич
    Кирпич: [
      { label: "До 5 лет", coeff: 15000 },
      { label: "5-15 лет", coeff: 14000 },
      { label: "15-30 лет", coeff: 13000 },
      { label: "30-45 лет", coeff: 12000 },
      { label: "более 45 лет", coeff: 10000 },
    ],

    // Дерево
    Дерево: [
      { label: "До 5 лет", coeff: 10000 },
      { label: "5-15 лет", coeff: 13000 },
      { label: "15-30 лет", coeff: 12000 },
      { label: "30-45 лет", coeff: 11000 },
      { label: "более 45 лет", coeff: 10000 },
    ],

    // Сборный или монолитный бетон и железобетон, бетонные блоки, пескоблок, пеноблок, пенобетон, стекло, сэндвич-панель
    "Сборный или монолитный бетон и железобетон, бетонные блоки, пескоблок, пеноблок, пенобетон, стекло, сэндвич-панель":
      [
        { label: "До 5 лет", coeff: 14000 },
        { label: "5-15 лет", coeff: 13000 },
        { label: "15-30 лет", coeff: 12000 },
        { label: "30-45 лет", coeff: 11000 },
        { label: "более 45 лет", coeff: 10000 },
      ],

    // Сырцовая глина (саман, гуняляк, скомо)
    "Сырцовая глина (саман, гуняляк, скомо)": [
      { label: "До 5 лет", coeff: 10000 },
      { label: "5-15 лет", coeff: 9000 },
      { label: "15-30 лет", coeff: 8000 },
      { label: "30-45 лет", coeff: 6000 },
      { label: "более 45 лет", coeff: 5000 },
    ],

    // Шлакоблок, полистирольный строительный блок
    "Шлакоблок, полистирольный строительный блок": [
      { label: "До 5 лет", coeff: 9000 },
      { label: "5-15 лет", coeff: 8000 },
      { label: "15-30 лет", coeff: 7000 },
      { label: "30-45 лет", coeff: 6000 },
      { label: "более 45 лет", coeff: 5000 },
    ],

    // Металл
    Металл: [{ label: "Вне зависимости от срока эксплуатации", coeff: 10000 }],

    // Прочие материалы и материалы для временных помещений
    "Прочие материалы и материалы для временных помещений": [
      { label: "Вне зависимости от срока эксплуатации", coeff: 8000 },
    ],
  };
  const validateForm = () => {
    const newErr: Record<string, string> = {};

    numericFields.forEach((f) => {
      if (!validateField(f, String(form[f]), true))
        newErr[f] = !String(form[f]).trim()
          ? "Заполните поле"
          : "Введите число";
    });

    // popBand больше не проверяем
    // if (!form.popBand) newErr.popBand = "Выберите диапазон населения";

    if (!form.affiliate) newErr.affiliate = "Выберите филиал / компанию";

    setErrors(newErr);
    return !Object.keys(newErr).length;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Если выбрали населённый пункт (k1) — подставляем макс. БНС
    if (name === "k1") {
      // Получаем все значения БНС (НС) для выбранного региона
      const regionBands = NS_BY_REGION_POP[value];
      if (regionBands) {
        // Из объекта вида { p5: 120, p10: 160, … } берём все числа и находим максимум
        const maxNs = Math.max(...Object.values(regionBands));
        // Обновляем сразу k1 и landHC
        setForm((prev) => ({
          ...prev,
          k1: value,
          landHC: maxNs.toString(),
        }));
      } else {
        // Если региона нет в словаре — просто сохраняем выбор
        setForm((prev) => ({ ...prev, k1: value }));
      }
      return;
    }

    // Старая логика для wallOption
    if (name === "wallOption") {
      const [material, life, cost] = value.split("|");
      setForm((prev) => ({
        ...prev,
        wallOption: value,
        wallMaterial: material,
        wallServiceLife: life,
        wallBaseCost: cost,
      }));
      return;
    }

    // Для всех остальных полей — просто сохраняем значение
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------- calculations ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    /* ---------- 1. вычисляем всё, как раньше ---------- */
    const baseRate = BASE_RATE_BY_K1[form.k1] ?? 100;
    const k1 =
      form.k1 === "bishkek"
        ? BISHKEK_ZONE_OPTIONS.find((o) => o.value === form.k1zone)?.coeff ?? 1
        : K1_OPTIONS.find((o) => o.value === form.k1)?.coeff ?? 1;
    const k2 = parseFloat(form.k2 || "1");
    const k3 = parseFloat(form.k3 || "1");
    const k4Base = K4_OPTIONS.find((o) => o.value === form.k4)?.coeff ?? 1;
    const k4 = form.streetAccess ? k4Base + 0.1 : k4Base;

    const areaObject = parseFloat(form.areaObject || "0");
    const areaLand = parseFloat(form.areaLand || "0");

    const landHC = parseFloat(form.landHC || "0");
    const landHC2Coeff = parseFloat(form.landHC2 || "1");
    const landTaxRate = parseFloat(form.landTaxRate || "0");
    const landUseCoeff =
      COMMERCIAL_USE_OPTIONS.find((o) => o.value === form.landUse)?.coeff ?? 1;
    const kInflation = parseFloat(form.kInflation || "1");

    const rent = baseRate * areaObject * k1 * k2 * k3 * k4;
    const nsFull = landHC * landHC2Coeff * landUseCoeff * kInflation;
    const Nz =
      areaLand && landTaxRate ? (nsFull * areaLand * landTaxRate) / 12 : 0;
    const total = rent + Nz;

    const profitPct = parseFloat(form.profit || "0");
    const subtotal = total + (total * profitPct) / 100;

    const ndsPct = parseFloat(form.nds || "0");
    const nspPct = parseFloat(form.nsp || "0");
    const ndsValue = (subtotal * ndsPct) / 100;
    const nspValue = (subtotal * nspPct) / 100;
    const grandTotal = subtotal + ndsValue + nspValue;

    const fmt = (v: number) =>
      v
        ? `${v.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} сом`
        : "—";

    const rows = [
      { label: "Формула", value: "A.пл = Баз.ст*S*K1*K2*K3*K4 + Нз" },
      {
        label: "Формула",
        value: `${baseRate}*${areaObject}*${k1}*${k2}*${k3}*${k4.toFixed(
          2
        )} + ${Nz.toFixed(2)}`,
      },
      {
        label: "Нз (формула)",
        value: `(${landTaxRate} × ${landHC} × ${form.landHC2} × ${kInflation} × ${landUseCoeff}) / 12`,
      },
      { label: "Нз", value: fmt(Nz) },
      { label: `НДС (${ndsPct} %)`, value: fmt(ndsValue) },
      { label: `НСП (${nspPct} %)`, value: fmt(nspValue) },
      { label: "Итого без налогов", value: fmt(total) },
      { label: "Итого с рентабельностью", value: fmt(subtotal) },
      { label: "Итого с налогами", value: fmt(grandTotal) },
    ];

    const description =
      "Расчёт стоимости арендной платы за пользование помещением" +
      (form.objectName ? `, ${form.objectName}` : "");

    const calc: CalcResult = {
      rent,
      landTax: Nz,
      total,
      ndsValue,
      nspValue,
      grandTotal,
      finalTotal: grandTotal,
      rows,
      affiliate: form.affiliate,
      description,
    };

    /* ---------- 2. анимируем кнопку ---------- */
    setIsSubmitting(true);
    setShowCheck(false);
    setProgressPct(0);
    barValue.set(0);

    await new Promise<void>((done) => {
      animate(barValue, 100, {
        duration: 0.9,
        ease: "easeInOut",
        onUpdate: (v) => setProgressPct(Math.round(v)),
        onComplete: done,
      });
    });

    setShowCheck(true);
    await new Promise((r) => setTimeout(r, 450));

    /* ---------- 3. вывод результата ---------- */
    setResult(calc);
    setData(calc);
    setIsSubmitting(false);
    setShowCheck(false);
    barValue.set(0);
    setProgressPct(0);
  };

  const fieldClass = (f: string) =>
    `${inputBase} ${
      errors[f] ? "border-red-500 focus:ring-red-400/60" : "border-transparent"
    }`;

  let ai = 0;
  const nextAi = () => ai++;

  return (
    <>
      {" "}
      <section
        className={`${containerOuter} print:hidden`}
        style={{ backgroundImage: "url('./image/background.jpg')" }}
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="w-full max-w-7xl mx-auto"
        >
          <motion.div
            variants={fadeInUp}
            custom={nextAi()}
            className="relative"
          >
            <label
              htmlFor="affiliate"
              className="block mb-1 text-[#0A2D8F] font-medium"
            >
              Филиал / дочернее предприятие
            </label>

            <select
              id="affiliate"
              name="affiliate"
              value={form.affiliate}
              onChange={handleChange}
              className={`${selectBase} transition-colors duration-300
    ${errors.affiliate && "border-red-500 focus:ring-red-400/60"}`}
            >
              <option value="">— выберите из списка —</option>
              <optgroup label="Управление">
                <option value="Управление ОАО « Кыргызалтын»">
                  Управление ОАО « Кыргызалтын»
                </option>
              </optgroup>
              {/* ------ Филиалы ------ */}
              <optgroup label="Филиалы">
                {AFFILIATE_BRANCHES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </optgroup>

              {/* ------ Дочерние предприятия ------ */}
              <optgroup label="Дочерние предприятия">
                {AFFILIATE_SUBSIDIARIES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            </select>
            {/* ───── Филиал / компания селектинен кийин ЖАҢЫ инпут ───── */}

            {/* стрелочка-иконка */}
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

            {/* плавное появление ошибки */}
            <AnimatePresence>
              {errors.affiliate && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-red-500 text-sm mt-1 "
                >
                  {errors.affiliate}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={nextAi()}
          >
            <label
              htmlFor="objectName"
              className="block mb-1 text-[#0A2D8F] font-medium"
            >
              Название объекта
            </label>
            <input
              id="objectName"
              name="objectName"
              type="text"
              value={form.objectName}
              onChange={handleChange}
              placeholder="Напишите адрес"
              className={fieldClass("objectName")}
            />
          </motion.div>
          <motion.form
            variants={fadeInUp}
            custom={nextAi()}
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8"
          >
            <div className={glassPanel + " lg:h-full"}>
              <div className="flex flex-col gap-6 flex-1">
                {[
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
                        {options.map((o) => {
                          // по-умолчанию: "label – value"
                          let text = `${o.label} – ${o.value}`;

                          // если это K1 или Коммерческое использование земли, и у объекта есть coeff
                          if (
                            (id === "k1" || id === "landUse") &&
                            "coeff" in o
                          ) {
                            text = `${o.label} – ${o.coeff}`;
                          }
                          // если это K4, тоже показываем coeff
                          else if (id === "k4" && "coeff" in o) {
                            text = `${o.label} – ${o.coeff}`;
                          }

                          return (
                            <option key={o.value} value={o.value}>
                              {text}
                            </option>
                          );
                        })}
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
                    {/* --- Местоположение (зоны г.Бишкек) --- */}
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
                          <option value="">выберите зону</option>
                          {BISHKEK_ZONE_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {`${o.label}            - ${o.coeff}`}
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

                {[
                  {
                    id: "areaObject",
                    label: "Площадь арендуемого объекта (S)",
                  },
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
                <motion.div variants={fadeInUp} custom={nextAi()}>
                  <label
                    htmlFor="landHC"
                    className="block mb-1 text-[#0A2D8F] font-medium"
                  >
                    БНС (налоговая стоимость м², сом)
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
                <motion.div variants={fadeInUp} custom={nextAi()}>
                  <label
                    htmlFor="kInflation"
                    className="block mb-1 text-[#0A2D8F] font-medium"
                  >
                    Ки (индекс инфляции)
                  </label>
                  <input
                    type="text"
                    id="kInflation"
                    name="kInflation"
                    value={form.kInflation} /* ← по умолчанию “1.108” */
                    onChange={handleChange}
                    placeholder="1.108"
                    className={fieldClass("kInflation")}
                  />
                  {errors.kInflation && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.kInflation}
                    </p>
                  )}
                </motion.div>

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
              {/* =====  ВЫБОР ФИЛИАЛА / КОМПАНИИ ===== */}
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
                  value={String(form.landUse)}
                  onChange={handleChange}
                  className={selectBase}
                >
                  <option value="">выберите из списка</option>
                  {COMMERCIAL_USE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {`${o.label} – ${o.coeff}`}
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
              {/* C (ставка налога) */}
              {/* === Ваш существующий блок с input для C (landTaxRate) === */}
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
              <motion.div
                variants={fadeInUp}
                custom={nextAi()}
                className="relative"
              >
                <label
                  htmlFor="defC"
                  className="block mb-1 text-[#0A2D8F] font-medium"
                >
                  C – ставка налога от налогооблагаемой стоимости объекта
                </label>
                <select
                  id="defC"
                  name="defC"
                  value={String(form.defC)}
                  onChange={handleChange}
                  className={selectBase}
                >
                  <option value="">— выберите C —</option>
                  {C_RATE_OPTIONS.map((opt) => (
                    <option key={opt.label} value={opt.coeff.toString()}>
                      {`${opt.label} – ${opt.coeff}%`}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
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

              <motion.div
                variants={fadeInUp}
                custom={nextAi()}
                className="relative"
              >
                <label
                  htmlFor="defKp"
                  className="block mb-1 text-[#0A2D8F] font-medium"
                >
                  Кр – региональный коэффициент
                </label>
                <select
                  id="defKp"
                  name="defKp"
                  value={form.defKp}
                  onChange={handleChange}
                  className={selectBase}
                >
                  <option value="">— выберите Кр —</option>
                  {REGIONAL_KP_OPTIONS.map((group) => (
                    <optgroup key={group.region} label={group.region}>
                      {group.options.map((opt) => (
                        <option key={opt.label} value={opt.coeff.toString()}>
                          {`${opt.label} – ${opt.coeff}`}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
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

              {/* ← сюда, сразу после defKp, вставляем defKn: */}
              <motion.div
                variants={fadeInUp}
                custom={nextAi()}
                className="relative"
              >
                <label
                  htmlFor="defKn"
                  className="block mb-1 text-[#0A2D8F] font-medium"
                >
                  Кн – коэффициент функционального назначения имущества
                </label>
                <select
                  id="defKn"
                  name="defKn"
                  value={form.defKn}
                  onChange={handleChange}
                  className={selectBase}
                >
                  <option value="">— выберите из списка —</option>
                  {KN_FUNCTIONAL_OPTIONS.map((o) => (
                    <option key={o.value} value={o.coeff.toString()}>
                      {`${o.label} – ${o.coeff}`}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
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
                {errors.defKn && (
                  <p className="text-red-500 text-sm mt-1">{errors.defKn}</p>
                )}
              </motion.div>
              {/* ——— Материал стен ——— */}
              {/* ——— Селект “Материал + срок + коэфф” ——— */}
              <motion.div
                variants={fadeInUp}
                custom={nextAi()}
                className="relative"
              >
                <label
                  htmlFor="wallOption"
                  className="block mb-1 text-[#0A2D8F] font-medium"
                >
                  Материал и срок эксплуатации
                </label>
                <select
                  id="wallOption"
                  name="wallOption"
                  value={String(form.wallOption)}
                  onChange={handleChange}
                  className={selectBase}
                >
                  <option value="">— выберите —</option>
                  {Object.entries(WALL_LIFE_OPTIONS).map(([mat, opts]) => (
                    <optgroup key={mat} label={mat}>
                      {opts.map((o) => (
                        <option
                          key={o.label}
                          value={`${mat}|${o.label}|${o.coeff}`}
                        >
                          {`${o.label} — ${o.coeff}`}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
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
              {[
                { id: "nds", label: "НДС, %" },
                { id: "nsp", label: "НСП, %" },
                { id: "profit", label: "Рентабельность, %" }, // ← НОВОЕ
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
            </div>

            {/* submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`${buttonMain} lg:col-span-2 self-center relative overflow-hidden flex items-center justify-center select-none`}
              style={{
                height: isSubmitting ? 36 : 56,
                borderRadius: isSubmitting ? 9999 : 24,
                paddingLeft: isSubmitting ? 0 : 40,
                paddingRight: isSubmitting ? 0 : 40,
                transition: "all .35s ease",
              }}
            >
              {/* заполняющаяся бирюзовая полоса */}
              {isSubmitting && (
                <motion.div
                  className="absolute left-0 top-0 h-full bg-teal-400"
                  style={{ width: barWidth }}
                />
              )}

              {/* обычный текст */}
              {!isSubmitting && !showCheck && "Рассчитать стоимость аренды"}

              {/* проценты во время расчёта */}
              {isSubmitting && !showCheck && (
                <span className="relative z-10 font-semibold">
                  {progressPct}%
                </span>
              )}

              {/* галочка после заполнения */}
              {showCheck && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative z-10"
                >
                  <Check size={22} className="text-white" />
                </motion.span>
              )}
            </motion.button>
          </motion.form>

          {/* ---------- RESULT ---------- */}
          <AnimatePresence>
            {result && (
              <motion.div
                ref={resultRef}
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
                    {/* в JSX вывода результата */}
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-4 text-left font-medium">
                          Итоговая стоимость аренды
                        </th>
                        <th className="p-4 text-right text-green-600 text-xl font-bold">
                          {result.finalTotal.toLocaleString("ru-RU", {
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
      <PrintSheet /> {/*  <–– ВНЕ <section>, ничего больше не трогаем */}
    </>
  );
};

export default Welcome;
