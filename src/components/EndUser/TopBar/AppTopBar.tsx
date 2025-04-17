import React, { useState, useEffect, useRef } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Link } from "react-router-dom";
import { Separator } from "../Separator/Separator";

const TopBar = () => {
  const [language, setLanguage] = useState("English");
  const [languages, setLanguages] = useState([
    "German",
    "French",
    "Italian",
    "Spanish",
  ]);
  const [showlangs, setShowLangs] = useState(false);
  const [showCurrencies, setShowCurrencies] = useState(false);

  const [currency, setCurrency] = useState("USD");
  const [currencies, setCurrencies] = useState(["EUR", "EGP"]);

  const langRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (newLang: any) => {
    setLanguages([language, ...languages.filter((lang) => lang !== newLang)]);
    setLanguage(newLang);
    setShowLangs(false);
  };

  const handleCurrencyChange = (newCurrency: any) => {
    setCurrencies([
      currency,
      ...currencies.filter((curr) => curr !== newCurrency),
    ]);
    setCurrency(newCurrency);
    setShowCurrencies(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setShowLangs(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(e.target)) {
        setShowCurrencies(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="container px-3 py-2 flex items-center justify-between">
      {/* Language & Currency */}
      <div className="flex items-center justify-between lg:justify-start flex-[3]">
        {/* Language */}
        <div ref={langRef} className="relative flex items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowLangs(!showlangs)}
          >
            <div className="p-1 text-sm text-secondary">{language}</div>
            <MdOutlineKeyboardArrowDown />
          </div>
          <div
            className={`absolute p-3 top-8 left-0 bg-white shadow z-50 ${
              showlangs ? "block" : "hidden"
            }`}
          >
            <ul>
              {languages.map((lang, index) => (
                <li
                  key={index}
                  className="p-2 w-36 bg-gray-300 my-2 text-sm uppercase hover:bg-white hover:border hover:border-black transition duration-300 cursor-pointer"
                  onClick={() => handleLanguageChange(lang)}
                >
                  {lang}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Separator */}
        <Separator className="hidden lg:block" />

        {/* Currency */}
        <div ref={currencyRef} className="relative flex items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowCurrencies(!showCurrencies)}
          >
            <div className="p-1 text-sm text-secondary">{currency}</div>
            <MdOutlineKeyboardArrowDown />
          </div>
          <div
            className={`absolute p-3 top-8 right-0 bg-white shadow z-50 ${
              showCurrencies ? "block" : "hidden"
            }`}
          >
            <ul>
              {currencies.map((curr, index) => (
                <li
                  key={index}
                  className="p-2 w-36 bg-gray-300 my-2 text-sm uppercase hover:bg-white hover:border hover:border-black transition duration-300 cursor-pointer"
                  onClick={() => handleCurrencyChange(curr)}
                >
                  {curr}
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
            Be A Seller
          </div>
        </Link>

        <Separator />

        <Link to="/admin">
          <div className="p-2 text-sm text-secondary hover:text-black transition duration-300 cursor-pointer">
            Login As A Seller
          </div>
        </Link>
      </div>

      {/* Contact */}
      <div className="items-center flex-[2] hidden lg:flex">
        <Link to="/">
          <div className="p-2 text-sm text-secondary hover:text-black transition duration-300 cursor-pointer">
            Direct Contact Number 00966501326310
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
