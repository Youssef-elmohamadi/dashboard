import React from "react";
import { NavLink } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import { CiSearch } from "react-icons/ci";

interface HeaderLeftSectionProps {
  lang: string;
  altTexts: {
    logo: { ar: string; en: string };
  };
  toggleMenu: () => void;
  toggleMobileSearch: () => void;
}

const HeaderLeftSection: React.FC<HeaderLeftSectionProps> = ({
  lang,
  altTexts,
  toggleMenu,
  toggleMobileSearch,
}) => {
  return (
    <div className="flex justify-between w-full md:w-auto">
      <div className="flex gap-2 items-center w-full">
        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle Mobile Menu">
            <IoIosMenu className="text-2xl" />
          </button>
        </div>
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer flex-[1]">
          <NavLink to={`/${lang}/`}>
            <img
              src="/images/logo/light-logo.webp"
              className="w-[150px] hover:opacity-90 transition duration-300 h-[46px]"
              alt={lang === "ar" ? altTexts.logo.ar : altTexts.logo.en}
            />
          </NavLink>
        </div>
      </div>
      {/* Mobile Search Toggle */}
      <div className="md:hidden">
        <CiSearch
          className="text-2xl cursor-pointer"
          onClick={toggleMobileSearch}
          aria-label="Toggle Mobile Search"
        />
      </div>
    </div>
  );
};

export default React.memo(HeaderLeftSection);
