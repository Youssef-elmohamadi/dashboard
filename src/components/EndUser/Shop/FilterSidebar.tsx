import PriceRangeFilter from "../Shop/PriceRangeFilter";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FilterSidebarProps } from "../../../types/Shop";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { CloseIcon } from "../../../icons";
import ArrowDown from "../../../icons/ArrowDown";

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  setShowCategories,
  showCategories,
  categories,
  handlePriceChange,
}) => {
  const { lang } = useDirectionAndLanguage();
  const closeMenu = () => setIsMenuOpen(false);
  const { t } = useTranslation(["EndUserShop"]);
  return (
    <>
      {isMenuOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-50 overflow-auto"
        />
      )}
      <div
        className={`fixed top-0 left-0 overflow-auto z-999999 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-1 mb-2 ">
          <div className="text-right p-4">
            <button onClick={closeMenu} className="text-right text-red-500">
              <CloseIcon />
            </button>
          </div>
        </div>
        <div>
          <div className="border border-gray-200 p-4">
            <button
              onClick={() => setShowCategories((prev) => !prev)}
              className="font-bold w-full flex justify-between items-center"
            >
              {t("categories")}
              <ArrowDown
                className={`transition-transform text-lg w-4 duration-300 ${
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
                    to={`/${lang}/category/`}
                    onClick={closeMenu}
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
                      onClick={closeMenu}
                    >
                      {category.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <PriceRangeFilter setValuesProp={handlePriceChange} />
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;