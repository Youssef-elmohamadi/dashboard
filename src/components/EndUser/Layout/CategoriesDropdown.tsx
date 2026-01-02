import React, { useState, useRef, Suspense, lazy, useCallback } from "react"; 
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import useClickOutside from "../context/useClickOutside";
import ArrowDown from "../../../icons/ArrowDown";

const LazyCategoriesDropdownContent = lazy(
  () => import("./CategoriesDropdownContent")
);

interface CategoriesDropdownProps {
  dir: string;
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({ dir }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { lang } = useDirectionAndLanguage(); 

  const prefetchContent = useCallback(() => {
    import("./CategoriesDropdownContent");
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeDropdown();
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleDropdown();
    }
  };

  useClickOutside(dropdownRef, closeDropdown, isDropdownOpen);

  return (
    <div
      className="Categories flex-[1] lg:block hidden relative"
      ref={dropdownRef}
      onMouseEnter={() => {
        prefetchContent();
        setIsDropdownOpen(true);
      }}
      onMouseLeave={closeDropdown}
    >
      <button
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-expanded={isDropdownOpen}
        className="flex items-center gap-2 text-white font-semibold py-4 focus:outline-none"
      >
        {t("Common:navbar.categories")}
        <ArrowDown
          className={`w-4 transition-transform duration-300 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`absolute top-[100%] z-50 text-black min-w-[240px] shadow-2xl rounded-md
          transition-all duration-200 ease-out transform pt-1
          ${dir === "rtl" ? "right-0 origin-top-right" : "left-0 origin-top-left"}
          ${isDropdownOpen
              ? "opacity-100 scale-100 translate-y-0 visible pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
          }`}
      >
        <div className="bg-white rounded-md border border-gray-100 overflow-visible">
            {isDropdownOpen && (
              <Suspense fallback={<div className="p-8 animate-pulse bg-gray-50" />}>
                <LazyCategoriesDropdownContent
                  dir={dir}
                  closeDropdown={closeDropdown}
                  lang={lang}
                />
              </Suspense>
            )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CategoriesDropdown);