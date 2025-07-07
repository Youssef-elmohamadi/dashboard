import { useState, useEffect, useRef } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Separator } from "../Common/Separator";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useTranslation } from "react-i18next";

const TopBar = () => {
  const { i18n, t } = useTranslation(["EndUserTopBar"]);
  const { setDir, setLang, dir, lang } = useDirectionAndLanguage();

  const [language, setLanguage] = useState<string>();
  const [languages, setLanguages] = useState<string[]>([]);
  const [showLangs, setShowLangs] = useState(false);

  const [currency, setCurrency] = useState(t("egp"));
  const [currencies, setCurrencies] = useState<string[]>([t("egp")]);
  const [showCurrencies, setShowCurrencies] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLanguages([t("arabic"), t("english")]);
    setCurrency(t("egp"));
    setCurrencies([t("egp")]);
  }, [i18n.language]);

  useEffect(() => {
    setLanguage(i18n.language === "ar" ? t("arabic") : t("english"));
  }, [i18n.language]);

  useEffect(() => {
    window.localStorage.setItem("i18nextLng", lang);
    window.localStorage.setItem("dir", dir);
    document.documentElement.setAttribute("dir", dir);
  }, [lang, dir]);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLanguageChange = (newLang: string) => {
    const langCode = newLang === t("arabic") ? "ar" : "en";

    const newPath = location.pathname.replace(/^\/(ar|en)/, `/${langCode}`);
    navigate(newPath);
    setLanguage(newLang);
    setLang(langCode);
    setDir(langCode === "ar" ? "rtl" : "ltr");
    i18n.changeLanguage(langCode);

    setShowLangs(false);
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    setShowCurrencies(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangs(false);
      }
      if (
        currencyRef.current &&
        !currencyRef.current.contains(e.target as Node)
      ) {
        setShowCurrencies(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="z-10 relative px-6 py-2 mx-auto flex items-center justify-between bg-white">
      {/* Language & Currency */}
      <div className="flex items-center justify-between lg:justify-start flex-[3]">
        {/* Language */}
        <div ref={langRef} className="relative flex items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowLangs(!showLangs)}
          >
            <span className="p-1 text-sm text-secondary">{language}</span>
            <MdOutlineKeyboardArrowDown />
          </div>
          <div
            className={`absolute mt-2 min-w-[8rem] top-4 rounded-lg border border-gray-200 shadow-lg bg-white transition-all duration-200 ease-in-out ${
              dir === "rtl" ? "right-0" : "left-0"
            } ${showLangs ? "block" : "hidden"}`}
          >
            <ul className="py-2">
              {languages.map((langItem, index) => (
                <li
                  key={index}
                  className={`px-4 py-2 text-sm text-center cursor-pointer transition 
                    ${
                      langItem === language
                        ? "bg-gray-100 text-black font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  onClick={() => handleLanguageChange(langItem)}
                >
                  {langItem}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="hidden lg:block" />

        {/* Currency */}
        <div ref={currencyRef} className="relative flex items-center ">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowCurrencies(!showCurrencies)}
          >
            <span className="p-1 text-sm text-secondary">{currency}</span>
            <MdOutlineKeyboardArrowDown />
          </div>
          <div
            className={`absolute mt-2 min-w-[8rem] top-4 rounded-lg border border-gray-200 shadow-lg bg-white transition-all duration-200 ease-in-out ${
              dir === "rtl" ? "right-0" : "left-0"
            } ${showCurrencies ? "block" : "hidden"}`}
          >
            <ul className="py-2">
              {currencies.map((currItem, index) => (
                <li
                  key={index}
                  className={`px-4 py-2 text-sm text-center cursor-pointer transition 
                    ${
                      currItem === currency
                        ? "bg-gray-100 text-black font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  onClick={() => handleCurrencyChange(currItem)}
                >
                  {currItem}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Seller Links */}
      <div className="items-center flex-[2] hidden lg:flex">
        <Link to="/admin">
          <div className="p-2 text-sm text-secondary hover:text-black transition duration-300 cursor-pointer">
            {t("be_a_seller")}
          </div>
        </Link>
        <Separator />
        <Link to="/admin">
          <div className="p-2 text-sm text-secondary hover:text-black transition duration-300 cursor-pointer">
            {t("login_as_seller")}
          </div>
        </Link>
      </div>

      {/* Contact */}
      <div className="items-center flex-[2] justify-end hidden lg:flex">
        <Link to="/">
          <div className="p-2 text-sm text-secondary hover:text-black transition duration-300 cursor-pointer">
            {t("contact_number")}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
