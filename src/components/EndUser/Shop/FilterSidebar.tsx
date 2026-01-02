import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FilterSidebarProps } from "../../../types/Shop";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { CloseIcon } from "../../../icons";
import ArrowDown from "../../../icons/ArrowDown";
import BrandFilter from "./BrandFilter";
import PriceRangeMobileFilter from "./PriceRangeMobile";
import React, { memo, useState } from "react";

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  setShowCategories,
  showCategories,
  categories,
  handlePriceChange,
}) => {
  const { lang, dir } = useDirectionAndLanguage();
  const isRTL = dir === "rtl";
  const { t } = useTranslation(["EndUserShop"]);
  const [expandedCat, setExpandedCat] = useState<number | null>(null);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleSubCategory = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCat(expandedCat === id ? null : id);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex-1 text-[13px] transition-all duration-300 py-2 ${
      isActive ? "text-[#d62828] font-black" : "text-gray-600 font-medium"
    }`;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[999998] transition-opacity duration-500 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMenu}
      />

      <div
        className={`fixed top-0 ${
          isRTL ? "right-0" : "left-0"
        } z-[999999] h-full w-[85%] max-w-[320px] bg-white transform transition-transform duration-500 ease-in-out flex flex-col
        ${
          isMenuOpen
            ? "translate-x-0"
            : isRTL
            ? "translate-x-full"
            : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-50 sticky top-0 bg-white z-10">
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">
            {t("filter_title", "الفلاتر")}
          </h2>
          <button
            onClick={closeMenu}
            className="p-2 hover:bg-red-50 rounded-xl transition-all text-red-500 active:scale-90"
          >
            <CloseIcon className="w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
          <div className="bg-white p-5 border border-gray-100 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowCategories((prev) => !prev)}
              className="group w-full flex justify-between items-center pb-4 mb-4 border-b border-gray-50"
            >
              <span className="text-sm font-black uppercase tracking-widest text-gray-900 group-hover:text-[#d62828] transition-colors">
                {t("categories")}
              </span>
              <div
                className={`p-1.5 rounded-lg transition-all duration-300 ${
                  showCategories
                    ? "bg-red-50 text-[#d62828]"
                    : "bg-gray-50 text-gray-400"
                }`}
              >
                <ArrowDown
                  className={`w-3.5 transition-transform duration-500 ${
                    showCategories ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            <div
              className={`grid transition-all duration-500 ease-in-out ${
                showCategories
                  ? "grid-rows-[1fr] opacity-100 mt-5"
                  : "grid-rows-[0fr] opacity-0 pointer-events-none"
              }`}
            >
              <div className="overflow-hidden">
                <ul className="space-y-1.5 custom-scrollbar max-h-[500px] overflow-y-auto pr-1">
                  <li>
                    <NavLink
                      to={`/${lang}/category`}
                      onClick={closeMenu}
                      end
                      className={navLinkClass}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                        </div>
                        <span className="text-[13px] font-bold">
                          {t("allCategories")}
                        </span>
                      </div>
                    </NavLink>
                  </li>

                  {categories?.map((category) => {
                    const hasChildren =
                      category.childs && category.childs.length > 0;
                    const isExpanded = expandedCat === category.id;

                    return (
                      <li key={category.id} className="space-y-1 group/item">
                        <div className="flex items-center group">
                          <NavLink
                            to={`/${lang}/category/${category.id}`}
                            className={navLinkClass}
                            onClick={closeMenu}
                            end
                          >
                            <div className="flex items-center gap-3">
                              {/* إضافة الأيقونة هنا */}
                              <div
                                className={`w-5 h-5 transition-colors duration-300 [&_svg]:w-full [&_svg]:h-full ${
                                  isExpanded || expandedCat === category.id
                                    ? "text-[#d62828]"
                                    : "text-gray-400"
                                }`}
                                dangerouslySetInnerHTML={{
                                  __html: category.icon,
                                }}
                              />
                              <span className="text-[13px]">
                                {category[`name_${lang}`]}
                              </span>
                            </div>
                          </NavLink>

                          {hasChildren && (
                            <button
                              onClick={(e) => toggleSubCategory(category.id, e)}
                              className={`p-2 transition-all duration-300 rounded-lg ${
                                isExpanded
                                  ? "bg-red-50 text-[#d62828] rotate-180"
                                  : "text-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              <ArrowDown className="w-3" />
                            </button>
                          )}
                        </div>

                        {/* القائمة الفرعية */}
                        {hasChildren && (
                          <div
                            className={`grid transition-all duration-500 ${
                              isExpanded
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0 pointer-events-none"
                            }`}
                          >
                            <ul className="overflow-hidden ms-8 space-y-1 border-s-2 border-red-50">
                              {category.childs.map((child: any) => (
                                <li key={child.id}>
                                  <NavLink
                                    to={`/${lang}/category/${child.id}`}
                                    className={({ isActive }) => `
                            block py-2 ps-4 text-[12px] transition-all relative
                            ${
                              isActive
                                ? "text-[#d62828] font-bold before:content-[''] before:absolute before:left-0 rtl:before:right-0 before:w-1 before:h-3 before:bg-[#d62828] before:rounded-full"
                                : "text-gray-400 active:text-gray-900"
                            }
                          `}
                                    onClick={closeMenu}
                                    end
                                  >
                                    {child[`name_${lang}`]}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <BrandFilter />
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl">
            <PriceRangeMobileFilter
              setIsMenuOpen={closeMenu}
              isMenuOpen={isMenuOpen}
              setValuesProp={handlePriceChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(FilterSidebar);
