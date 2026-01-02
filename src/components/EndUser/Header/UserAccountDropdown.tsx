import React, { Suspense, lazy } from "react"; // استيراد Suspense و lazy
import ProfileIcon from "../../../icons/ProfileIcon";
import LazyImage from "../../common/LazyImage";

interface UserAccountDropdownProps {
  user: { first_name?: string; avatar?: string } | undefined;
  isLoading: boolean;
  isError: boolean;
  handleUserLogout: () => void;
  dir: string;
  lang: string | undefined;
  altTexts: { avatar: { ar: string; en: string } };
}

const LazyHeaderListDropDown = lazy(() => import("./HeaderListDropDown"));

const UserAccountDropdown: React.FC<UserAccountDropdownProps> = ({
  user,
  isLoading,
  isError,
  handleUserLogout,
  dir,
  lang,
  altTexts,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className="w-24 h-4 bg-gray-200 rounded"></div>
        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 text-red-500">
        <ProfileIcon className="w-6" />
        <span>Error loading profile</span>
      </div>
    );
  }

  return (
    <div className="relative group p-2 flex gap-2 items-center">
      <div className="flex gap-3 items-center">
        <div>{user?.first_name}</div>
        <div className="h-8 w-8">
          <LazyImage
            className="w-full h-full rounded-full"
            src={
              !user?.avatar ||
              user?.avatar.trim() === "" ||
              user?.avatar ===
                "https://tashtiba.com/storage/app/public/content/user/profile/"
                ? "/images/default-avatar.webp"
                : user.avatar
            }
            alt={lang === "ar" ? altTexts.avatar.ar : altTexts.avatar.en}
            width={32}
            height={32}
          />
        </div>
      </div>
      <div className="absolute border border-gray-200 right-0 top-[90%] mt-1 bg-white shadow-lg rounded-md w-56 py-3 px-2 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
        <Suspense fallback={null}>
          <LazyHeaderListDropDown handleLogout={handleUserLogout} dir={dir} />
        </Suspense>
      </div>
    </div>
  );
};

export default UserAccountDropdown;
