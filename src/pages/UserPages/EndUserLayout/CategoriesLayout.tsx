import { useEffect, useState, useRef } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
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
  const [selectedSort, setSelectedSort] = useState("Sort By");
  const menuRef = useRef(null);
  const location = useLocation();
  const sortOptions = ["Sort By", "Newest", "Oldest", "Max Price", "Min Price"];

  const toggleMenu = () => setIsFilterOpen(!isFilterOpen);
  const { category_id } = useParams();
  console.log(category_id);

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

  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data.data);
        setCategoriesLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!categoriesLoaded) return;

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
  }, [location.pathname, categoriesLoaded]);

  return (
    <div className="flex flex-row min-h-screen enduser_container my-10">
      <FilterSidebar
        isMenuOpen={isFilterOpen}
        setIsMenuOpen={setIsFilterOpen}
        setShowCategories={setShowCategories}
        showCategories={showCategories}
        categories={categories}
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
                <Link className="text-gray-500" to={`/category/`}>
                  All Categories
                </Link>
              </li>
              {categories.map((category) => (
                <li
                  onClick={() => {
                    setCurrentPage(category.name);
                  }}
                  key={category.id}
                >
                  <Link
                    className="text-gray-500"
                    to={`/category/${category.id}`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <PriceRangeFilter />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <CategoryBreadCrump currentPage={currentPage} />
        <div className="">
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <h2 className="md:text-lg font-bold">{currentPage}</h2>

            <div className="flex items-center gap-4">
              {/* Filter Button */}
              <button
                className="flex items-center 2xl:hidden
               gap-2 px-4 py-2 border rounded hover:bg-gray-100 transition"
                onClick={toggleMenu}
              >
                <FaFilter className="text-lg" />
                <span className="font-semibold">Filter</span>
              </button>

              {/* Custom Sort Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border rounded hover:bg-gray-100 transition w-32 justify-between"
                >
                  <span className="text-gray-400 text-sm">{selectedSort}</span>
                  <IoIosArrowDown
                    className={`transform transition-transform duration-300 ${
                      isMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded z-10 overflow-hidden">
                    {sortOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedSort(option);
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-purple-600 hover:text-white transition"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Outlet context={{ setCurrentPage }} />
        </div>
      </main>
    </div>
  );
}
