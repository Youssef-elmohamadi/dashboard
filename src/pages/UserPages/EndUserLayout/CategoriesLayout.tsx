import { memo, useEffect, useState, useRef, useCallback, lazy } from "react";
import {
  Outlet,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { Category } from "../../../types/Categories";
import { PriceChangeParams } from "../../../types/Shop";
import CategoryBreadCrump from "../../../components/EndUser/Shop/CategoryBreadCrump";
const FilterSidebar = lazy(
  () => import("../../../components/EndUser/Shop/FilterSidebar")
);
import Sidebar from "../../../components/EndUser/Shop/Sidebar";
import FilterIcon from "../../../icons/FilterIcon";
import ArrowDown from "../../../icons/ArrowDown";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData";

function CategoriesLayout() {
  const [showCategories, setShowCategories] = useState<boolean>(true);
  const { t } = useTranslation(["EndUserShop"]);
  const [currentPage, setCurrentPage] = useState<string>(t("allCategories"));
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { category_id } = useParams<{ category_id?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSort = searchParams.get("sort");
  const { lang } = useDirectionAndLanguage();

  const sortOptions = [
    { label: t("sortByMenu.title"), value: "" },
    { label: t("sortByMenu.newest"), value: "newest" },
    { label: t("sortByMenu.oldest"), value: "oldest" },
  ];

  const handlePriceChange = useCallback(
    ({ min, max }: PriceChangeParams) => {
      const newParams = new URLSearchParams(searchParams);

      if (min == null && max == null) {
        newParams.delete("min");
        newParams.delete("max");
      } else {
        if (min != null) {
          newParams.set("min", String(min));
        } else {
          newParams.delete("min");
        }

        if (max != null) {
          newParams.set("max", String(max));
        } else {
          newParams.delete("max");
        }
      }

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("sort", value);
    } else {
      newParams.delete("sort");
    }
    setSearchParams(newParams);
    setIsMenuOpen(false);
  };

  const { data } = useCategories("parent");
  const categories: Category[] | undefined = data;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (
      location.pathname === `/${lang}/category` ||
      location.pathname === `/${lang}/category/`
    ) {
      setCurrentPage(t("allCategories"));
    } else {
      const category = categories?.find(
        (cat) => cat.id.toString() === category_id
      );
      if (category) {
        setCurrentPage(category[`name_${lang}`]);
      }
    }
  }, [category_id, categories, location.pathname, t]);

  return (
    <div className="flex flex-row min-h-screen enduser_container my-10">
      <FilterSidebar
        isMenuOpen={isFilterOpen}
        setIsMenuOpen={setIsFilterOpen}
        setShowCategories={setShowCategories}
        showCategories={showCategories}
        categories={categories}
        category_id={category_id}
        handlePriceChange={handlePriceChange}
      />

      <Sidebar
        setCurrentPage={setCurrentPage}
        handlePriceChange={handlePriceChange}
        setShowCategories={setShowCategories}
        showCategories={showCategories}
      />

      <main className="flex-1 p-6">
        <CategoryBreadCrump currentPage={currentPage} />
        <div>
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 my-6">
            <h2 className="md:text-lg md:font-bold text-sm font-bold mx-1">
              {currentPage}
            </h2>
            <div className="flex items-center gap-4">
              <button
                className="flex items-center 2xl:hidden gap-1 px-3 py-2 border border-gray-200 rounded hover:bg-gray-100 transition"
                onClick={() => setIsFilterOpen((prev) => !prev)}
              >
                <FilterIcon className="text-lg" />
                <span className="font-semibold">{t("mainContent.filter")}</span>
              </button>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded hover:bg-gray-100 transition w-32 justify-between"
                >
                  <span className="text-black text-sm">
                    {sortOptions.find((opt) => opt.value === selectedSort)
                      ?.label || t("sortByMenu.title")}
                  </span>
                  <ArrowDown
                    className={`transform transition-transform duration-300 w-4 ${
                      isMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded z-10 overflow-hidden">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className="block w-full px-4 py-2 hover:bg-[#d62828] hover:text-white transition"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Outlet context={setCurrentPage} />
        </div>
      </main>
    </div>
  );
}
export default memo(CategoriesLayout);
