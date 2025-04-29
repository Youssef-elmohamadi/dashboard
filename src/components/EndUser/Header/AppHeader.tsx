import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoIosMenu } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { Separator } from "../Separator/Separator";
import { AiOutlineHome } from "react-icons/ai";
import {
  TiDocumentText,
  TiDownload,
  TiInfoLargeOutline,
  TiSupport,
} from "react-icons/ti";
import { GrLogout } from "react-icons/gr";
import { BsWechat } from "react-icons/bs";
import { TfiClose, TfiDownload, TfiWallet } from "react-icons/tfi";
import { LuWallet } from "react-icons/lu";
import { getAllCategories } from "../../../api/EndUserApi/endUserCategories/_requests";
const AppHeader = () => {
  const uToken = localStorage.getItem("uToken");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [Categories, setCategories] = useState<any>();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
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
  return (
    <>
      <header className="enduser_container py-4 flex items-center justify-start gap-12 relative z-50">
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
                <img src="/images/logo/logo.png" className="w-32" alt="Logo" />
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

        <div className="hidden lg:flex items-center justify-end gap-2 flex-[1]">
          {uToken ? (
            <>
              <div className="flex items-center gap-2">
                <div className="relative group p-2 flex gap-2 items-center">
                  <span className="cursor-pointer">Youssef</span>
                  <FaRegCircleUser className="text-2xl mt-1 text-secondary cursor-pointer" />

                  <div className="absolute right-0 top-[90%] mt-1 bg-white shadow-lg rounded-md w-60 py-2 z-50 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                    <ul className="space-y-1">
                      <Link to="/u-dashboard">
                        <li className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                          <AiOutlineHome className="text-xl text-secondary" />
                          Dashboard
                        </li>
                      </Link>
                      <Link to="/u-orders">
                        <li className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                          <TiDocumentText className="text-xl text-secondary" />
                          Purchase History
                        </li>
                      </Link>
                      <Link to="/u-downloads">
                        <li className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                          <TiDownload className="text-xl text-secondary" />
                          Downloads
                        </li>
                      </Link>
                      <Link to="/u-conversation">
                        <li className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                          <BsWechat className="text-xl text-secondary" />
                          Conversation
                        </li>
                      </Link>
                      <Link to="/u-wallet">
                        <li className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                          <TfiWallet className="text-xl text-secondary" />
                          Wallet
                        </li>
                      </Link>
                      <Link to="/u-support-ticket">
                        <li className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                          <TiSupport className="text-xl text-secondary" />
                          Support Ticket
                        </li>
                      </Link>
                      <li className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-100 cursor-pointer">
                        <GrLogout className="text-xl" />
                        Logout
                      </li>
                    </ul>
                  </div>
                </div>
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
                <FaRegCircleUser className="text-2xl mt-1 text-secondary cursor-pointer" />

                <Separator />
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
        className={`fixed top-0 left-0 z-999999 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-1 ">
          <div className="text-right p-4">
            <button onClick={closeMenu} className="text-right text-red-500">
              <TfiClose />
            </button>
          </div>
          <div>
            {uToken ? (
              <>
                <div className="text-center flex items-center gap-2.5 p-4 border-b">
                  <div className="w-10 h-10 rounded-full p-1 flex items-center gap-2.5">
                    <img
                      src="/images/cards/card-01.jpg"
                      className="w-full h-full rounded-full"
                      alt="User Avatar"
                    />
                    <div className="font-semibold">Youssef</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex border-b">
                <div className="p-4 flex items-center gap-2">
                  <FaRegCircleUser className="text-2xl mt-1 text-secondary cursor-pointer" />

                  <Separator />
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
              </div>
            )}
          </div>
          <ul className="flex flex-col justify-center border-b">
            {Categories?.map((Category, i) =>
              i < 4 ? (
                <li key={i} className="text-gray-500 py-3">
                  <Link to={`/category/${Category.id}`} className="py-3 px-2">
                    {Category.name}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
          {uToken && (
            <>
              <ul className="flex flex-col justify-center border-b">
                <li className="text-gray-500 py-3">
                  <Link to="/" className="py-3 px-2">
                    Profile
                  </Link>
                </li>
                <li className="text-gray-500 py-3">
                  <Link to="/" className="py-3 px-2">
                    Notifications
                  </Link>
                </li>
                <li className="text-gray-500 py-3">
                  <Link to="/" className="py-3 px-2">
                    Favorite
                  </Link>
                </li>
                <li className="text-gray-500 py-3">
                  <Link to="/" className="py-3 px-2">
                    Compare
                  </Link>
                </li>
              </ul>
              <ul className="flex flex-col justify-center">
                <li className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-100 cursor-pointer">
                  <GrLogout className="text-xl" />
                  Logout
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AppHeader;
