import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { CiSearch } from "react-icons/ci";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoIosMenu } from "react-icons/io";
import { Separator } from "../Separator/Separator";
import { TiDocumentText } from "react-icons/ti";
import { GrLogout } from "react-icons/gr";
import { TfiClose } from "react-icons/tfi";
import { getAllCategories } from "../../../api/EndUserApi/endUserCategories/_requests";
import {
  MdCompareArrows,
  MdFavorite,
  MdNotifications,
  MdOutlineCompareArrows,
} from "react-icons/md";
import { RiProfileFill } from "react-icons/ri";
import { getProfile } from "../../../api/EndUserApi/endUserAuth/_requests";
import { handleLogout } from "../../../components/EndUser/Auth/Logout";

const AppHeader = () => {
  const uToken = localStorage.getItem("uToken");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [Categories, setCategories] = useState<any>();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const [user, setUser] = useState({});
  const { items } = useSelector((state) => state.wishList);

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
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setUser(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <>
      <header className="enduser_container py-4 flex items-center justify-start gap-12 relative z-50">
        {/* الهيدر */}
        <div className="flex justify-between w-full md:w-auto">
          <div className="flex gap-2 items-center w-full">
            <div className="md:hidden">
              <button onClick={toggleMenu}>
                <IoIosMenu className="text-2xl" />
              </button>
            </div>
            <div className="flex items-center gap-2 cursor-pointer flex-[1]">
              <NavLink to="/">
                <img src="/images/logo/logo.png" className="w-32" alt="Logo" />
              </NavLink>
            </div>
          </div>
          <div className="md:hidden">
            <CiSearch className="text-2xl" />
          </div>
        </div>

        {/* مربع البحث */}
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

        {/* العناصر الجانبية */}
        <div className="hidden lg:flex items-center justify-end gap-2 flex-[1]">
          {uToken ? (
            <>
              <div className="flex items-center gap-2">
                <div className="relative group p-2 flex gap-2 items-center">
                  <div className="flex gap-3 items-center">
                    <div>{user?.first_name}</div>
                    <div className="h-8 w-8">
                      <img
                        className="w-full h-full rounded-full"
                        src={
                          user?.avatar ||
                          user?.Avatar ||
                          "/images/default-avatar.jpg"
                        }
                        alt="User Avatar"
                      />
                    </div>
                  </div>
                  {/* القائمة المنسدلة */}
                  <div className="absolute right-0 top-[90%] mt-1 bg-white shadow-lg rounded-md w-60 py-3 px-2 z-50 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                    <ul className="space-y-1">
                      {/* روابط الحساب */}
                      <NavLink
                        to="/u-profile"
                        className={({ isActive }) =>
                          `p-2 rounded flex items-center gap-2 ${
                            isActive
                              ? "bg-gray-100 text-purple-700 font-semibold"
                              : "hover:bg-gray-100"
                          }`
                        }
                      >
                        <RiProfileFill className="text-lg text-gray-500" />
                        Profile Management
                      </NavLink>
                      <NavLink
                        to="/u-orders"
                        className={({ isActive }) =>
                          `p-2 rounded flex items-center gap-2 ${
                            isActive
                              ? "bg-gray-100 text-purple-700 font-semibold"
                              : "hover:bg-gray-100"
                          }`
                        }
                      >
                        <TiDocumentText className="text-xl text-secondary" />
                        Orders History
                      </NavLink>
                      <NavLink
                        to="/u-compare"
                        className={({ isActive }) =>
                          `p-2 rounded flex items-center gap-2 ${
                            isActive
                              ? "bg-gray-100 text-purple-700 font-semibold"
                              : "hover:bg-gray-100"
                          }`
                        }
                      >
                        <MdCompareArrows className="text-lg text-gray-500" />
                        Compare Product
                      </NavLink>
                      <NavLink
                        to="/u-favorite"
                        className={({ isActive }) =>
                          `p-2 rounded flex items-center gap-2 ${
                            isActive
                              ? "bg-gray-100 text-purple-700 font-semibold"
                              : "hover:bg-gray-100"
                          }`
                        }
                      >
                        <MdFavorite className="text-lg text-gray-500" />
                        Favorite Products
                      </NavLink>
                      <li
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-100 cursor-pointer"
                      >
                        <GrLogout className="text-xl" />
                        Logout
                      </li>
                    </ul>
                  </div>
                </div>
                <Separator />
              </div>
              <div className="flex items-center gap-2">
                <NavLink to="/u-notification">
                  <MdNotifications className="text-2xl text-secondary" />
                </NavLink>
              </div>
              <div className="flex items-center gap-2 relative">
                <NavLink to="/u-favorite">
                  {items && (
                    <div className="absolute -top-2 -right-2 bg-purple-700 w-5 h-5 flex justify-center items-center rounded-full text-white text-xs">
                      {items.length}
                    </div>
                  )}
                  <MdFavorite className="text-2xl text-secondary" />
                </NavLink>
              </div>
              <div className="flex items-center gap-2">
                <NavLink to="/u-compare">
                  <MdOutlineCompareArrows className="text-2xl text-secondary" />
                </NavLink>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <FaRegCircleUser className="text-2xl mt-1 text-secondary cursor-pointer" />
                <Separator />
                <NavLink to="/signin" className="text-secondary text-sm">
                  Login
                </NavLink>
                <Separator />
              </div>
              <div className="flex items-center gap-2">
                <NavLink to="/signup" className="text-secondary text-sm">
                  Signup
                </NavLink>
              </div>
            </>
          )}
        </div>
      </header>

      {/* القائمة الجانبية للموبايل */}
      {isMenuOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-50"
        />
      )}
      <div
        className={`fixed top-0 left-0 z-999999 h-full w-72 bg-white shadow-lg transform overflow-auto transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-1">
          <div className="text-right p-4">
            <button onClick={closeMenu} className="text-right text-red-500">
              <TfiClose />
            </button>
          </div>
          <div>
            {uToken ? (
              <div className="text-center flex flex-col items-center">
                <div className="w-20 h-20 rounded-full">
                  <img
                    src={
                      user?.avatar ||
                      user?.Avatar ||
                      "/images/default-avatar.jpg"
                    }
                    className="w-full h-full rounded-full"
                    alt="User Avatar"
                  />
                </div>
                <div className="font-semibold">
                  {user?.first_name} {user?.last_name}
                </div>
                <div className="text-sm text-gray-500">{user?.email}</div>
              </div>
            ) : (
              <div className="flex border-b">
                <div className="p-4 flex items-center gap-2">
                  <FaRegCircleUser className="text-2xl mt-1 text-secondary cursor-pointer" />
                  <Separator />
                  <NavLink to="/signin" className="text-secondary text-sm">
                    Login
                  </NavLink>
                  <Separator />
                </div>
                <div className="flex items-center gap-2">
                  <NavLink to="/signup" className="text-secondary text-sm">
                    Signup
                  </NavLink>
                </div>
              </div>
            )}
          </div>

          {/* باقي القائمة */}
          <ul className="flex flex-col justify-center border-b">
            {Categories?.map((Category, i) =>
              i < 4 ? (
                <NavLink
                  key={i}
                  to={`/category/${Category.id}`}
                  className={({ isActive }) =>
                    `py-3 px-2 block ${
                      isActive
                        ? "bg-gray-100 text-purple-700 font-semibold"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  <li>{Category.name}</li>
                </NavLink>
              ) : null
            )}
          </ul>

          {uToken && (
            <>
              <ul className="flex flex-col justify-center border-b">
                <NavLink
                  to="/u-profile"
                  className={({ isActive }) =>
                    `py-3 px-2 block ${
                      isActive
                        ? "bg-gray-100 text-purple-700 font-semibold"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  <li>Profile</li>
                </NavLink>
                <NavLink
                  to="/u-notification"
                  className={({ isActive }) =>
                    `py-3 px-2 block ${
                      isActive
                        ? "bg-gray-100 text-purple-700 font-semibold"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  <li>Notifications</li>
                </NavLink>
                <NavLink
                  to="/u-favorite"
                  className={({ isActive }) =>
                    `py-3 px-2 block ${
                      isActive
                        ? "bg-gray-100 text-purple-700 font-semibold"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  <li>Favorite</li>
                </NavLink>
                <NavLink
                  to="/u-compare"
                  className={({ isActive }) =>
                    `py-3 px-2 block ${
                      isActive
                        ? "bg-gray-100 text-purple-700 font-semibold"
                        : "hover:bg-gray-100"
                    }`
                  }
                >
                  <li>Compare</li>
                </NavLink>
              </ul>
              <ul className="flex flex-col justify-center">
                <li
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-100 cursor-pointer"
                >
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
