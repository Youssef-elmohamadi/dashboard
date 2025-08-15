import React, { createContext, useContext, useState, useEffect } from "react";
import { applyLanguageSettings } from "../lib/setLanguage";

interface DirectionContextProps {
  lang: "en" | "ar";
  setLang: (lang: "en" | "ar") => void;
  dir: "ltr" | "rtl";
}

const DirectionContext = createContext<DirectionContextProps>({
  lang: "en",
  setLang: () => {},
  dir: "ltr",
});

export const DirectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const getInitialLang = (): "en" | "ar" => {
    const pathLang = window.location.pathname.split("/")[1];
    if (pathLang === "ar" || pathLang === "en") return pathLang;

    const storedLang = localStorage.getItem("i18nextLng") as "en" | "ar" | null;
    if (storedLang === "ar" || storedLang === "en") return storedLang;

    return window.navigator.language.slice(0, 2) === "ar" ? "ar" : "en";
  };

  const initialLang = getInitialLang();

  const [lang, setLangState] = useState<"en" | "ar">(initialLang);
  const [dir, setDir] = useState<"ltr" | "rtl">(initialLang === "ar" ? "rtl" : "ltr");

  const setLang = (newLang: "en" | "ar") => {
    setLangState(newLang);
    const newDir = newLang === "ar" ? "rtl" : "ltr";
    setDir(newDir);
    applyLanguageSettings(newLang);
    localStorage.setItem("i18nextLng", newLang);
  };

  useEffect(() => {
    applyLanguageSettings(lang);
    document.documentElement.setAttribute("dir", dir); // ضبط اتجاه الصفحة
  }, [lang, dir]);

  return (
    <DirectionContext.Provider value={{ lang, setLang, dir }}>
      {children}
    </DirectionContext.Provider>
  );
};

export const useDirectionAndLanguage = () => useContext(DirectionContext);
export default DirectionProvider;
