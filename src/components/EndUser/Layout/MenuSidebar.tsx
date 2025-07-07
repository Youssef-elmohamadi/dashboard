import { BiLogOut } from "react-icons/bi";
import { MdCompareArrows, MdDelete, MdFavorite } from "react-icons/md";
import { RiProfileFill } from "react-icons/ri";
import { TfiClose } from "react-icons/tfi";
import { TiDocumentText } from "react-icons/ti";
import { NavLink, useNavigate } from "react-router-dom";
import { handleLogout } from "../../common/Auth/Logout";
import { handleDeleteAccount } from "../Auth/DeleteAccount";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useTranslation } from "react-i18next";
import { useProfile } from "../../../hooks/Api/EndUser/useProfile/useProfile";

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
            <TfiClose />
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center gap-1 text-center px-4">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src={user?.avatar || "/images/default-avatar.jpg"}
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
              icon: <RiProfileFill className="text-lg" />,
              label: t("profile_management"),
            },
            {
              to: `/${lang}/u-orders`,
              icon: <TiDocumentText className="text-lg" />,
              label: t("orders_history"),
            },
            {
              to: `/${lang}/u-compare`,
              icon: <MdCompareArrows className="text-lg" />,
              label: t("compare_product"),
            },
            {
              to: `/${lang}/u-favorite`,
              icon: <MdFavorite className="text-lg" />,
              label: t("favorite_products"),
            },
          ].map(({ to, icon, label }, idx) => (
            <NavLink
              key={idx}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded transition-all duration-200 ${
                  isActive
                    ? "bg-purple-50 text-purple-700 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
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
            className="flex items-center gap-3 p-2 text-error-600 hover:bg-gray-100 rounded w-full"
          >
            <MdDelete className="text-lg text-error-500" />
            <span className="text-sm">{t("delete_account")}</span>
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              handleLogout("end_user", navigate);
            }}
            className="flex items-center gap-3 p-2 text-red-600 hover:bg-red-100 rounded w-full"
          >
            <BiLogOut className="text-lg text-error-500" />
            <span className="text-sm">{t("logout")}</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default MenuSidebar;
