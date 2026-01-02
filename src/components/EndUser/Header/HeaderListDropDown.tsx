import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { HeaderListDropDownProps } from "../../../types/Header";
import ProfileManagementIcon from "../../../icons/ProfileMangementIcon";
import DocumentIcon from "../../../icons/DocumentIcon";
import HeartIcon from "../../../icons/HeartIcon";
import NotificationsIcon from "../../../icons/NotificationIcon";
import LogoutIcon from "../../../icons/LogoutIcon";

interface NavItem {
  to: (lang: string) => string;
  icon: React.ElementType;
  textKey: string;
  iconColorClass?: string;
}

const HeaderListDropDown = ({ dir, handleLogout }: HeaderListDropDownProps) => {
  const { lang } = useDirectionAndLanguage();
  const { t } = useTranslation();

  const navItems: NavItem[] = [
    {
      to: (currentLang) => `/${currentLang}/u-profile`,
      icon: ProfileManagementIcon,
      textKey: "Common:Header.profile",
      iconColorClass: "text-[#d62828]",
    },
    {
      to: (currentLang) => `/${currentLang}/u-orders`,
      icon: DocumentIcon,
      textKey: "Common:Header.orders_history",
      iconColorClass: "text-[#d62828]",
    },
    {
      to: (currentLang) => `/${currentLang}/u-favorite`,
      icon: HeartIcon,
      textKey: "Common:Header.favorite_products",
      iconColorClass: "text-[#d62828]",
    },
    {
      to: (currentLang) => `/${currentLang}/u-notification`,
      icon: NotificationsIcon,
      textKey: "Common:Header.notifications",
      iconColorClass: "text-[#d62828]",
    },
  ];

  const getNavLinkClasses = (isActive: boolean, currentDir: "ltr" | "rtl") => {
    const baseClasses = `p-2 rounded flex items-center gap-2 transition-all duration-300 border-b border-gray-200 last:border-none`;
    const paddingClasses = currentDir === "ltr" ? "pl-2" : "pr-2";
    const activeClasses = `bg-[#8826bd35] text-black ${
      currentDir === "ltr" ? "pl-4" : "pr-4"
    }`;
    const hoverClasses = `hover:bg-red-200 ${
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
            <item.icon className={`w-6 ${item.iconColorClass}`} />
            {t(item.textKey)}
          </NavLink>
        ))}
        <li
          onClick={handleLogout}
          className={`flex items-center gap-3 px-4 py-2 transition-all duration-400 rounded hover:bg-red-200 cursor-pointer pl-2 pr-2 ${
            dir === "ltr" ? "hover:pl-4" : "hover:pr-4"
          } w-full`}
        >
          <LogoutIcon className="w-6 text-[#d62828]" />
          {t("Common:Buttons.logout")}
        </li>
      </ul>
    </>
  );
};

export default HeaderListDropDown;
