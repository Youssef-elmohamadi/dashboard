import { NavLink, useNavigate } from "react-router-dom";
import { handleLogout } from "../../common/Auth/Logout";
import { handleDeleteAccount } from "../Auth/DeleteAccount";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useTranslation } from "react-i18next";
import { useProfile } from "../../../hooks/Api/EndUser/useProfile/useProfile";
import { CloseIcon } from "../../../icons";
import LogoutIcon from "../../../icons/LogoutIcon";
import DeleteIcon from "../../../icons/DeleteIcon";
import HeartIcon from "../../../icons/HeartIcon";
import DocumentIcon from "../../../icons/DocumentIcon";
import ProfileManagementIcon from "../../../icons/ProfileMangementIcon";
import LazyImage from "../../common/LazyImage";

interface MenuSidebarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
}
const MenuSidebar = ({ isMenuOpen, setIsMenuOpen }: MenuSidebarProps) => {
  const { dir } = useDirectionAndLanguage();
  const closeMenu = () => setIsMenuOpen(false);
  const { t } = useTranslation(["EndUserHeader"]);
  const { data: user } = useProfile();
  const navigate = useNavigate();
  const { lang } = useDirectionAndLanguage();
  return (
    <>
      {/* Overlay */}
      {isMenuOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-black/60 z-[9999] transition-opacity duration-300"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
    fixed top-0 z-[10000] h-full w-72 bg-white shadow-lg overflow-y-auto
    transition-transform duration-300 ease-in-out
    ${dir === "ltr" ? "left-0" : "right-0"}
    ${
      isMenuOpen
        ? "translate-x-0"
        : dir === "ltr"
        ? "-translate-x-full"
        : "translate-x-full"
    }
  `}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button onClick={closeMenu} className="text-red-500 text-xl">
            <CloseIcon />
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center gap-1 text-center px-4">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <LazyImage
              src={user?.avatar || "/images/default-avatar.webp"}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="font-semibold">{user?.first_name}</div>
          <div className="text-sm text-gray-500">{user?.email}</div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4 space-y-2">
          {[
            {
              to: `/${lang}/u-profile`,
              icon: <ProfileManagementIcon className="w-4" />,
              label: t("profile_management"),
            },
            {
              to: `/${lang}/u-orders`,
              icon: <DocumentIcon className="w-4" />,
              label: t("orders_history"),
            },
            {
              to: `/${lang}/u-favorite`,
              icon: <HeartIcon className="w-4" />,
              label: t("favorite_products"),
            },
          ].map(({ to, icon, label }, idx) => (
            <NavLink
              key={idx}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded transition-all duration-200 ${
                  isActive
                    ? "bg-purple-50 end-user-text-base font-semibold"
                    : "hover:bg-red-100 text-gray-700"
                }`
              }
            >
              {icon}
              <span className="">{label}</span>
            </NavLink>
          ))}

          {/* Delete Account */}
          <button
            onClick={handleDeleteAccount}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded w-full"
          >
            <DeleteIcon className="w-6 text-[#d62828]" />
            <span className="text-sm">{t("delete_account")}</span>
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              handleLogout("end_user", navigate, lang);
            }}
            className="flex items-center gap-3 p-2 hover:bg-red-100 rounded w-full"
          >
            <LogoutIcon className="w-6 text-[#d62828] text-error-500" />
            <span className="text-sm">{t("logout")}</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default MenuSidebar;
