import React, { useEffect, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { MdCompareArrows, MdDelete, MdFavorite } from "react-icons/md";
import { RiProfileFill } from "react-icons/ri";
import { TfiClose } from "react-icons/tfi";
import { TiDocumentText } from "react-icons/ti";
import { Link, NavLink } from "react-router-dom";
import { handleLogout } from "../Auth/Logout";
import { handleDeleteAccount } from "../Auth/DeleteAccount";
import { getProfile } from "../../../api/EndUserApi/endUserAuth/_requests";

const MenuSidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const closeMenu = () => setIsMenuOpen(false);
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
    <>
      {isMenuOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-999999 overflow-auto"
        />
      )}
      <div
        className={`fixed top-0 left-0 overflow-auto z-999999 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-1 mb-2 ">
          <div className="text-right p-4">
            <button onClick={closeMenu} className="text-right text-red-500">
              <TfiClose />
            </button>
          </div>
        </div>
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
      </div>
    </>
  );
};

export default MenuSidebar;
