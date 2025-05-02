import React from "react";
import { BiLogOut } from "react-icons/bi";
import { MdCompareArrows, MdDelete, MdFavorite } from "react-icons/md";
import { RiProfileFill } from "react-icons/ri";
import { TfiClose } from "react-icons/tfi";
import { TiDocumentText } from "react-icons/ti";
import { Link } from "react-router-dom";

const MenuSidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const closeMenu = () => setIsMenuOpen(false);
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
                src="/images/cards/card-01.jpg"
                className="w-full h-full rounded-full"
                alt="User Avatar"
              />
            </div>
            <div className="font-semibold">Youssef</div>
            <div className="text-sm text-gray-500">youssef@yahoo.com</div>
          </div>
          <nav className="space-y-2 mt-6">
            {/* <Link
              to="/u-dashboard"
              className="p-2 rounded hover:bg-gray-100 flex items-center gap-2"
            >
              <AiOutlineHome className="text-lg text-gray-500" />
              Dashboard
            </Link> */}
            <Link
              to="/u-profile"
              className="p-2 rounded hover:bg-gray-100 flex items-center gap-2"
            >
              <RiProfileFill className="text-lg text-gray-500" />
              Profile Management
            </Link>
            <Link
              to="/u-orders"
              className="p-2 rounded hover:bg-gray-100 flex items-center gap-2"
            >
              <TiDocumentText className="text-lg text-gray-500" />
              Orders History
            </Link>
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

            <Link
              to="/u-compare"
              className="p-2 rounded hover:bg-gray-100 flex items-center gap-2"
            >
              <MdCompareArrows className="text-lg text-gray-500" />
              Compare Product
            </Link>
            <Link
              to="/u-Profile"
              className="p-2 rounded hover:bg-gray-100 flex items-center gap-2"
            >
              <MdFavorite className="text-lg text-gray-500" />
              Favorite Products
            </Link>
            <button className="p-2 w-full rounded hover:bg-gray-100 flex items-center gap-2">
              <MdDelete className="text-lg text-error-500" />
              Delete Account
            </button>
            <button className="p-2 w-full rounded hover:bg-gray-100 flex items-center gap-2">
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
