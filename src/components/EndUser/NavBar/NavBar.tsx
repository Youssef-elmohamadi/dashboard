import React, { useState, useRef, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { getAllCategories } from "../../../api/EndUserApi/endUserCategories/_requests";

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [Categories, setCategories] = useState<any>();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        console.log(response.data.data);
        setCategories(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <nav className="bg-primary w-full md:block hidden ">
      <div className="flex container w-full justify-center lg:justify-baseline items-center relative">
        {/* Categories Button */}
        <div
          className="Categories flex-[1] lg:block hidden relative"
          ref={dropdownRef}
        >
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 text-white font-semibold py-4"
          >
            Categories
            <IoIosArrowDown
              className={`transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          <div
            className={`absolute top-full left-0 bg-white z-50 text-black shadow-lg rounded-md mt-1 w-48 transition-all duration-300 origin-top transform ${
              isDropdownOpen
                ? "opacity-100 scale-y-100 visible"
                : "opacity-0 scale-y-0 invisible"
            }`}
          >
            <ul className="flex flex-col">
              {Categories?.length > 0 ? (
                Categories.map((category, index) => (
                  <li
                    key={index}
                    className="group relative px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <Link to="">{category.name}</Link>
                      {category.childs && category.childs.length > 0 && (
                        <IoIosArrowDown className="transform rotate-[-90deg] group-hover:rotate-0 transition duration-300 ml-2" />
                      )}
                    </div>

                    {/* Submenu */}
                    {category.childs && category.childs.length > 0 && (
                      <ul className="fixed top-0 left-full  w-[400%] h-[calc(100vh-11em)] bg-white z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-y-auto py-8 px-12">
                        <div className="grid grid-cols-4 gap-6">
                          {category.childs.map((sub, subIndex) => (
                            <li
                              key={subIndex}
                              className="hover:bg-gray-100 p-2 rounded cursor-pointer whitespace-nowrap"
                            >
                              <Link to="">{sub.name}</Link>
                            </li>
                          ))}
                        </div>
                      </ul>
                    )}
                  </li>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No Category Found</div>
              )}
            </ul>
          </div>
        </div>

        {/* Links */}
        <ul className="flex justify-center lg:justify-start flex-[2] gap-5">
          <li className="text-white py-3">
            <Link to="" className="py-3 font-semibold">
              Men Clothes
            </Link>
          </li>
          <li className="text-white py-3">
            <Link to="" className="py-3 font-semibold">
              Women Clothes
            </Link>
          </li>
          <li className="text-white py-3">
            <Link to="" className="py-3 font-semibold">
              Perfumes
            </Link>
          </li>
          <li className="text-white py-3">
            <Link to="" className="py-3 font-semibold">
              MakeUp
            </Link>
          </li>
        </ul>

        {/* Cart */}
        <div className="lg:flex flex-[1] gap-3 cursor-pointer hidden items-center justify-end">
          <FaShoppingCart className="text-white text-2xl" />
          <div className="text-white">0.00 EGP</div>
          <div className="text-white">(0 Items)</div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
