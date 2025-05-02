import { TfiClose } from "react-icons/tfi";
import PriceRangeFilter from "../SpinnerFilter/PriceRangeFilter";
import { Link } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";

const FilterSidebar = ({
  isMenuOpen,
  setIsMenuOpen,
  setShowCategories,
  showCategories,
  categories,
  category_id,
  handlePriceChange,
}) => {
  const closeMenu = () => setIsMenuOpen(false);

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
              <TfiClose />
            </button>
          </div>
        </div>
        <div>
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
                  <li key={category.id}>
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
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
