import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";


i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    supportedLngs: ["en", "ar"],
    preload: ["en", "ar"],
    detection: {
      order: ["path", "localStorage", "htmlTag", "cookie", "subdomain"],
      caches: ["localStorage", "cookie"],
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    ns: [
      "Status",
      "AdminsTablesActions", //problem
      "OrderDetails", //problem
      "DateFilter", //problem
      "TopSellingTable", //problem
    ],

    defaultNS: "Signup",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
