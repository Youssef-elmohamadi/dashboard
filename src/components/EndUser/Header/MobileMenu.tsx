import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Link } from "react-router-dom";
import { useProfile } from "../../../hooks/Api/EndUser/useProfile/useProfile";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import { Category } from "../../../types/Categories";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { Circles } from "react-loader-spinner";
import CloseIcon from "../../../icons/CloseIcon";
import LogoutIcon from "../../../icons/LogoutIcon";
import ArrowDown from "../../../icons/ArrowDown";
import LazyImage from "../../common/LazyImage";

type Props = {
  dir: string;
  handleLogout: () => void;
  isMenuOpen: boolean;
  closeMenu: () => void;
  uToken: string | null;
};

const MobileMenu = ({
  dir,
  isMenuOpen,
  closeMenu,
  uToken,
  handleLogout,
}: Props) => {
  const { t } = useTranslation();
  const { data: user } = useProfile();
  const { data: categories, isLoading: isCategoriesLoading } =
    useCategories("parent");
  const { lang } = useDirectionAndLanguage();
  const [expandedCat, setExpandedCat] = useState<number | null>(null);

  const toggleAccordion = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCat(expandedCat === id ? null : id);
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
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            isActive ? "bg-[#d62828]" : "bg-gray-300"
          }`}
        />
      );
    return (
      <div
        className={`w-5 h-5 transition-colors duration-300 ${
          isActive ? "text-[#d62828]" : "text-gray-400"
        }`}
        dangerouslySetInnerHTML={{ __html: svgString }}
      />
    );
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[999998] transition-opacity duration-500 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMenu}
      />

      <div
        className={`fixed top-0 ${dir === "ltr" ? "left-0" : "right-0"} 
        z-[999999] h-full w-[85%] max-w-sm bg-white shadow-2xl transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col
        ${
          isMenuOpen
            ? "translate-x-0"
            : dir === "ltr"
            ? "-translate-x-full"
            : "translate-x-full"
        }`}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between p-5 border-b border-gray-50 bg-white sticky top-0 z-20">
          <span className="font-black text-gray-900 uppercase tracking-widest text-xs">
            {t("Common:Header.menu")}
          </span>
          <button
            onClick={closeMenu}
            className="p-2 hover:bg-red-50 rounded-xl transition-all text-red-500 active:scale-90"
          >
            <CloseIcon className="w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-8">
          <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 shadow-sm shadow-gray-100/50">
            {uToken ? (
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <LazyImage
                    src={user?.avatar || "/images/default-avatar.webp"}
                    className="w-full h-full object-cover"
                    alt="tashtiba User"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {t("Common:Header.welcome")}
                  </p>
                  <p className="font-black text-gray-900 text-base">
                    {user?.first_name || ""}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-800">
                  {t("Common:Buttons.login_to_enjoy")}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to={`/${lang}/signin`}
                    onClick={closeMenu}
                    className="py-2.5 text-center bg-[#d62828] text-white text-xs font-black rounded-xl shadow-lg shadow-red-100"
                  >
                    {t("Common:Buttons.login")}
                  </Link>
                  <Link
                    to={`/${lang}/signup`}
                    onClick={closeMenu}
                    className="py-2.5 text-center bg-white border border-gray-200 text-gray-700 text-xs font-black rounded-xl"
                  >
                    {t("Common:Buttons.signup")}
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">
              {t("Common:Header.categories")}
            </h3>
            {isCategoriesLoading ? (
              <div className="flex justify-center py-6">
                <Circles height="30" width="30" color="#d62828" />
              </div>
            ) : (
              <ul className="space-y-1.5">
                {categories?.map((category: Category) => {
                  const hasChildren =
                    category.childs && category.childs.length > 0;
                  const isExpanded = expandedCat === category.id;

                  return (
                    <li key={category.id} className="group/item">
                      <div className="flex items-center">
                        <NavLink
                          to={`/${lang}/category/${category.id}`}
                          className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 flex-1
                            ${
                              isActive
                                ? "bg-red-50 text-[#d62828] font-black shadow-sm shadow-red-100"
                                : "text-gray-700 active:bg-gray-50 font-medium"
                            }
                          `}
                          onClick={closeMenu}
                          end
                        >
                          {({ isActive }) => (
                            <>
                              <CategoryIcon
                                svgString={category.icon}
                                isActive={isActive}
                              />
                              <span className="text-[13px]">
                                {category[`name_${lang}`]}
                              </span>
                            </>
                          )}
                        </NavLink>

                        {hasChildren && (
                          <button
                            onClick={(e) => toggleAccordion(category.id, e)}
                            className={`p-4 transition-all duration-300 ${
                              isExpanded
                                ? "text-[#d62828] rotate-180"
                                : "text-gray-300"
                            }`}
                          >
                            <ArrowDown className="w-3" />
                          </button>
                        )}
                      </div>
                      <div
                        className={`grid transition-all duration-500 ease-in-out ${
                          isExpanded
                            ? "grid-rows-[1fr] opacity-100 mt-1"
                            : "grid-rows-[0fr] opacity-0 pointer-events-none"
                        }`}
                      >
                        <ul className="overflow-hidden ms-10 space-y-1 border-s-2 border-red-50">
                          {category.childs?.map((child: any) => (
                            <li key={child.id}>
                              <NavLink
                                to={`/${lang}/category/${child.id}`}
                                onClick={closeMenu}
                                className={({ isActive }) => `
                                  block py-2.5 ps-5 text-[12px] transition-all relative before:content-[''] before:absolute before:left-0 rtl:before:right-0 before:w-1 before:h-0 before:bg-[#d62828] before:rounded-full before:transition-all
                                  ${
                                    isActive
                                      ? "text-[#d62828] font-bold before:h-3"
                                      : "text-gray-500 active:text-gray-900"
                                  }
                                `}
                              >
                                {child[`name_${lang}`]}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* 3. My Account Section */}
          {uToken && (
            <div className="space-y-4 pt-8 border-t border-gray-100">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">
                {t("Common:Header.my_account")}
              </h3>
              <ul className="space-y-1">
                {[
                  {
                    to: `/${lang}/u-profile`,
                    label: t("Common:Header.profile"),
                  },
                  {
                    to: `/${lang}/u-orders`,
                    label: t("Common:Header.orders_history"),
                  },
                  {
                    to: `/${lang}/u-favorite`,
                    label: t("Common:Header.favorite_products"),
                  },
                ].map((item, idx) => (
                  <NavLink
                    key={idx}
                    to={item.to}
                    onClick={closeMenu}
                    className={({ isActive }) => `
                    block px-4 py-3.5 text-[13px] rounded-xl transition-all
                    ${
                      isActive
                        ? "bg-red-50 text-[#d62828] font-black"
                        : "text-gray-700 font-medium active:bg-gray-50"
                    }
                  `}
                  >
                    {item.label}
                  </NavLink>
                ))}

                <li
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="flex items-center gap-3 px-4 py-4 text-red-600 font-black active:bg-red-50 rounded-xl cursor-pointer transition-all text-sm mt-6 border border-dashed border-red-100"
                >
                  <LogoutIcon className="w-5" />
                  {t("Common:Buttons.logout")}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
