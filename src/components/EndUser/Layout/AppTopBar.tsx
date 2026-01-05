import React, { useEffect, useRef, useState } from "react";
import ArrowDown from "../../../icons/ArrowDown";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Separator } from "../Common/Separator";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "ar", labelKey: "Common:TopBar.language.arabic" },
  { code: "en", labelKey: "Common:TopBar.language.english" },
];

const CURRENCIES = [{ code: "egp", labelKey: "Common:currency.egp" }];

const TopBar = () => {
  const { t } = useTranslation();
  const { setLang, dir, lang } = useDirectionAndLanguage();

  const [showLangs, setShowLangs] = useState(false);
  const [showCurrencies, setShowCurrencies] = useState(false);

  const [currency, setCurrency] = useState<"egp">("egp");

  const langRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLanguageChange = (langCode: "ar" | "en") => {
    const newPath = location.pathname.replace(/^\/(ar|en)/, `/${langCode}`);

    navigate(newPath, { replace: true });
    setLang(langCode);
    setShowLangs(false);
  };

  const handleCurrencyChange = (code: "egp") => {
    setCurrency(code);
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
      <div className="flex items-center justify-between lg:justify-start flex-[3]">
        {/* Language */}
        <div ref={langRef} className="relative flex items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setShowLangs((prev) => !prev)}
          >
            <span className="p-1 text-sm text-secondary">
              {lang === "ar"
                ? t("Common:TopBar.language.arabic")
                : t("Common:TopBar.language.english")}
            </span>
            <ArrowDown className="w-3 mt-1" />
          </div>

          <div
            className={`absolute mt-2 min-w-[8rem] top-4 rounded-lg border border-gray-200 shadow-lg bg-white transition-all duration-200 ease-in-out ${
              dir === "rtl" ? "right-0" : "left-0"
            } ${showLangs ? "block" : "hidden"}`}
          >
            <ul className="py-2">
              {LANGUAGES.map((item) => (
                <li
                  key={item.code}
                  className={`px-4 py-2 text-sm text-center cursor-pointer transition
                    ${
                      item.code === lang
                        ? "bg-gray-100 text-black font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  onClick={() => handleLanguageChange(item.code)}
                >
                  {t(item.labelKey)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="hidden lg:block" />

        {/* Currency */}
        <div ref={currencyRef} className="relative flex items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setShowCurrencies((prev) => !prev)}
          >
            <span className="p-1 text-sm text-secondary">
              {t("Common:currency.egp")}
            </span>
            <ArrowDown className="w-3 mt-1" />
          </div>

          <div
            className={`absolute mt-2 min-w-[8rem] top-4 rounded-lg border border-gray-200 shadow-lg bg-white transition-all duration-200 ease-in-out ${
              dir === "rtl" ? "right-0" : "left-0"
            } ${showCurrencies ? "block" : "hidden"}`}
          >
            <ul className="py-2">
              {CURRENCIES.map((item) => (
                <li
                  key={item.code}
                  className={`px-4 py-2 text-sm text-center cursor-pointer transition
                    ${
                      item.code === currency
                        ? "bg-gray-100 text-black font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  onClick={() => handleCurrencyChange(item.code)}
                >
                  {t(item.labelKey)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="items-center flex-[2] hidden lg:flex" />

      <div className="items-center flex-[2] justify-end hidden lg:flex">
        <Link to="https://wa.me/201557408095">
          <div className="p-2 text-sm text-secondary hover:text-black transition duration-300 cursor-pointer">
            {t("Common:TopBar.contact_number")}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default React.memo(TopBar);
