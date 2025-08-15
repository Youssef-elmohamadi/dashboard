import { useLocation, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import HomeIcon from "../../../icons/HomeIcon";
import ShopIcon from "../../../icons/ShopIcon";
import CartIcon from "../../../icons/CartIcon";
import NotificationsIcon from "../../../icons/NotificationIcon";
import ProfileIcon from "../../../icons/ProfileIcon";
import { useSelector } from "react-redux";

const BottomNav = () => {
  const location = useLocation();
  const uToken = localStorage.getItem("end_user_token");
  const isLoggedIn = !!uToken;

  const { lang } = useDirectionAndLanguage();
  const { t } = useTranslation(["EndUserBottomNav"]);

  const totalQuantity: number = useSelector(
    (state: any) => state.cart.totalQuantity
  );

  const hiddenRoutes = [
    `/${lang}/signin`,
    `/${lang}/signup`,
    `/end_user/reset-password`,
  ];
  const shouldHide = hiddenRoutes.includes(location.pathname);

  if (shouldHide) {
    return null;
  }

  return (
    <div className="flex justify-center items-center">
      <div className="lg:hidden flex h-20 w-[600px] max-w-full fixed bottom-5 rounded-4xl justify-between items-center px-5 py-2 bg-[rgba(255,255,255,0.9)] border border-gray-200 z-10 shadow-md">
        {/* Home NavLink */}
        <div className="w-1/5 flex flex-col items-center justify-center">
          <NavLink
            to={`/${lang}`}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center transition-colors duration-300 ${
                isActive || location.pathname === `/${lang}`
                  ? "text-[#d62828] font-bold"
                  : "text-gray-700"
              }`
            }
          >
            <HomeIcon size={24} />
            <span className="text-xs mt-1 transition-colors duration-300">
              {t("home")}
            </span>
          </NavLink>
        </div>

        {/* Shop NavLink */}
        <div className="w-1/5 flex flex-col items-center justify-center">
          <NavLink
            to={`/${lang}/category`}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center transition-colors duration-300 ${
                isActive ? "text-[#d62828] font-bold" : "text-gray-700"
              }`
            }
          >
            <ShopIcon className="w-7" />
            <span className="text-xs mt-1 transition-colors duration-300">
              {t("shop")}
            </span>
          </NavLink>
        </div>

        {/* Cart NavLink */}
        {isLoggedIn && (
          <div className="w-1/5 flex flex-col items-center justify-center relative">
            <NavLink
              to={`/${lang}/cart`}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center transition-colors duration-300 ${
                  isActive ? "text-[#d62828] font-bold" : "text-gray-700"
                }`
              }
            >
              <CartIcon className="w-7" />
              <span className="text-xs mt-1 transition-colors duration-300">
                {t("cart")}
              </span>
            </NavLink>
            {totalQuantity > 0 && (
              <span className="absolute -top-1 right-8 w-5 h-5 rounded-full bg-[#d62828] text-white text-xs flex items-center justify-center font-bold">
                {totalQuantity}
              </span>
            )}
          </div>
        )}

        {/* Notifications NavLink */}
        {isLoggedIn && (
          <div className="w-1/5 flex flex-col items-center justify-center">
            <NavLink
              to={`/${lang}/u-notification`}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center transition-colors duration-300 ${
                  isActive ? "text-[#d62828] font-bold" : "text-gray-700"
                }`
              }
            >
              <NotificationsIcon className="w-7" />
              <span className="text-xs mt-1 transition-colors duration-300">
                {t("notification")}
              </span>
            </NavLink>
          </div>
        )}

        {/* Profile NavLink */}
        <div className="w-1/5 flex flex-col items-center justify-center">
          <NavLink
            to={isLoggedIn ? `/${lang}/u-profile` : `/${lang}/signin`}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center transition-colors duration-300 ${
                isActive ? "text-[#d62828] font-bold" : "text-gray-700"
              }`
            }
          >
            <ProfileIcon className="w-7" />
            <span className="text-xs mt-1 transition-colors duration-300">
              {t("profile")}
            </span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
