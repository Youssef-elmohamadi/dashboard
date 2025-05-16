import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useDirectionAndLanguage } from "../../context/DirectionContext";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  GroupIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  TicketsIcon,
  Order,
  UserCircleIcon,
  Category,
  Brand,
  DocsIcon,
  Banners,
} from "../../icons";
import { useSidebar } from "../../context/SidebarContext";
import { PiSignOut } from "react-icons/pi";
import { handleLogout } from "../../components/admin/auth/Logout";
import { useTranslation } from "react-i18next";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
  action?: any;
};
type DashboardSidebarProps = {
  userType: "admin" | "super_admin";
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ userType }) => {
  const { t } = useTranslation(["DashboardSidebar"]);
  const AdminNavItems: NavItem[] = [
    {
      icon: <BoxCubeIcon />,
      name: t("Home"),
      path: "/admin",
    },
    {
      icon: <GroupIcon />,
      name: t("User Management"),
      subItems: [
        { name: t("Users"), path: "/admin/admins", pro: false },
        { name: t("Roles"), path: "/admin/roles", pro: false },
      ],
    },
    {
      icon: <BoxCubeIcon />,
      name: t("Products"),
      path: "/admin/products",
    },
    {
      icon: <Category />,
      name: t("Categories"),
      path: "/admin/categories",
    },
    {
      icon: <Order />,
      name: t("Orders"),
      path: "/admin/orders",
    },
    {
      icon: <TicketsIcon />,
      name: t("Coupons"),
      path: "/admin/coupons",
    },
    {
      icon: <Brand />,
      name: t("Brands"),
      path: "/admin/brands",
    },
    {
      icon: <DocsIcon />,
      name: t("Reports"),
      subItems: [
        { name: t("Orders Report"), path: "/admin/orders_report", pro: false },
        {
          name: t("Products Report"),
          path: "/admin/products_report",
          pro: false,
        },
      ],
    },
    {
      icon: <UserCircleIcon />,
      name: t("Vendor Settings"),
      path: "/admin/Settings",
    },
    {
      icon: <UserCircleIcon />,
      name: t("User Profile"),
      path: "/admin/profile",
    },
    {
      icon: <PiSignOut />,
      name: t("Logout"),
      action: handleLogout,
    },
    // {
    //   icon: <CalenderIcon />,
    //   name: "Calendar",
    //   path: "/calendar",
    // },
    // {
    //   name: "Forms",
    //   icon: <ListIcon />,
    //   subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
    // },
    // {
    //   name: "Tables",
    //   icon: <TableIcon />,
    //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
    // },
    // {
    //   name: "Pages",
    //   icon: <PageIcon />,
    //   subItems: [
    //     { name: "Blank Page", path: "/blank", pro: false },
    //     { name: "404 Error", path: "/error-404", pro: false },
    //   ],
    // },
  ];
  const SuperAdminNavItems: NavItem[] = [
    {
      icon: <BoxCubeIcon />,
      name: t("Home"),
      path: "/super_admin",
    },
    {
      icon: <GroupIcon />,
      name: t("User Management"),
      subItems: [
        { name: t("Users"), path: "/super_admin/admins", pro: false },
        { name: t("Roles"), path: "/super_admin/roles", pro: false },
      ],
    },
    {
      icon: <GroupIcon />,
      name: t("vendorsManagement"),
      path: "/super_admin/vendors",
    },
    {
      icon: <Category />,
      name: t("Categories"),
      path: "/super_admin/categories",
    },
    {
      icon: <Brand />,
      name: t("Brands"),
      path: "/super_admin/brands",
    },
    {
      icon: <BoxCubeIcon />,
      name: t("Products"),
      path: "/super_admin/products",
    },
    {
      icon: <Banners />,
      name: t("bannersManagement"),
      path: "/super_admin/banners",
    },
    {
      icon: <UserCircleIcon />,
      name: t("User Profile"),
      path: "/super_admin/profile",
    },
    {
      icon: <PiSignOut />,
      name: t("Logout"),
      action: handleLogout,
    },
  ];
  const currentNavItems =
    userType === "super_admin" ? SuperAdminNavItems : AdminNavItems;
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { dir } = useDirectionAndLanguage();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  //const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) =>
      location.pathname === path ||
      location.pathname.startsWith(`${path}/update`) ||
      location.pathname.startsWith(`${path}/details`) ||
      location.pathname === `${path}/create`,

    [location.pathname]
  );

  ////////////

  useEffect(() => {
    let submenuMatched = false;
    const items =
      userType === "super_admin" ? SuperAdminNavItems : AdminNavItems;
    items.some((nav, index) => {
      if (nav.subItems) {
        nav.subItems.some((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({
              type: "main",
              index,
            });
            submenuMatched = true;
          }
        });
      }
    });
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);
  //////////////////

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);
  const hasActiveSubItem = (subItems?: { path: string }[]) => {
    return subItems?.some((item) => isActive(item.path));
  };
  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                (openSubmenu?.type === menuType &&
                  openSubmenu?.index === index) ||
                hasActiveSubItem(nav.subItems)
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  (openSubmenu?.type === menuType &&
                    openSubmenu?.index === index) ||
                  hasActiveSubItem(nav.subItems)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ms-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            (nav.path || nav.action) &&
            (nav.path ? (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            ) : (
              <button
                onClick={nav.action}
                className={`menu-item group menu-item-inactive`}
              >
                <span className="menu-item-icon-size menu-item-icon-inactive">
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </button>
            ))
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ms-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ms-auto">
                        {subItem.new && (
                          <span
                            className={`ms-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ms-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-s border-gray-200 
    ${
      isExpanded || isMobileOpen
        ? "w-[290px]"
        : isHovered
        ? "w-[290px]"
        : "w-[90px]"
    }
    ${
      isMobileOpen
        ? "translate-x-0"
        : dir === "rtl"
        ? "translate-x-full"
        : "-translate-x-full"
    }
    lg:translate-x-0
    ${dir === "rtl" ? "right-0" : "left-0"}
  `}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        {userType === "admin" ? (
          <Link to="/admin">
            {isExpanded || isHovered || isMobileOpen ? (
              <>
                <img
                  className="dark:hidden"
                  src="/images/logo/logo.png"
                  alt="Logo"
                  width={150}
                  height={40}
                />
                <img
                  className="hidden dark:block"
                  src="/images/logo/logo-white.png"
                  alt="Logo"
                  width={150}
                  height={40}
                />
              </>
            ) : (
              <img
                src="/images/logo/logo-icon.svg"
                alt="Logo"
                width={32}
                height={32}
              />
            )}
          </Link>
        ) : (
          <Link to="/super_admin">
            {isExpanded || isHovered || isMobileOpen ? (
              <>
                <img
                  className="dark:hidden"
                  src="/images/logo/logo.png"
                  alt="Logo"
                  width={150}
                  height={40}
                />
                <img
                  className="hidden dark:block"
                  src="/images/logo/logo-white.png"
                  alt="Logo"
                  width={150}
                  height={40}
                />
              </>
            ) : (
              <img
                src="/images/logo/logo-icon.svg"
                alt="Logo"
                width={32}
                height={32}
              />
            )}
          </Link>
        )}
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  t("Menu")
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(currentNavItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
