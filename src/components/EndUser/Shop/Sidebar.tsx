import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import PriceRangeFilter from "../Shop/PriceRangeFilter";
import { SidebarShopProps } from "../../../types/Shop";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import ArrowDown from "../../../icons/ArrowDown";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import BrandFilter from "./BrandFilter";

const Sidebar = ({
  setCurrentPage,
  handlePriceChange,
  setShowCategories,
  showCategories,
}: SidebarShopProps) => {
  const { t } = useTranslation(["EndUserShop"]);
  const { data, isLoading } = useCategories();

  const categories = data || [];
  const { lang } = useDirectionAndLanguage();
  return (
    <aside className="w-64 hidden 2xl:block">
      <div className="border border-gray-200 p-4">
        {isLoading ? (
          <div className="text-center py-10">{t("loadingCategories")}</div>
        ) : (
          <>
            <button
              onClick={() => setShowCategories((prev) => !prev)}
              className="font-bold w-full flex justify-between items-center"
            >
              {t("categories")}
              <ArrowDown
                className={`transition-transform duration-300 w-4 ${
                  showCategories ? "rotate-180" : ""
                }`}
              />
            </button>

            {showCategories && (
              <ul className="mt-4 space-y-2">
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "text-[#d62828] font-semibold hover:text-[#d62828] transition"
                        : "text-gray-500 hover:text-[#d62828] transition"
                    }
                    to={`/${lang}/category`}
                    end
                  >
                    {t("allCategories")}
                  </NavLink>
                </li>
                {categories?.map((category) => (
                  <li key={category.id}>
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? "text-[#d62828] font-semibold hover:text-[#d62828] transition"
                          : "text-gray-500 hover:text-[#d62828] transition"
                      }
                      to={`/${lang}/category/${category.id}`}
                      onClick={() => setCurrentPage(category[`name_${lang}`])}
                      end
                    >
                      {category[`name_${lang}`]}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      <PriceRangeFilter setValuesProp={handlePriceChange} />
      <BrandFilter />
    </aside>
  );
};

export default Sidebar;
