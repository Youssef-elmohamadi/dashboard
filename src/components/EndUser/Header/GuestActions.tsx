import React from "react";
import { NavLink } from "react-router-dom";
import { Separator } from "../../EndUser/Common/Separator"; // Adjust path if necessary
import { TFunction } from "i18next";
import ProfileIcon from "../../../icons/ProfileIcon";

interface GuestActionsProps {
  lang: string;
  t: TFunction<"EndUserHeader", undefined>;
}

const GuestActions: React.FC<GuestActionsProps> = ({ lang, t }) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <ProfileIcon className="w-8 mt-1 text-secondary cursor-pointer" />
        <Separator />
        <NavLink to={`/${lang}/signin`} className="text-secondary text-sm">
          {t("login")}
        </NavLink>
        <Separator />
      </div>
      <div className="flex items-center gap-2">
        <NavLink to={`/${lang}/signup`} className="text-secondary text-sm">
          {t("signup")}
        </NavLink>
      </div>
    </>
  );
};

export default React.memo(GuestActions);