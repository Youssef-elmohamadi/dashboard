// src/components/EndUser/Layout/CategoriesDropdownContent.tsx
import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import { Category, Child } from "../../../types/Categories";
import { Circles } from "react-loader-spinner";

interface CategoriesDropdownContentProps {
  dir: string;
  closeDropdown: () => void;
  lang: string; // Add lang prop
}

const CategoriesDropdownContent: React.FC<CategoriesDropdownContentProps> = ({
  dir,
  closeDropdown,
  lang,
}) => {
  const { t } = useTranslation(["EndUserNavBar"]);

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useCategories(); // useCategories hook is placed here now

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
            // No onClick={closeDropdown} here, it's handled by Link internally.
            // If the li itself needs to close dropdown, use it, but consider nested links.
            key={category.id}
            className="group relative px-4 py-2 hover:bg-[#8826bd35] cursor-pointer"
          >
            <Link
              to={`/${lang}/category/${category.id}`}
              className="flex justify-between items-center w-full"
              onClick={closeDropdown} // Close dropdown on main category click
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
                {category.childs.map((sub: Child) => renderSubCategories(sub))}
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
  );
};

export default CategoriesDropdownContent;
