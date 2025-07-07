import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import { Category, Child } from "../../../types/Categories";
import useClickOutside from "../context/useClickOutside";
import { Circles } from "react-loader-spinner";

interface CategoriesDropdownProps {
  dir: string;
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({ dir }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(["EndUserNavBar"]);
  const { lang } = useDirectionAndLanguage();

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useCategories();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useClickOutside(dropdownRef, closeDropdown, isDropdownOpen);

  const renderSubCategories = (subCategory: Child) => (
    <li key={subCategory.id} className="p-2">
      {subCategory.childs && subCategory.childs.length > 0 ? (
        <div>
          <div className="font-bold mb-1">{subCategory.name}</div>
          <ul className="pl-4 space-y-1">
            {subCategory.childs.map((nested: Child) => (
              <li key={nested.id}>
                <Link
                  to={`/${lang}/category/${nested.id}`}
                  className="hover:bg-gray-100 block p-1 rounded"
                  onClick={closeDropdown}
                >
                  {nested.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <Link
          to={`/${lang}/category/${subCategory.id}`}
          className="hover:bg-gray-100 block p-2 rounded"
          onClick={closeDropdown}
        >
          {subCategory.name}
        </Link>
      )}
    </li>
  );

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
        <ul className="flex flex-col overflow-y-auto max-h-[74vh] scroll-bar-hide relative z-30">
          {isCategoriesLoading ? (
            <div className="flex justify-center items-center py-4">
              <Circles height="40" width="40" color="#542475" />
            </div>
          ) : isCategoriesError ? (
            <div className="px-4 py-2 text-red-500 text-center">
              {t("navbar.categoriesError", {
                defaultValue: "فشل تحميل الفئات.",
              })}
            </div>
          ) : Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category: Category) => (
              <li
                onClick={closeDropdown}
                key={category.id}
                className="group relative px-4 py-2 hover:bg-[#8826bd35] cursor-pointer"
              >
                <Link
                  to={`/${lang}/category/${category.id}`}
                  className="flex justify-between items-center w-full"
                >
                  <div className="">{category.name}</div>
                  {category.childs && category.childs.length > 0 && (
                    <IoIosArrowDown
                      className={`transform ${
                        dir === "ltr" ? "rotate-[-90deg]" : "rotate-[90deg]"
                      } group-hover:rotate-0 transition duration-300 ml-2`}
                    />
                  )}
                </Link>
                {category.childs && category.childs.length > 0 && (
                  <ul
                    className={`fixed top-0 z-[99999] ${
                      dir === "ltr" ? "left-full" : "right-full"
                    } w-[200%] h-[calc(100vh-11em)] bg-white invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-y-auto py-2 px-4`}
                  >
                    {category.childs.map((sub: Child) =>
                      renderSubCategories(sub)
                    )}
                  </ul>
                )}
              </li>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500 text-center">
              {t("navbar.noCategoryFound")}
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CategoriesDropdown;
