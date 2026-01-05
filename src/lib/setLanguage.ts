import i18n from "../i18n";

export const applyLanguageSettings = async (lang: "en" | "ar") => {
  const dir = lang === "ar" ? "rtl" : "ltr";

  await i18n.changeLanguage(lang);

  document.documentElement.lang = lang;
  document.documentElement.dir = dir;

  localStorage.setItem("dir", dir);
};
