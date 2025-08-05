import { createContext, useContext, useEffect, useState } from "react";

type DirectionAndLanguageContext = {
  dir: "rtl" | "ltr";
  lang: "en" | "ar";
  setDir: (dir: "ltr" | "rtl") => void;
  setLang: (lang: "en" | "ar") => void;
};

const DirectionAndLanguageContext = createContext<DirectionAndLanguageContext>({
  dir: "ltr",
  lang: "en",
  setDir: () => {},
  setLang: () => {},
});

export const useDirectionAndLanguage = () =>
  useContext(DirectionAndLanguageContext);
const isValidLang = (l: string | null): l is "en" | "ar" =>
  ["en", "ar"].includes(l ?? "");
const getInitialLangFromPath = (): "en" | "ar" => {
  const pathLang = location?.pathname.split("/")[1];
  return isValidLang(pathLang) ? pathLang : "en";
};
const getDirFromLang = (lang: "en" | "ar"): "ltr" | "rtl" =>
  lang === "ar" ? "rtl" : "ltr";

const DirectionAndLanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const initialLang = getInitialLangFromPath();
  const [lang, _setLang] = useState<"en" | "ar">(initialLang);
  const [dir, _setDir] = useState<"ltr" | "rtl">(getDirFromLang(initialLang));
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    localStorage.setItem("dir", dir);
    localStorage.setItem("i18nextLng", lang);
  }, [dir, lang]);
  const setLang = (newLang: "en" | "ar") => {
    _setLang(newLang);
    _setDir(getDirFromLang(newLang));
  };
  const setDir = (newDir: "ltr" | "rtl") => {
    _setDir(newDir);
  };

  return (
    <DirectionAndLanguageContext.Provider
      value={{ dir, lang, setDir, setLang }}
    >
      {children}
    </DirectionAndLanguageContext.Provider>
  );
};

export default DirectionAndLanguageProvider;
