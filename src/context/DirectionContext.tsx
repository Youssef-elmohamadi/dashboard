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

export const useDirectionAndLanguage = () => useContext(DirectionAndLanguageContext);

const DirectionAndLanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const savedDir = window.localStorage.getItem("dir") as "ltr" | "rtl" | null;
  const savedLang = window.localStorage.getItem("i18nextLng") as "en" | "ar" | null;

  const [dir, setDir] = useState<"ltr" | "rtl">(savedDir ?? "ltr");
  const [lang, setLang] = useState<"en" | "ar">(savedLang ?? "en");

  useEffect(() => {
    document.documentElement.dir = dir;
    window.localStorage.setItem("dir", dir);
  }, [dir]);

  useEffect(() => {
    window.localStorage.setItem("i18nextLng", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <DirectionAndLanguageContext.Provider value={{ dir, lang, setDir, setLang }}>
      {children}
    </DirectionAndLanguageContext.Provider>
  );
};

export default DirectionAndLanguageProvider;
