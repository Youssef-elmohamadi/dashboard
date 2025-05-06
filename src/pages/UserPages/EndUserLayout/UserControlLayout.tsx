import { Outlet, Link, NavLink } from "react-router-dom";
import { TiDocumentText, TiInfoLargeOutline, TiSupport } from "react-icons/ti";
import { getProfile } from "../../../api/EndUserApi/endUserAuth/_requests";
import { useEffect, useState } from "react";
import { handleLogout } from "../../../components/EndUser/Auth/Logout";
import { handleDeleteAccount } from "../../../components/EndUser/Auth/DeleteAccount";
import { RiProfileFill } from "react-icons/ri";
import { MdCompareArrows, MdDelete, MdFavorite } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
export default function UserControlLayout() {
  const [user, setUser] = useState({});
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setUser(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, []);
  return (
    <div className="flex flex-row min-h-screen">
      <aside className="w-64 bg-white p-4 border-r shadow hidden lg:block ">
        <div className="space-y-4 ">
          <div className="text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full  ">
              <img
                src={user?.avatar || "/images/default-avatar.jpg"}
                className="w-full h-full rounded-full"
                alt="User Avatar"
              />
            </div>
            <div className="font-semibold">
              {user?.first_name} {user?.last_name}
            </div>
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
                `p-2 rounded flex items-center gap-2 ${
                  isActive
                    ? "bg-gray-100 text-purple-700 font-semibold"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <RiProfileFill className="text-lg text-gray-500" />
              Profile Management
            </NavLink>
            <NavLink
              to="/u-orders"
              className={({ isActive }) =>
                `p-2 rounded flex items-center gap-2 ${
                  isActive
                    ? "bg-gray-100 text-purple-700 font-semibold"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <TiDocumentText className="text-lg text-gray-500" />
              Orders History
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
                `p-2 rounded flex items-center gap-2 ${
                  isActive
                    ? "bg-gray-100 text-purple-700 font-semibold"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <MdCompareArrows className="text-lg text-gray-500" />
              Compare Product
            </NavLink>
            <NavLink
              to="/u-favorite"
              className={({ isActive }) =>
                `p-2 rounded flex items-center gap-2 ${
                  isActive
                    ? "bg-gray-100 text-purple-700 font-semibold"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <MdFavorite className="text-lg text-gray-500" />
              Favorite Products
            </NavLink>
            <button
              onClick={handleDeleteAccount}
              className="p-2 w-full rounded hover:bg-gray-100 flex items-center gap-2"
            >
              <MdDelete className="text-lg text-error-500" />
              Delete Account
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-100 cursor-pointer w-full"
            >
              <BiLogOut className="text-lg text-error-500" />
              Logout
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
