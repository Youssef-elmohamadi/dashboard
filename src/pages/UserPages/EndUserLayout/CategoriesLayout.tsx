import { useEffect, useState, useRef } from "react";
import {
  Outlet,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import CategoryBreadCrump from "../../../components/EndUser/Shop/CategoryBreadCrump";
import { IoIosArrowDown } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../../../components/EndUser/Shop/FilterSidebar";
import { useTranslation } from "react-i18next";
import Sidebar from "../../../components/EndUser/Shop/Sidebar";
import { useAllCategories } from "../../../hooks/Api/Admin/useCategories/useCategories";
import { Category } from "../../../types/Categories";
import { PriceChangeParams } from "../../../types/Shop";
export default function CategoriesLayout() {
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

  const sortOptions = [
    { label: t("sortByMenu.title"), value: "" },
    { label: t("sortByMenu.newest"), value: "newest" },
    { label: t("sortByMenu.oldest"), value: "oldest" },
  ];

  // Handle price range update
  const handlePriceChange = ({ min, max }: PriceChangeParams) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("min", min);
    newParams.set("max", max);
    setSearchParams(newParams);
  };

  // Handle sort option update
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

  const { data } = useAllCategories();
  const categories: Category[] | undefined = data?.original;

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
      location.pathname === "/category" ||
      location.pathname === "/category/"
    ) {
      setCurrentPage(t("allCategories"));
    } else {
      const category = categories?.find(
        (cat) => cat.id.toString() === category_id
      );
      if (category) {
        setCurrentPage(category.name);
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

      {/* Sidebar */}
      <Sidebar
        setCurrentPage={setCurrentPage}
        handlePriceChange={handlePriceChange}
        setShowCategories={setShowCategories}
        showCategories={showCategories}
      />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <CategoryBreadCrump currentPage={currentPage} />
        <div>
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
            <h2 className="md:text-lg font-bold">{currentPage}</h2>
            <div className="flex items-center gap-4">
              {/* Filter Button */}
              <button
                className="flex items-center 2xl:hidden gap-2 px-4 py-2 border border-gray-200 rounded hover:bg-gray-100 transition"
                onClick={() => setIsFilterOpen((prev) => !prev)}
              >
                <FaFilter className="text-lg" />
                <span className="font-semibold">{t("mainContent.filter")}</span>
              </button>

              {/* Sort Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded hover:bg-gray-100 transition w-32 justify-between"
                >
                  <span className="text-gray-400 text-sm">
                    {sortOptions.find((opt) => opt.value === selectedSort)
                      ?.label || t("sortByMenu.title")}
                  </span>
                  <IoIosArrowDown
                    className={`transform transition-transform duration-300 ${
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
                        className="block w-full px-4 py-2 hover:bg-purple-600 hover:text-white transition"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Outlet with Context if needed */}
          <Outlet context={setCurrentPage} />
        </div>
      </main>
    </div>
  );
}
