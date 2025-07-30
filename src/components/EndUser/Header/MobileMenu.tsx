import { useTranslation } from "react-i18next";
import { FaRegCircleUser } from "react-icons/fa6";
import { TfiClose } from "react-icons/tfi";
import { NavLink } from "react-router-dom";
import { useProfile } from "../../../hooks/Api/EndUser/useProfile/useProfile";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import { GrLogout } from "react-icons/gr";
import { Category } from "../../../types/Categories";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { Circles } from "react-loader-spinner";
type Props = {
  dir: string;
  handleLogout: () => void;
  isMenuOpen: boolean;
  closeMenu: () => void;
  uToken: string | null;
};

const MobileMenu = ({
  dir,
  isMenuOpen,
  closeMenu,
  uToken,
  handleLogout,
}: Props) => {
  const { t } = useTranslation(["EndUserHeader"]);
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useProfile();
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useCategories();
  const { lang } = useDirectionAndLanguage();

  const renderUserProfileSection = () => {
    if (uToken) {
      if (isUserLoading) {
        return (
          <div className="flex items-center gap-2 border-b border-gray-200 py-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="text-sm font-medium bg-gray-200 w-24 h-4 animate-pulse rounded"></div>
          </div>
        );
      }
      if (isUserError) {
        // toast.error(t("profileLoadError", { defaultValue: "Failed to load profile." }));
        return (
          <div className="flex items-center justify-between border-b border-gray-200 py-3">
            <div className="flex items-center gap-2">
              <FaRegCircleUser className="text-2xl text-red-500" />
              <span className="text-sm text-red-500">
                {t("profileLoadError", {
                  defaultValue: "فشل تحميل ملف التعريف.",
                })}
              </span>
            </div>
            {/* <NavLink
              to={`/${lang}/signin`}
              className="text-sm text-secondary"
              onClick={closeMenu}
            >
              {t("login")}
            </NavLink> */}
          </div>
        );
      }
      return (
        <div className="flex items-center gap-2 border-b border-gray-200 py-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={user?.avatar || "/images/default-avatar.webp"}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-sm font-medium">{user?.first_name}</div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-between border-b border-gray-200 py-3">
          <div className="flex items-center gap-2">
            <FaRegCircleUser className="text-2xl text-secondary" />
            <NavLink
              to={`/${lang}/signin`}
              className="text-sm text-secondary"
              onClick={closeMenu}
            >
              {t("login")}
            </NavLink>
          </div>
          <NavLink
            to={`/${lang}/signup`}
            className="text-sm text-secondary"
            onClick={closeMenu}
          >
            {t("signup")}
          </NavLink>
        </div>
      );
    }
  };

  const renderCategoriesList = () => {
    if (isCategoriesLoading) {
      return (
        <div className="flex justify-center border-b border-gray-200 items-center py-4">
          <Circles
            height="40"
            width="40"
            color="#542475" // لون ثانوي
            ariaLabel="loading-categories"
          />
        </div>
      );
    }
    if (isCategoriesError) {
      // toast.error(t("categoriesLoadError", { defaultValue: "Failed to load categories." }));
      return (
        <div className="text-center border-b border-gray-200 text-red-500 py-4">
          {t("categoriesLoadError", {
            defaultValue: "فشل تحميل الفئات.",
          })}
        </div>
      );
    }
    if (!categories || categories.length === 0) {
      return (
        <div className="text-center text-gray-500 border-b border-gray-200 py-4">
          {t("noCategoriesFound", { defaultValue: "لا توجد فئات." })}
        </div>
      );
    }

    return (
      <ul className="flex flex-col border-b border-gray-200 mt-2">
        {categories.slice(0, 4).map((category: Category) => (
          <NavLink
            key={category.id}
            to={`/${lang}/category/${category.id}`}
            className={({ isActive }) =>
              `px-4 py-3 block rounded transition ${
                isActive
                  ? "bg-gray-100 text-purple-700 font-semibold"
                  : "hover:bg-[#8826bd35]"
              }`
            }
            onClick={closeMenu}
          >
            <li>{category.name}</li>
          </NavLink>
        ))}
      </ul>
    );
  };

  return (
    <>
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

          <div className="px-4">{renderUserProfileSection()}</div>

          {renderCategoriesList()}

          {uToken && (
            <>
              <ul className="flex flex-col border-b border-gray-200 mt-2">
                {[
                  { to: `/${lang}/u-profile`, label: t("profile") },
                  { to: `/${lang}/u-orders`, label: t("orders_history") },
                  { to: `/${lang}/u-favorite`, label: t("favorite_products") },
                  { to: `/${lang}/u-compare`, label: t("compare_product") },
                  { to: `/${lang}/u-notification`, label: t("notifications") },
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
                    onClick={closeMenu}
                  >
                    <li>{item.label}</li>
                  </NavLink>
                ))}
              </ul>

              <ul className="flex flex-col mt-2">
                <li
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
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
    </>
  );
};

export default MobileMenu;
