import React from "react"; // تأكد من استيراد React إذا لم يكن موجودًا
import { useTranslation } from "react-i18next";
import { GrLogout } from "react-icons/gr";
import { MdCompareArrows, MdFavorite } from "react-icons/md";
import { RiProfileFill } from "react-icons/ri";
import { TiDocumentText } from "react-icons/ti";
import { NavLink } from "react-router-dom";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { HeaderListDropDownProps } from "../../../types/Header";
import { IoNotifications } from "react-icons/io5";

interface NavItem {
  to: (lang: string) => string;
  icon: React.ElementType;
  textKey: string;
  iconColorClass?: string;
}

const HeaderListDropDown = ({ dir, handleLogout }: HeaderListDropDownProps) => {
  const { lang } = useDirectionAndLanguage();
  const { t } = useTranslation(["EndUserHeader"]);

  const navItems: NavItem[] = [
    {
      to: (currentLang) => `/${currentLang}/u-profile`,
      icon: RiProfileFill,
      textKey: "profile_management",
      iconColorClass: "text-gray-500",
    },
    {
      to: (currentLang) => `/${currentLang}/u-orders`,
      icon: TiDocumentText,
      textKey: "orders_history",
      iconColorClass: "text-secondary",
    },
    {
      to: (currentLang) => `/${currentLang}/u-compare`,
      icon: MdCompareArrows,
      textKey: "compare_product",
      iconColorClass: "text-gray-500",
    },
    {
      to: (currentLang) => `/${currentLang}/u-favorite`,
      icon: MdFavorite,
      textKey: "favorite_products",
      iconColorClass: "text-gray-500",
    },
    {
      to: (currentLang) => `/${currentLang}/u-notification`,
      icon: IoNotifications,
      textKey: "notifications",
      iconColorClass: "text-secondary",
    },
  ];

  const getNavLinkClasses = (isActive: boolean, currentDir: "ltr" | "rtl") => {
    const baseClasses = `p-2 rounded flex items-center gap-2 transition-all duration-300 border-b border-gray-200 last:border-none`;
    const paddingClasses = currentDir === "ltr" ? "pl-2" : "pr-2";
    const activeClasses = `bg-[#8826bd35] text-black ${
      currentDir === "ltr" ? "pl-4" : "pr-4"
    }`;
    const hoverClasses = `hover:bg-[#8826bd35] ${
      currentDir === "ltr" ? "hover:pl-4" : "hover:pr-4"
    }`;

    return `${baseClasses} ${paddingClasses} ${
      isActive ? activeClasses : hoverClasses
    }`;
  };

  return (
    <>
      <ul className="">
        {navItems.map((item) => (
          <NavLink
            key={item.textKey}
            to={item.to(lang)}
            className={({ isActive }) =>
              getNavLinkClasses(isActive, dir as "ltr" | "rtl")
            }
          >
            <item.icon className={`text-lg ${item.iconColorClass}`} />
            {t(item.textKey)}
          </NavLink>
        ))}
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
