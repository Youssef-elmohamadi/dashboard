import { FaRegCircleUser } from "react-icons/fa6";
import HeaderListDropDown from "./HeaderListDropDown";

interface UserAccountDropdownProps {
  user: { first_name?: string; avatar?: string } | undefined;
  isLoading: boolean;
  isError: boolean;
  handleUserLogout: () => void;
  dir: string;
  lang: string | undefined;
  altTexts: { avatar: { ar: string; en: string } };
}
export const UserAccountDropdown: React.FC<UserAccountDropdownProps> = ({
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
        <FaRegCircleUser className="text-2xl" />
        <span>Error loading profile</span>
      </div>
    );
  }

  return (
    <div className="relative group p-2 flex gap-2 items-center">
      <div className="flex gap-3 items-center">
        <div>{user?.first_name}</div>
        <div className="h-8 w-8">
          <img
            className="w-full h-full rounded-full"
            src={user?.avatar || "/images/default-avatar.jpg"}
            alt={lang === "ar" ? altTexts.avatar.ar : altTexts.avatar.en}
          />
        </div>
      </div>
      {/* القائمة المنسدلة */}
      <div className="absolute border border-gray-200 right-0 top-[90%] mt-1 bg-white shadow-lg rounded-md w-56 py-3 px-2 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
        <HeaderListDropDown handleLogout={handleUserLogout} dir={dir} />
      </div>
    </div>
  );
};
