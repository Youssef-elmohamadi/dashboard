import React, { use } from "react";
import GridShape from "./GridShape";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import ThemeTogglerTwo from "../Theme/ThemeTogglerTwo";
import { useLocation } from "react-router-dom";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
interface AuthLayoutProps {
  children: React.ReactNode;
  userType?: "admin" | "super_admin" | "end_user" | string;
}

export default function AuthLayout({
  children,
  userType = "end_user",
}: AuthLayoutProps) {
  const isRTL = document?.documentElement?.dir === "rtl";
  const { t } = useTranslation(["auth"]);

  const description = {
    admin: t("adminLayoutText"),
    super_admin: t("adminLayoutText"),
    end_user: t("endUserLayoutText"),
  };

  const routeMap: Record<string, string> = {
    admin: "/admin",
    super_admin: "/super_admin",
    end_user: "/",
  };

  const linkTo = routeMap[userType] ?? "/";
  const location = useLocation();
  const { lang } = useDirectionAndLanguage();
  const loginPath =
    location.pathname === `/${lang}/signin` ||
    location.pathname === `/admin/signin` ||
    location.pathname === `/super_admin/signin` ||
    location.pathname === `/super_admin/reset-password` ||
    location.pathname === `/admin/reset-password` ||
    location.pathname === `/end_user/reset-password`;
  return (
    <div className="relative p-4 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        className={`relative flex ${
          loginPath && "items-center"
        } w-full  dark:bg-gray-900 sm:p-0`}
      >
        <div className="flex flex-col justify-center items-center gap-5 w-full h-full lg:w-1/2 p-4 sm:p-0">
          <div className="lg:hidden flex flex-col justify-center lg:flex-row lg:items-center mt-8">
            <Link to={linkTo} className="flex justify-center mb-4">
              <img
                className="h-[76px] w-[200px] mb-3 drop-shadow-lg"
                src={`/images/logo/${lang}-light-logo.webp`}
                alt="Tashtiba logo"
              />
            </Link>
            <p className="text-center text-gray-400 dark:text-white/60">
              {description[userType as keyof typeof description] ??
                description.end_user}
            </p>
          </div>
          {children}
        </div>

        <div className="hidden w-full h-screen lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid sticky top-0">
          <div className="relative flex items-center justify-center z-1">
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Link to={linkTo} className="block mb-4">
                <img
                  className="h-[76px] w-[200px] mb-3 drop-shadow-lg"
                  src={`/images/logo/${lang}-dark-logo.webp`}
                  alt="Tashtiba logo"
                />
              </Link>
              <p className="text-center text-gray-400 dark:text-white/60">
                {description[userType as keyof typeof description] ??
                  description.end_user}
              </p>
            </div>
          </div>
        </div>
      </div>
      {userType !== "end_user" && (
        <div
          className={`fixed z-50 bottom-6 sm:block ${
            isRTL ? "left-6" : "right-6"
          }`}
        >
          <ThemeTogglerTwo />
        </div>
      )}
    </div>
  );
}
