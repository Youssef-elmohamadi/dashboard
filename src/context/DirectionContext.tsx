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

const DirectionAndLanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
  const [lang, setLang] = useState<"en" | "ar">(
    (location?.pathname.split("/")[1] as "en" | "ar") || "en"
  );

  useEffect(() => {
    const savedDir = localStorage.getItem("dir") as "ltr" | "rtl" | null;
    const savedLang = localStorage.getItem("i18nextLng");

    setDir(savedDir === "rtl" ? "rtl" : "ltr");
    setLang(isValidLang(savedLang) ? savedLang : "en");
  }, []);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    localStorage.setItem("dir", dir);
    localStorage.setItem("i18nextLng", lang);
  }, [dir, lang]);

  return (
    <DirectionAndLanguageContext.Provider
      value={{ dir, lang, setDir, setLang }}
    >
      {children}
    </DirectionAndLanguageContext.Provider>
  );
};

export default DirectionAndLanguageProvider;
