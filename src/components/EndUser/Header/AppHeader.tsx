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
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useTranslation } from "react-i18next";
import { QueriesObserver, QueryClient, useQuery } from "@tanstack/react-query";

const AppHeader = () => {
  const uToken = localStorage.getItem("uToken");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  //const [Categories, setCategories] = useState<any>();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  //const [user, setUser] = useState({});
  const { items } = useSelector((state) => state.wishList);
  const { dir } = useDirectionAndLanguage();
  const { t } = useTranslation(["EndUserHeader"]);
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await getAllCategories();
  //       setCategories(response.data.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchCategories();
  // }, []);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getAllCategories();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const response = await getProfile();
  //       setUser(response.data.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchProfile();
  // }, []);

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["endUserProfileData"],
    queryFn: async () => {
      const res = await getProfile();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div>
      <header className="enduser_container py-4 flex items-center justify-start gap-12 relative">
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
              placeholder={t("search_placeholder")}
              className="rounded-full text-sm px-4 py-2 border border-gray-200 focus:outline-none w-full"
            />
            <div className={`absolute ${dir === "ltr" ? "right-4" : "left-4"}`}>
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
                        src={user?.avatar || "/images/default-avatar.jpg"}
                        alt="User Avatar"
                      />
                    </div>
                  </div>
                  {/* القائمة المنسدلة */}
                  <div className="absolute border border-gray-200 right-0 top-[90%] mt-1 bg-white shadow-lg rounded-md w-56 py-3 px-2 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                    <ul className=" ">
                      <NavLink
                        to="/u-profile"
                        className={({ isActive }) =>
                          `p-2 rounded flex items-center gap-2 transition-all duration-300 ${
                            dir === "ltr" ? "pl-2" : "pr-2"
                          } border-b border-gray-200 last:border-none ${
                            isActive
                              ? `bg-[#8826bd35] text-black ${
                                  dir === "ltr" ? "pl-4" : "pr-4"
                                }`
                              : `hover:bg-[#8826bd35] ${
                                  dir === "ltr" ? "hover:pl-4" : "hover:pr-4"
                                }`
                          }`
                        }
                      >
                        <RiProfileFill className="text-lg text-gray-500" />
                        {t("profile_management")}
                      </NavLink>

                      <NavLink
                        to="/u-orders"
                        className={({ isActive }) =>
                          `p-2 rounded flex items-center gap-2 transition-all duration-300 ${
                            dir === "ltr" ? "pl-2" : "pr-2"
                          } border-b border-gray-200 last:border-none ${
                            isActive
                              ? `bg-[#8826bd35] text-black ${
                                  dir === "ltr" ? "pl-4" : "pr-4"
                                }`
                              : `hover:bg-[#8826bd35] ${
                                  dir === "ltr" ? "hover:pl-4" : "hover:pr-4"
                                }`
                          }`
                        }
                      >
                        <TiDocumentText className="text-xl text-secondary" />
                        {t("orders_history")}
                      </NavLink>

                      <NavLink
                        to="/u-compare"
                        className={({ isActive }) =>
                          `p-2 rounded flex items-center gap-2 transition-all duration-300 ${
                            dir === "ltr" ? "pl-2" : "pr-2"
                          } border-b border-gray-200 last:border-none ${
                            isActive
                              ? `bg-[#8826bd35] text-black ${
                                  dir === "ltr" ? "pl-4" : "pr-4"
                                }`
                              : `hover:bg-[#8826bd35] ${
                                  dir === "ltr" ? "hover:pl-4" : "hover:pr-4"
                                }`
                          }`
                        }
                      >
                        <MdCompareArrows className="text-lg text-gray-500" />
                        {t("compare_product")}
                      </NavLink>

                      <NavLink
                        to="/u-favorite"
                        className={({ isActive }) =>
                          `p-2 rounded flex items-center gap-2 transition-all duration-300 ${
                            dir === "ltr" ? "pl-2" : "pr-2"
                          } border-b border-gray-200 last:border-none ${
                            isActive
                              ? `bg-[#8826bd35] text-black ${
                                  dir === "ltr" ? "pl-4" : "pr-4"
                                }`
                              : `hover:bg-[#8826bd35] ${
                                  dir === "ltr" ? "hover:pl-4" : "hover:pr-4"
                                }`
                          }`
                        }
                      >
                        <MdFavorite className="text-lg text-gray-500" />
                        {t("favorite_products")}
                      </NavLink>

                      <li
                        onClick={handleLogout}
                        className={`flex items-center gap-3 px-4 py-2 transition-all duration-400 rounded hover:bg-red-300 cursor-pointer pl-2 pr-2 ${
                          dir === "ltr" ? "hover:pl-4" : "hover:pr-4"
                        } w-full`}
                      >
                        <GrLogout className="text-xl" />
                        {t("logout")}
                      </li>
                    </ul>
                  </div>
                </div>
                <Separator />
              </div>
              <div className="flex gap-4">
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
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <FaRegCircleUser className="text-2xl mt-1 text-secondary cursor-pointer" />
                <Separator />
                <NavLink to="/signin" className="text-secondary text-sm">
                  {t("login")}
                </NavLink>
                <Separator />
              </div>
              <div className="flex items-center gap-2">
                <NavLink to="/signup" className="text-secondary text-sm">
                  {t("signup")}
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
          className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-[999999] overflow-auto"
        />
      )}

      <div
        className={`fixed top-0 ${
          dir === "ltr" ? "left-0" : "right-0"
        } z-[999999] h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ${
          isMenuOpen
            ? "translate-x-0"
            : dir === "ltr"
            ? "-translate-x-full"
            : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-1">
          <div className="text-right p-4">
            <button onClick={closeMenu} className="text-red-500 text-xl">
              <TfiClose />
            </button>
          </div>

          <div className="px-4">
            {uToken ? (
              <div className="flex items-center gap-2 border-b border-gray-200 py-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={user?.avatar || "/images/default-avatar.jpg"}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-sm font-medium">{user?.first_name}</div>
              </div>
            ) : (
              <div className="flex items-center justify-between border-b border-gray-200 py-3">
                <div className="flex items-center gap-2">
                  <FaRegCircleUser className="text-2xl text-secondary" />
                  <NavLink to="/signin" className="text-sm text-secondary">
                    {t("login")}
                  </NavLink>
                </div>
                <NavLink to="/signup" className="text-sm text-secondary">
                  {t("signup")}
                </NavLink>
              </div>
            )}
          </div>

          <ul className="flex flex-col border-b border-gray-200 mt-2">
            {categories?.slice(0, 4).map((category, i) => (
              <NavLink
                key={i}
                to={`/category/${category.id}`}
                className={({ isActive }) =>
                  `px-4 py-3 block rounded transition ${
                    isActive
                      ? "bg-gray-100 text-purple-700 font-semibold"
                      : "hover:bg-[#8826bd35]"
                  }`
                }
              >
                <li>{category.name}</li>
              </NavLink>
            ))}
          </ul>

          {uToken && (
            <>
              <ul className="flex flex-col border-b border-gray-200 mt-2">
                {[
                  { to: "/u-profile", label: t("profile") },
                  { to: "/u-notification", label: t("notifications") },
                  { to: "/u-favorite", label: t("favorite_products") },
                  { to: "/u-compare", label: t("compare_product") },
                ].map((item, idx) => (
                  <NavLink
                    key={idx}
                    to={item.to}
                    className={({ isActive }) =>
                      `px-4 py-3 block rounded transition ${
                        isActive
                          ? "bg-gray-100 text-purple-700 font-semibold"
                          : "hover:bg-[#8826bd35]"
                      }`
                    }
                  >
                    <li>{item.label}</li>
                  </NavLink>
                ))}
              </ul>

              <ul className="flex flex-col mt-2">
                <li
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-100 cursor-pointer"
                >
                  <GrLogout className="text-xl" />
                  {t("logout")}
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
