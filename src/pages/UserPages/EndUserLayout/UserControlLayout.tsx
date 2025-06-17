import { Outlet, NavLink } from "react-router-dom";
import { TiDocumentText } from "react-icons/ti";
import { getProfile } from "../../../api/EndUserApi/endUserAuth/_requests";
import { handleLogout } from "../../../components/common/Logout";
import { handleDeleteAccount } from "../../../components/EndUser/Auth/DeleteAccount";
import { RiProfileFill } from "react-icons/ri";
import { MdCompareArrows, MdDelete, MdFavorite } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
export default function UserControlLayout() {
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["endUserProfileData"],
    queryFn: async () => {
      const res = await getProfile();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
  const { t } = useTranslation(["EndUserControlMenu"]);
  return (
    <div className="flex flex-row min-h-screen">
      <aside className="w-72 bg-white p-4 border-r border-gray-200 shadow hidden lg:block ">
        <div className="space-y-4 ">
          <div className="text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full  ">
              <img
                src={user?.avatar || "/images/default-avatar.jpg"}
                className="w-full h-full rounded-full"
                alt="User Avatar"
              />
            </div>
            <div className="text-center">{user?.first_name}</div>
            <div className="text-sm text-gray-500">{user?.email}</div>
          </div>
          <nav className="space-y-2 mt-6">
            {/* <Link
              to="/u-dashboard"
              className="p-2 rounded hover:bg-gray-100 flex items-center gap-2"
            >
              <AiOutlineHome className="text-lg text-gray-500" />
              Dashboard
            </Link> */}
            <NavLink
              to="/u-profile"
              className={({ isActive }) =>
                `p-2 px-3 rounded-3xl flex items-center group gap-2 transition-all duration-300 pl-2 ${
                  isActive
                    ? "bg-[#8826bd35] pl-4"
                    : "hover:bg-[#8826bd35] hover:pl-4"
                }`
              }
            >
              <RiProfileFill className="text-lg text-gray-500 transition-all duration-300" />
              {t("profile_management")}
            </NavLink>
            <NavLink
              to="/u-orders"
              className={({ isActive }) =>
                `p-2 px-3 rounded-3xl flex items-center group gap-2 transition-all duration-300 pl-2 ${
                  isActive
                    ? "bg-[#8826bd35] pl-4"
                    : "hover:bg-[#8826bd35] hover:pl-4"
                }`
              }
            >
              <TiDocumentText className="text-lg text-gray-500 transition-all duration-300" />
              {t("orders_history")}
            </NavLink>
            {/* <Link
              to="/u-downloads"
              className="p-2 rounded hover:bg-gray-100 flex items-center gap-2"
            >
              <TiDownload className="text-lg text-gray-500" />
              Downloads
            </Link> */}
            {/* <Link
              to="/u-conversation"
              className="p-2 rounded hover:bg-gray-100 flex items-center gap-2"
            >
              <TiDocumentText className="text-lg text-gray-500" />
              Conversation
            </Link> */}
            {/* <Link
              to="/u-wallet"
              className="p-2 rounded hover:bg-gray-100 flex items-center gap-2"
            >
              <TfiWallet className="text-lg text-gray-500" />
              Wallet
            </Link> */}
            {/* <Link
              to="/u-support-ticket"
              className="p-2 rounded hover:bg-gray-100 flex items-center gap-2"
            >
              <TiSupport className="text-lg text-gray-500" />
              Support Ticket
            </Link> */}

            <NavLink
              to="/u-compare"
              className={({ isActive }) =>
                `p-2 px-3 rounded-3xl flex items-center group gap-2 transition-all duration-300 pl-2 ${
                  isActive
                    ? "bg-[#8826bd35] pl-4"
                    : "hover:bg-[#8826bd35] hover:pl-4"
                }`
              }
            >
              <MdCompareArrows className="text-lg text-gray-500  transition-all duration-300" />
              {t("compare_product")}
            </NavLink>
            <NavLink
              to="/u-favorite"
              className={({ isActive }) =>
                `p-2 px-3 rounded-3xl flex items-center group gap-2 transition-all duration-300 pl-2 ${
                  isActive
                    ? "bg-[#8826bd35] pl-4"
                    : "hover:bg-[#8826bd35] hover:pl-4"
                }`
              }
            >
              <MdFavorite className="text-lg text-gray-500 transition duration-400" />
              {t("favorite_products")}
            </NavLink>
            <button
              onClick={() => {
                handleLogout("end_user");
              }}
              className="flex items-center group gap-3 transition-all duration-400 px-4 py-2 rounded-3xl hover:bg-red-300 cursor-pointer pl-2 hover:pl-4 w-full"
            >
              <BiLogOut className="text-lg text-gray-500 transition duration-400  " />
              {t("logout")}
            </button>
            <button
              onClick={handleDeleteAccount}
              className="p-2 px-3 w-full rounded-3xl group hover:bg-red-300 flex items-center gap-2 transition-all duration-300 pl-2 hover:pl-4 "
            >
              <MdDelete className="text-lg text-gray-500 transition-all duration-400" />
              {t("delete_account")}
            </button>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
