import React, { useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { CiSearch } from "react-icons/ci";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoIosMenu } from "react-icons/io";
import { Separator } from "../Separator/Separator";
import {
  MdFavorite,
  MdNotifications,
  MdOutlineCompareArrows,
} from "react-icons/md";
import { handleLogout } from "../../common/Logout";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useTranslation } from "react-i18next";
import NotificationDropdown from "../dropdown/Dropdown";
import HeaderListDropDown from "../dropdown/HeaderListDropDown";
import { useProfile } from "../../../hooks/Api/EndUser/useProfile/useProfile";
import MobileMenu from "./MobileMenu";
import { useAllFavoriteProducts } from "../../../hooks/Api/EndUser/useProducts/useFavoriteProducts";
const AppHeader = () => {
  const uToken = localStorage.getItem("end_user_token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const notificationIconRef = useRef<HTMLDivElement>(null); // مرجع جديد لأيقونة الإشعارات
  const { items } = useSelector((state: any) => state.wishList);
  const { dir } = useDirectionAndLanguage();
  const navigate = useNavigate();
  const { t } = useTranslation(["EndUserHeader"]);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const onCloseNotification = () => {
    setOpenNotification(false);
  };

  const toggleNotification = (event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenNotification((prev) => {
      return !prev;
    });
  };
  const { data: user } = useProfile();
  const { data } = useAllFavoriteProducts();
  const favoriteCount = data?.pages[0].total;
  const { lang } = useParams();
  const altTexts = {
    logo: {
      ar: "تاشتيبا - السوق الإلكتروني",
      en: "Tashtiba - Online Marketplace",
    },
    avatar: {
      ar: "صورة مستخدم تاشتيبا",
      en: "Tashtiba User Avatar",
    },
  };
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
              <NavLink to={`/${lang}/`}>
                <img
                  src="/images/logo/logo.png"
                  className="w-32"
                  alt={lang === "ar" ? altTexts.logo.ar : altTexts.logo.en}
                />
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
                        alt={
                          lang === "ar"
                            ? altTexts.avatar.ar
                            : altTexts.avatar.en
                        }
                      />
                    </div>
                  </div>
                  {/* القائمة المنسدلة */}
                  <div className="absolute border border-gray-200 right-0 top-[90%] mt-1 bg-white shadow-lg rounded-md w-56 py-3 px-2 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                    <HeaderListDropDown
                      handleLogout={() => {
                        handleLogout("end_user", navigate);
                      }}
                      dir={dir}
                    />
                  </div>
                </div>
                <Separator />
              </div>
              <div className="flex gap-4 ">
                <div className="relative">
                  <div
                    ref={notificationIconRef}
                    onClick={toggleNotification}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <MdNotifications className="text-2xl text-secondary" />
                  </div>

                  {openNotification && (
                    <div className="absolute top-full right-0 z-50">
                      <NotificationDropdown
                        open={openNotification}
                        onClose={onCloseNotification}
                        notificationIconRef={notificationIconRef} // تمرير المرجع
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 relative">
                  <NavLink to={`/${lang}/u-favorite`}>
                    {items && (
                      <div className="absolute -top-2 -right-2 bg-purple-700 w-5 h-5 flex justify-center items-center rounded-full text-white text-xs">
                        {favoriteCount}
                      </div>
                    )}
                    <MdFavorite className="text-2xl text-secondary" />
                  </NavLink>
                </div>
                <div className="flex items-center gap-2">
                  <NavLink to={`/${lang}/u-compare`}>
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
      <MobileMenu
        dir={dir}
        isMenuOpen={isMenuOpen}
        closeMenu={closeMenu}
        uToken={uToken}
        handleLogout={() => {
          handleLogout("end_user", navigate);
        }}
      />
    </div>
  );
};

export default AppHeader;
