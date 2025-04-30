import { useEffect, useState, useRef } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import CategoryBreadCrump from "../../../components/EndUser/BreadCrump/CategoryBreadCrump";
import { getAllCategories } from "../../../api/EndUserApi/endUserCategories/_requests";
import { IoIosArrowDown } from "react-icons/io";
import PriceRangeFilter from "../../../components/EndUser/SpinnerFilter/PriceRangeFilter";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../../../components/EndUser/CategoryMobile/FilterSidebar";

export default function CategoriesLayout() {
  const [showCategories, setShowCategories] = useState(true);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState("All Categories");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const { category_id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedSort = searchParams.get("sort");
  const sortOptions = [
    { label: "Sort By", value: "" },
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
  ];

  // Handle price range update
  const handlePriceChange = ({ min, max }) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("min", min);
    newParams.set("max", max);
    setSearchParams(newParams);
  };

  // Handle sort option update
  const handleSortChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("sort", value);
    } else {
      newParams.delete("sort");
    }
    setSearchParams(newParams);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
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
      setCurrentPage("All Categories");
    } else {
      const category = categories.find(
        (cat) => cat.id.toString() === category_id
      );
      if (category) {
        setCurrentPage(category.name);
      }
    }
  }, [location.pathname, categories]);

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
      <aside className="w-64 hidden 2xl:block">
        <div className="border p-4">
          <button
            onClick={() => setShowCategories((prev) => !prev)}
            className="font-bold w-full flex justify-between items-center"
          >
            Categories
            <IoIosArrowDown
              className={`transition-transform duration-300 ${
                showCategories ? "rotate-180" : ""
              }`}
            />
          </button>
          {showCategories && (
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  className={`text-gray-500 hover:text-purple-600 transition ${
                    !category_id ? "text-purple-600 font-semibold" : ""
                  }`}
                  to={`/category/`}
                >
                  All Categories
                </Link>
              </li>
              {categories.map((category) => (
                <li
                  key={category.id}
                  onClick={() => setCurrentPage(category.name)}
                >
                  <Link
                    className={`text-gray-500 hover:text-purple-600 transition ${
                      category.id.toString() === category_id
                        ? "text-purple-600 font-semibold"
                        : ""
                    }`}
                    to={`/category/${category.id}`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <PriceRangeFilter setValuesProp={handlePriceChange} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <CategoryBreadCrump currentPage={currentPage} />
        <div>
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <h2 className="md:text-lg font-bold">{currentPage}</h2>
            <div className="flex items-center gap-4">
              {/* Filter Button */}
              <button
                className="flex items-center 2xl:hidden gap-2 px-4 py-2 border rounded hover:bg-gray-100 transition"
                onClick={() => setIsFilterOpen((prev) => !prev)}
              >
                <FaFilter className="text-lg" />
                <span className="font-semibold">Filter</span>
              </button>

              {/* Sort Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border rounded hover:bg-gray-100 transition w-32 justify-between"
                >
                  <span className="text-gray-400 text-sm">
                    {sortOptions.find((opt) => opt.value === selectedSort)
                      ?.label || "Sort By"}
                  </span>
                  <IoIosArrowDown
                    className={`transform transition-transform duration-300 ${
                      isMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded z-10 overflow-hidden">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className="block w-full text-left px-4 py-2 hover:bg-purple-600 hover:text-white transition"
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
