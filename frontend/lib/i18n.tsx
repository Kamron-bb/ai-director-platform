"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "ru" | "uz";

const DICT = {
  ru: {
    appName: "El-Pay Dashboard",
    subtitle: "Аналитика сети терминалов",
    overview: "Обзор",
    terminals: "Терминалы",
    segments: "Сегменты",
    efficiencyTitle: "Доходность терминалов",
    turnover: "Оборот",
    payments: "Количество платежей",
    reward: "Вознаграждение",
    activeTerminals: "Терминалов в сети",
    avgCheck: "Средний чек",
    commission: "Комиссия",
    noCommission: "Без комиссии",
    noCommissionHint: "терминалов работают без комиссии",
    topTerminals: "Топ терминалов по обороту",
    top5Terminals: "Топ-5 по обороту",
    outsiders: "Аутсайдеры",
    outsidersHint: "Минимальный оборот за месяц",
    distribution: "Распределение терминалов по обороту",
    segmentTitle: "Концентрация оборота",
    terminalName: "Терминал",
    number: "Номер",
    share: "Доля",
    count: "Терминалов",
    sum: "сум",
    mln: "млн",
    bln: "млрд",
    loading: "Загрузка данных",
    error: "Не удалось загрузить данные",
    dataNote: "Данные отчёта за июль 2026",
    searchPlaceholder: "Поиск по названию или номеру",
    colPayments: "Платежей",
    colAvgCheck: "Ср. чек",
    colReward: "Вознагр.",
    noCommissionTag: "без комиссии",
    nothingFound: "Ничего не найдено",
    terminalsSuffix: "терм.",
  },
  uz: {
    appName: "El-Pay Dashboard",
    subtitle: "Terminallar tarmog'i tahlili",
    overview: "Umumiy ko'rinish",
    terminals: "Terminallar",
    segments: "Segmentlar",
    efficiencyTitle: "Terminallar daromadliligi",
    turnover: "Aylanma",
    payments: "To'lovlar soni",
    reward: "Mukofot",
    activeTerminals: "Tarmoqdagi terminallar",
    avgCheck: "O'rtacha chek",
    commission: "Komissiya",
    noCommission: "Komissiyasiz",
    noCommissionHint: "terminal komissiyasiz ishlaydi",
    topTerminals: "Aylanma bo'yicha eng yaxshi terminallar",
    top5Terminals: "Aylanma bo'yicha top-5",
    outsiders: "Autsayderlar",
    outsidersHint: "Oyning minimal aylanmasi",
    distribution: "Terminallarning aylanma bo'yicha taqsimoti",
    segmentTitle: "Aylanma konsentratsiyasi",
    terminalName: "Terminal",
    number: "Raqam",
    share: "Ulush",
    count: "Terminallar",
    sum: "so'm",
    mln: "mln",
    bln: "mlrd",
    loading: "Ma'lumotlar yuklanmoqda",
    error: "Ma'lumotlarni yuklab bo'lmadi",
    dataNote: "2026-yil iyul oyi hisoboti",
    searchPlaceholder: "Nomi yoki raqami bo'yicha qidirish",
    colPayments: "To'lovlar",
    colAvgCheck: "O'rt. chek",
    colReward: "Mukofot",
    noCommissionTag: "komissiyasiz",
    nothingFound: "Hech narsa topilmadi",
    terminalsSuffix: "term.",
  },
} as const;

export type DictKey = keyof typeof DICT.ru;

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey) => string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: "ru",
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ru");
  const t = (key: DictKey) => DICT[lang][key];

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
