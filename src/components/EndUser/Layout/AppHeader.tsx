import React, { useRef, useState, Suspense, lazy } from "react"; // استيراد lazy و Suspense
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoIosMenu } from "react-icons/io";
import { Separator } from "../../EndUser/Common/Separator";
import { MdOutlineCompareArrows } from "react-icons/md";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useTranslation } from "react-i18next";
import { useProfile } from "../../../hooks/Api/EndUser/useProfile/useProfile";
// import MobileMenu from "./MobileMenu"; // سنقوم بتحميلها كسولاً
import { useAllFavoriteProducts } from "../../../hooks/Api/EndUser/useProducts/useFavoriteProducts";
import { FavoriteProductsIcon } from "./FavoriteProductsIcon"; // هذه الأيقونة صغيرة ويفضل عدم تحميلها كسولاً
import { handleLogout } from "../../common/Auth/Logout";

// تعريف المكونات التي سيتم تحميلها كسولاً
const LazyMobileMenu = lazy(() => import("./MobileMenu"));
const LazyUserAccountDropdown = lazy(() => import("./UserAccountDropdown"));
const LazyNotificationIcon = lazy(() => import("./NotificationIcon"));

const AppHeader = () => {
  const uToken = localStorage.getItem("end_user_token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const notificationIconRef = useRef<HTMLDivElement>(null);

  const { dir } = useDirectionAndLanguage();
  const navigate = useNavigate();
  const { t } = useTranslation(["EndUserHeader"]);
  const { lang } = useParams();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const onCloseNotification = () => {
    setOpenNotification(false);
  };

  const toggleNotification = (event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenNotification((prev) => !prev);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen((prev) => !prev);
  };

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useProfile();

  const {
    data: favoriteProductsData,
    isLoading: isFavoriteLoading,
    isError: isFavoriteError,
  } = useAllFavoriteProducts();

  const favoriteCount = favoriteProductsData?.pages?.[0]?.total;

  const handleUserLogout = () => {
    handleLogout("end_user", navigate);
  };

  const altTexts = {
    logo: {
      ar: "تشطيبة - السوق الإلكتروني",
      en: "Tashtiba - Online Marketplace",
    },
    avatar: {
      ar: "صورة مستخدم تشطيبة",
      en: "Tashtiba User Avatar",
    },
  };

  return (
    <div>
      <header className="enduser_container py-4 flex items-center justify-start gap-12 relative">
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
                  src="/images/logo/light-logo.webp"
                  className="w-[150px] hover:opacity-90 transition duration-300 h-[46px]"
                  alt={lang === "ar" ? altTexts.logo.ar : altTexts.logo.en}
                />
              </NavLink>
            </div>
          </div>
          <div className="md:hidden">
            <CiSearch
              className="text-2xl cursor-pointer"
              onClick={toggleMobileSearch}
            />
          </div>
        </div>

        {isMobileSearchOpen && (
          <div
            className={`absolute -top-28 w-full left-0 right-0 z-50 bg-white p-4 md:hidden
              transition-all duration-300 ease-in-out transform ${
                isMobileSearchOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-full opacity-0"
              }`}
          >
            <CiSearch
              className="text-2xl cursor-pointer"
              onClick={toggleMobileSearch}
            />
            <div className="flex items-center gap-2 relative w-full">
              <input
                type="text"
                placeholder={t("search_placeholder")}
                className="rounded-full text-sm px-4 py-2 border border-gray-200 focus:outline-none w-full"
              />
              <div
                className={`absolute ${dir === "ltr" ? "right-4" : "left-4"}`}
              >
                <CiSearch className="text-2xl" />
              </div>
            </div>
          </div>
        )}

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
        <div className="hidden lg:flex items-center justify-end gap-2 flex-[1]">
          {uToken ? (
            <>
              <div className="flex items-center gap-2">
                {/* تحميل UserAccountDropdown كسولاً */}
                <Suspense fallback={null}>
                  <LazyUserAccountDropdown
                    user={user}
                    isLoading={isUserLoading}
                    isError={isUserError}
                    handleUserLogout={handleUserLogout}
                    dir={dir}
                    lang={lang}
                    altTexts={altTexts}
                  />
                </Suspense>
                <Separator />
              </div>
              <div className="flex gap-4">
                {/* تحميل NotificationIcon كسولاً */}
                <Suspense fallback={null}>
                  <LazyNotificationIcon
                    openNotification={openNotification}
                    toggleNotification={toggleNotification}
                    onCloseNotification={onCloseNotification}
                    notificationIconRef={notificationIconRef}
                  />
                </Suspense>
                <FavoriteProductsIcon // ترك FavoriteProductsIcon كما هي لكونها صغيرة
                  favoriteCount={favoriteCount}
                  lang={lang}
                />
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
                <NavLink
                  to={`/${lang}/signin`}
                  className="text-secondary text-sm"
                >
                  {t("login")}
                </NavLink>
                <Separator />
              </div>
              <div className="flex items-center gap-2">
                <NavLink
                  to={`/${lang}/signup`}
                  className="text-secondary text-sm"
                >
                  {t("signup")}
                </NavLink>
              </div>
            </>
          )}
        </div>
      </header>

      {isMenuOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-[999999] overflow-auto"
        />
      )}
      {/* تحميل MobileMenu كسولاً */}
      <Suspense fallback={null}>
        <LazyMobileMenu
          dir={dir}
          isMenuOpen={isMenuOpen}
          closeMenu={closeMenu}
          uToken={uToken}
          handleLogout={handleUserLogout}
        />
      </Suspense>
    </div>
  );
};

export default AppHeader;
