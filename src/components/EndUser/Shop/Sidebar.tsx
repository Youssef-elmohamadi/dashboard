import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SidebarShopProps } from "../../../types/Shop";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import ArrowDown from "../../../icons/ArrowDown";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import PriceRangeFilter from "../Shop/PriceRangeFilter";
import BrandFilter from "./BrandFilter";

const Sidebar = ({
  setCurrentPage,
  handlePriceChange,
  setShowCategories,
  showCategories,
}: SidebarShopProps) => {
  const { t } = useTranslation(["EndUserShop"]);
  const { data, isLoading } = useCategories("parent");
  const { lang } = useDirectionAndLanguage();
  const [expandedCats, setExpandedCats] = useState<Record<number, boolean>>({});

  const toggleSubCategory = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCats((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const CategoryIcon = ({
    svgString,
    isActive,
  }: {
    svgString: string | null;
    isActive?: boolean;
  }) => {
    if (!svgString)
      return (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isActive ? "bg-[#d62828]" : "bg-gray-300"
          }`}
        />
      );
    return (
      <div
        className={`w-4 h-4 transition-colors duration-300 ${
          isActive
            ? "text-[#d62828]"
            : "text-gray-400 group-hover:text-gray-600"
        }`}
        dangerouslySetInnerHTML={{ __html: svgString }}
      />
    );
  };

  return (
    <aside className="w-72 hidden 2xl:block sticky top-24 h-fit pb-10 space-y-4">
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="p-5">
          {isLoading ? (
            <div className="space-y-4 py-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 bg-gray-50 animate-pulse rounded-lg w-full"
                />
              ))}
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowCategories((prev) => !prev)}
                className="group w-full flex justify-between items-center pb-4 mb-4 border-b border-gray-50"
              >
                <span className="text-sm font-black uppercase tracking-widest text-gray-900 group-hover:text-[#d62828] transition-colors">
                  {t("categories")}
                </span>
                <div className="bg-gray-50 group-hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                  <ArrowDown
                    className={`w-3.5 transition-transform duration-500 ${
                      showCategories ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {showCategories && (
                <ul className="space-y-1 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
                  <li>
                    <NavLink
                      to={`/${lang}/category`}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group
                        ${
                          isActive
                            ? "bg-red-50 text-[#d62828]"
                            : "hover:bg-gray-50 text-gray-600"
                        }`
                      }
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                      <span className="text-[13px] font-bold">
                        {t("allCategories")}
                      </span>
                    </NavLink>
                  </li>

                  {data?.map((category) => {
                    const hasChildren =
                      category.childs && category.childs.length > 0;
                    const isExpanded = expandedCats[category.id];

                    return (
                      <li key={category.id} className="group/item">
                        <NavLink
                          to={`/${lang}/category/${category.id}`}
                          onClick={() =>
                            setCurrentPage(category[`name_${lang}`])
                          }
                          className={({ isActive }) => `
                            flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300
                            ${
                              isActive
                                ? "bg-red-50 text-[#d62828] "
                                : "hover:bg-gray-50 text-gray-700"
                            }
                          `}
                        >
                          {({ isActive }) => (
                            <>
                              <div className="flex items-center gap-3 truncate">
                                <CategoryIcon
                                  svgString={category.icon}
                                  isActive={isActive}
                                />
                                <span
                                  className={`text-[13px] truncate ${
                                    isActive
                                      ? "font-black"
                                      : "font-medium group-hover/item:translate-x-1 rtl:group-hover/item:-translate-x-1 transition-transform"
                                  }`}
                                >
                                  {category[`name_${lang}`]}
                                </span>
                              </div>
                              {hasChildren && (
                                <div
                                  onClick={(e) =>
                                    toggleSubCategory(category.id, e)
                                  }
                                  className={`p-1 rounded-md transition-all duration-300 ${
                                    isExpanded
                                      ? "bg-white rotate-180"
                                      : "opacity-0 group-hover/item:opacity-100"
                                  }`}
                                >
                                  <ArrowDown className="w-2.5" />
                                </div>
                              )}
                            </>
                          )}
                        </NavLink>
                        {hasChildren && (
                          <div
                            className={`grid transition-all duration-500 ease-in-out ${
                              isExpanded
                                ? "grid-rows-[1fr] opacity-100 mt-1"
                                : "grid-rows-[0fr] opacity-0 pointer-events-none"
                            }`}
                          >
                            <ul className="overflow-hidden ms-7 space-y-0.5 border-s border-gray-100">
                              {category.childs.map((child) => (
                                <li key={child.id}>
                                  <NavLink
                                    to={`/${lang}/category/${child.id}`}
                                    className={({ isActive }) => `
                                      relative flex items-center gap-2 py-2 ps-4 text-[12px] transition-all before:content-[''] before:absolute before:left-0 rtl:before:right-0 before:w-1 before:h-0 before:bg-[#d62828] before:rounded-full before:transition-all
                                      ${
                                        isActive
                                          ? "text-[#d62828] font-bold before:h-3"
                                          : "text-gray-400 hover:text-gray-900 hover:ps-5"
                                      }
                                    `}
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
              )}
            </>
          )}
        </div>
      </div>

      <div>
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <BrandFilter />
        </div>
      </div>
      <PriceRangeFilter setValuesProp={handlePriceChange} />
    </aside>
  );
};

export default Sidebar;
