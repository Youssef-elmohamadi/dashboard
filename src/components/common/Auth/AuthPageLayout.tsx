import React from "react";
import GridShape from "./GridShape";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import ThemeTogglerTwo from "../Theme/ThemeTogglerTwo";

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

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex justify-center w-full h-screen dark:bg-gray-900 sm:p-0">
        <div className="flex flex-col lg:justify-center items-center gap-5 w-full h-full lg:w-1/2 p-6 sm:p-0">
          <div className="lg:hidden flex flex-col justify-center lg:flex-row lg:items-center mt-8">
            <Link to={linkTo} className="flex justify-center mb-4">
              <img
                className="h-[76px] w-[200px] mb-3 drop-shadow-lg dark:hidden"
                src="/images/logo/light-logo.webp"
                alt="Tashtiba logo "
              />
              <img
                className="h-[76px] w-[200px] mb-3 drop-shadow-lg hidden dark:block"
                src="/images/logo/dark-logo.webp"
                alt="Tashtiba logo "
              />
            </Link>
            <p className="text-center text-gray-400 dark:text-white/60">
              {description[userType as keyof typeof description] ??
                description.end_user}
            </p>
          </div>
          {children}
        </div>

        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Link to={linkTo} className="block mb-4">
                <img
                  className="h-[76px] w-[200px] mb-3 drop-shadow-lg"
                  src="/images/logo/dark-logo.webp"
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

        <div
          className={`fixed z-50 hidden bottom-6 sm:block ${
            isRTL ? "left-6" : "right-6"
          }`}
        >
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
