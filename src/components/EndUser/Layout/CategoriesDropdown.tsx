import React, { useState, useRef, Suspense, lazy } from "react"; // استيراد Suspense و lazy
import { IoIosArrowDown } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import useClickOutside from "../context/useClickOutside";

const LazyCategoriesDropdownContent = lazy(
  () => import("./CategoriesDropdownContent")
);

interface CategoriesDropdownProps {
  dir: string;
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({ dir }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(["EndUserNavBar"]);
  const { lang } = useDirectionAndLanguage(); // Keep lang here as it's passed to LazyCategoriesDropdownContent

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useClickOutside(dropdownRef, closeDropdown, isDropdownOpen);

  return (
    <div
      className="Categories flex-[1] lg:block hidden relative"
      ref={dropdownRef}
    >
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 text-white font-semibold py-4"
      >
        {t("navbar.categories")}
        <IoIosArrowDown
          className={`transition-transform duration-300 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`absolute top-full ${
          dir === "ltr" ? "left-0" : "right-0"
        } bg-white z-50 text-black max-h-[74vh] rounded-md mt-1 w-full transition-all duration-300 transform ${
          isDropdownOpen
            ? "opacity-100 scale-y-100 visible"
            : "opacity-0 scale-y-0 invisible"
        }`}
      >
        {isDropdownOpen && (
          <Suspense fallback={null}>
            {" "}
            {/* null fallback */}
            <LazyCategoriesDropdownContent
              dir={dir}
              closeDropdown={closeDropdown}
              lang={lang}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default React.memo(CategoriesDropdown);
