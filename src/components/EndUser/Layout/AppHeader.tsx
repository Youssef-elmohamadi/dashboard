import React, { useRef, useState, Suspense, lazy, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useTranslation } from "react-i18next";
import { useProfile } from "../../../hooks/Api/EndUser/useProfile/useProfile";
import { useAllFavoriteProducts } from "../../../hooks/Api/EndUser/useProducts/useFavoriteProducts";
import { handleLogout } from "../../common/Auth/Logout";

// Lazy Loaded Components
const LazyMobileMenu = lazy(() => import("../Header/MobileMenuContainer"));
// const LazyUserAccountDropdown = lazy(
//   () => import("../Header/UserAccountDropdown")
// );
// const LazyNotificationIcon = lazy(() => import("../Header/NotificationIcon"));

// New Sub-components
import HeaderLeftSection from "../Header/HeaderLeftSection";
import DesktopSearchBar from "../Header/DesktopSearchBar";
import UserActions from "../Header/UserActions";
import GuestActions from "../Header/GuestActions";
import MobileSearchOverlay from "../Header/MobileSearchOverlay";

const AppHeader = () => {
  const uToken = localStorage.getItem("end_user_token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const notificationIconRef = useRef<HTMLDivElement>(null);

  const { dir, lang } = useDirectionAndLanguage();
  const navigate = useNavigate();
  const { t } = useTranslation(["EndUserHeader"]);

  // Toggle functions
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);
  const onCloseNotification = useCallback(() => {
    setOpenNotification(false);
  }, []);
  const toggleNotification = useCallback(() => {
    setOpenNotification((prev) => !prev);
  }, []);
  const toggleMobileSearch = useCallback(() => {
    setIsMobileSearchOpen((prev) => !prev);
  }, []);

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

  // Logout handler
  const handleUserLogout = useCallback(() => {
    handleLogout("end_user", navigate, lang);
  }, [uToken, navigate, lang]);

  // Alt texts for images
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
        {/* Left Section: Mobile Menu Toggle & Logo */}
        <HeaderLeftSection
          lang={lang}
          altTexts={altTexts}
          toggleMenu={toggleMenu}
          toggleMobileSearch={toggleMobileSearch}
        />

        {/* Mobile Search Overlay (conditionally rendered) */}
        <MobileSearchOverlay
          isMobileSearchOpen={isMobileSearchOpen}
          toggleMobileSearch={toggleMobileSearch}
          t={t} // Pass translation function
          dir={dir} // Pass direction
        />

        {/* Desktop Search Bar */}
        <DesktopSearchBar dir={dir} />

        {/* Right Section: User Actions or Guest Actions */}
        <div className="hidden lg:flex items-center justify-end gap-2 flex-[1]">
          {uToken ? (
            <Suspense fallback={null}>
              <UserActions
                user={user}
                isLoading={isUserLoading}
                isError={isUserError}
                handleUserLogout={handleUserLogout}
                dir={dir}
                lang={lang}
                altTexts={altTexts}
                openNotification={openNotification}
                toggleNotification={toggleNotification}
                onCloseNotification={onCloseNotification}
                notificationIconRef={notificationIconRef}
                favoriteCount={favoriteCount}
              />
            </Suspense>
          ) : (
            <GuestActions lang={lang} t={t} />
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay and LazyMobileMenu */}
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

export default React.memo(AppHeader);
