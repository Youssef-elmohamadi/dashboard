import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { FiShoppingCart, FiUser, FiBell } from "react-icons/fi";
import { useState } from "react";
import MenuSidebar from "../UserControlMobile/MenuSidebar";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const uToken = localStorage.getItem("end_user_token");
  const isLoggedIn = !!uToken;
  const hiddenRoutes = ["/signin", "/signup", "/reset-password"];
  const shouldHide = hiddenRoutes.includes(location.pathname);

  const { t } = useTranslation(["EndUserBottomNav"]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { lang } = useDirectionAndLanguage();
  if (shouldHide) {
    return null;
  }

  return (
    <>
      <MenuSidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div className="flex justify-center items-center">
        <div className="lg:hidden flex h-20 w-[600px] max-w-full fixed bottom-5 rounded-4xl justify-between items-center px-5 py-2 bg-[rgba(255,255,255,0.9)] border border-gray-200 z-10 shadow-md">
          {/* Home */}
          <div className="w-1/5 flex flex-col items-center justify-center text-gray-700">
            <Link
              to={`/${lang}/`}
              className="flex flex-col items-center justify-center"
            >
              <IoHomeOutline size={24} />
              <span className="text-xs mt-1">{t("home")}</span>
            </Link>
          </div>

          {/* Categories */}
          <div className="w-1/5 flex flex-col items-center justify-center text-gray-700">
            <Link
              to={`/${lang}/categories`}
              className="flex flex-col items-center justify-center"
            >
              <BiCategory size={24} />
              <span className="text-xs mt-1">{t("shop")}</span>
            </Link>
          </div>

          {/* Cart */}
          {isLoggedIn && (
            <div className="w-1/5 flex flex-col items-center justify-center text-gray-700">
              <Link
                to={`/${lang}/cart`}
                className="flex flex-col items-center justify-center"
              >
                <FiShoppingCart size={24} />
                <span className="text-xs mt-1">{t("cart")}</span>
              </Link>
            </div>
          )}

          {/* Notifications */}
          {isLoggedIn && (
            <div className="w-1/5 flex flex-col items-center justify-center text-gray-700">
              <Link
                to={`/${lang}/u-notification`}
                className="flex flex-col items-center justify-center"
              >
                <FiBell size={24} />
                <span className="text-xs mt-1">{t("notification")}</span>
              </Link>
            </div>
          )}

          {/* Profile */}
          <div className="w-1/5 flex flex-col items-center justify-center text-gray-700">
            <button
              onClick={() => {
                if (isLoggedIn) {
                  setIsMenuOpen((prev) => !prev);
                } else {
                  navigate("/signin");
                }
              }}
              className="flex flex-col items-center justify-center"
            >
              <FiUser size={24} />
              <span className="text-xs mt-1">{t("profile")}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNav;
