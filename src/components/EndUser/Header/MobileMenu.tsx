import { useTranslation } from "react-i18next";
import { FaRegCircleUser } from "react-icons/fa6";
import { TfiClose } from "react-icons/tfi";
import { NavLink } from "react-router";
import { useProfile } from "../../../hooks/Api/EndUser/useProfile/useProfile";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData";
import { GrLogout } from "react-icons/gr";
type Props = {
    dir: string;
    handleLogout: () => void;
  isMenuOpen: boolean;
  closeMenu: () => void;
  uToken: string | null;
};
type Category = {
  id: string | number;
  name: string;
};
const MobileMenu = ({
  dir,
  isMenuOpen,
  closeMenu,
  uToken,
  handleLogout,
}: Props) => {
  const { t } = useTranslation(["EndUserHeader"]);
  const { data: user } = useProfile();
  const { data: categories } = useCategories();
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
            {categories?.slice(0, 4).map((category: Category, i: number) => (
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
    </>
  );
};

export default MobileMenu;
