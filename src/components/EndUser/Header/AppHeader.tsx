import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoIosMenu } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { Separator } from "../Separator/Separator";

const AppHeader = () => {
  const uToken = localStorage.getItem("uToken");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="enduser_container py-4 flex items-center justify-start gap-12 relative z-50">
        {/* اليسار: المينيو واللوجو والموبايل سيرش */}
        <div className="flex justify-between w-full md:w-auto">
          <div className="flex gap-2 items-center w-full">
            {/* MenuIcon */}
            <div className="md:hidden">
              <button onClick={toggleMenu}>
                <IoIosMenu className="text-2xl" />
              </button>
            </div>
            {/* logo */}
            <div className="flex items-center gap-2 cursor-pointer flex-[1]">
              <Link to="/">
                <img src="/images/logo.webp" className="w-32" alt="Logo" />
              </Link>
            </div>
          </div>

          {/* موبايل سيرش آيكون */}
          <div className="md:hidden">
            <CiSearch className="text-2xl" />
          </div>
        </div>

        {/* search */}
        <div className="md:flex items-center gap-2 hidden flex-[3] lg:flex-[2]">
          <div className="flex items-center gap-2 relative w-full">
            <input
              type="text"
              placeholder="i'm Search about..."
              className="rounded-full text-sm px-4 py-2 border border-soft-light focus:outline-none focus:border-secondary-base w-full"
            />
            <div className="absolute right-4">
              <CiSearch className="text-2xl" />
            </div>
          </div>
        </div>

        {/* الحالة حسب وجود التوكن */}
        <div className="hidden lg:flex items-center justify-end gap-2 flex-[1]">
          {uToken ? (
            <>
              <div className="flex items-center gap-2">
                <FaRegCircleUser className="text-2xl mt-1 text-secondary" />
                <Separator />
              </div>
              <div className="flex items-center gap-2">
                <Link to="/cart">
                  <FaShoppingCart className="text-2xl text-secondary" />
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Link to="/signin" className="text-secondary text-sm">
                  Login
                </Link>
                <Separator />
              </div>
              <div className="flex items-center gap-2">
                <Link to="/signup" className="text-secondary text-sm">
                  Signup
                </Link>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-50"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex flex-col gap-4">
          <button onClick={closeMenu} className="text-left text-red-500">
            Close
          </button>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/products" onClick={closeMenu}>
            Products
          </Link>
          <Link to="/contact" onClick={closeMenu}>
            Contact
          </Link>
          {uToken ? (
            <Link to="/profile" onClick={closeMenu}>
              Profile
            </Link>
          ) : (
            <Link to="/signin" onClick={closeMenu}>
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default AppHeader;
