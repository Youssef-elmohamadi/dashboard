import { useEffect } from "react";
import { useDirectionAndLanguage } from "../../context/DirectionContext";
import { useTranslation } from "react-i18next";
const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const { setDir, setLang, dir, lang } = useDirectionAndLanguage();
  const switchLanguage = (lang: "en" | "ar") => {
    i18n.changeLanguage(lang);
  };
  useEffect(() => {
    window.localStorage.setItem("i18nextLng", lang);
    window.localStorage.setItem("dir", dir);
  }, [lang, dir]);

  const changeLanguage = (lang: "en" | "ar") => {
    setLang(lang);
    if (lang === "ar") {
      setDir("rtl");
      switchLanguage(lang);
    } else {
      setDir("ltr");
      switchLanguage(lang);
    }
  };

  const baseButtonStyle = `
    relative flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 
    transition-colors bg-white dark:bg-gray-900 dark:hover:bg-gray-700  
    border border-gray-300 rounded-full h-8 w-8 
    hover:bg-gray-100 hover:text-gray-700 
    dark:border-gray-800 dark:hover:text-white
  `;

  const activeButtonStyle = `
    !bg-gray-600 !text-white border border-gray-600 
    hover:text-white dark:bg-gray-900 dark:!border-gray-500
  `;

  return (
    <div className="flex items-center justify-center p-2 rounded-full h-12 bg-white border border-gray-200 gap-2 dark:bg-gray-800 dark:border-gray-600">
      <button
        onClick={() => changeLanguage("en")}
        className={`${baseButtonStyle} ${
          lang === "en" ? activeButtonStyle : ""
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage("ar")}
        className={`${baseButtonStyle} ${
          lang === "ar" ? activeButtonStyle : ""
        }`}
      >
        AR
      </button>
    </div>
  );
};

export default LanguageToggle;
