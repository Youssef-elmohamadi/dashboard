import i18n from "../i18n";

export const applyLanguageSettings = (lang: "en" | "ar") => {
  const dir = lang === "ar" ? "rtl" : "ltr";

  i18n.changeLanguage(lang);

  document.documentElement.lang = lang;
  document.documentElement.dir = dir;

  localStorage.setItem("i18nextLng", lang);
  localStorage.setItem("dir", dir);
};
