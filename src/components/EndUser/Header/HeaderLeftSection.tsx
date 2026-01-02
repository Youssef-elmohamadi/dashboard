import React from "react";
import { NavLink } from "react-router-dom";
import MenuIcon from "../../../icons/MenuIcon";
import SearchIcon from "../../../icons/SearchIcon";
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
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle Mobile Menu">
            <MenuIcon className="text-2xl" />
          </button>
        </div>
        <div className="flex items-center justify-center md:justify-start gap-2 cursor-pointer flex-[1]">
          <NavLink to={`/${lang}`}>
            <img
              src={`/images/logo/${lang}-light-logo.webp`}
              className="w-[110px] h-[30px] md:w-[140px] hover:opacity-90 transition duration-300 md:h-[40px]"
              alt={lang === "ar" ? altTexts.logo.ar : altTexts.logo.en}
              width={110}
              height={30}
            />
          </NavLink>
        </div>
      </div>
      {/* Mobile Search Toggle */}
      <div className="md:hidden mt-2">
        <SearchIcon
          className="w-6 cursor-pointer text-black"
          onClick={toggleMobileSearch}
          aria-label="Toggle Mobile Search"
        />
      </div>
    </div>
  );
};
export default React.memo(HeaderLeftSection);