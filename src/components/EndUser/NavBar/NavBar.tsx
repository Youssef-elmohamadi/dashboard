import React, { useState, useRef, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  return (
    <nav className="bg-primary w-full md:block hidden">
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
            className={`absolute top-full left-0 bg-white z-99999 text-black shadow-lg rounded-md mt-1 w-48 overflow-hidden transition-all duration-300 origin-top transform ${
              isDropdownOpen
                ? "opacity-100 scale-y-100 visible"
                : "opacity-0 scale-y-0 invisible"
            }`}
          >
            <ul className="flex flex-col">
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link to="">Electronics</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link to="">Fashion</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link to="">Accessories</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100">
                <Link to="">Shoes</Link>
              </li>
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
