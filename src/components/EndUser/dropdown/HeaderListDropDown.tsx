import { useTranslation } from "react-i18next";
import { GrLogout } from "react-icons/gr";
import { MdCompareArrows, MdFavorite } from "react-icons/md";
import { RiProfileFill } from "react-icons/ri";
import { TiDocumentText } from "react-icons/ti";
import { NavLink } from "react-router-dom";
type Props = {
  dir: string;
  handleLogout: () => void;
};
const HeaderListDropDown = ({ dir, handleLogout }: Props) => {
  const { t } = useTranslation(["EndUserHeader"]);
  return (
    <>
      <ul className=" ">
        <NavLink
          to="/u-profile"
          className={({ isActive }) =>
            `p-2 rounded flex items-center gap-2 transition-all duration-300 ${
              dir === "ltr" ? "pl-2" : "pr-2"
            } border-b border-gray-200 last:border-none ${
              isActive
                ? `bg-[#8826bd35] text-black ${dir === "ltr" ? "pl-4" : "pr-4"}`
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
                ? `bg-[#8826bd35] text-black ${dir === "ltr" ? "pl-4" : "pr-4"}`
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
                ? `bg-[#8826bd35] text-black ${dir === "ltr" ? "pl-4" : "pr-4"}`
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
                ? `bg-[#8826bd35] text-black ${dir === "ltr" ? "pl-4" : "pr-4"}`
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
    </>
  );
};

export default HeaderListDropDown;
