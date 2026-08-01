"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import id from "./locales/id.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      id: { translation: id },
    },
    lng: "en", // Default language (set to English for International impression)
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already safe from xss
    },
  });

export default i18n;
