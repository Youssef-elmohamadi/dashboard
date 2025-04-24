import { Outlet, Link } from "react-router-dom";
import {
  TiDocumentText,
  TiDownload,
  TiInfoLargeOutline,
  TiSupport,
} from "react-icons/ti";
import { GrLogout } from "react-icons/gr";
import { BsWechat } from "react-icons/bs";
import { TfiDownload, TfiWallet } from "react-icons/tfi";
import { AiOutlineHome } from "react-icons/ai";
export default function UserControlLayout() {
  return (
    <div className="flex flex-row min-h-screen">
      <aside className="w-64 bg-whitep p-4 border-r shadow">
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
            <Link
              to="/u-dashboard"
              className="p-2 rounded hover:bg-gray-100 flex items-center gap-2"
            >
              <AiOutlineHome className="text-lg text-gray-500" />
              Dashboard
            </Link>
            <Link
              to="/u-orders"
              className="p-2 rounded hover:bg-gray-100 flex items-center gap-2"
            >
              <TiDocumentText className="text-lg text-gray-500" />
              Purchase History
            </Link>
            <Link
              to="/u-downloads"
              className="p-2 rounded hover:bg-gray-100 flex items-center gap-2"
            >
              <TiDownload className="text-lg text-gray-500" />
              Downloads
            </Link>
            <Link
              to="/u-conversation"
              className="p-2 rounded hover:bg-gray-100 flex items-center gap-2"
            >
              <TiDocumentText className="text-lg text-gray-500" />
              Conversation
            </Link>
            <Link
              to="/u-wallet"
              className="p-2 rounded hover:bg-gray-100 flex items-center gap-2"
            >
              <TfiWallet className="text-lg text-gray-500" />
              Wallet
            </Link>
            <Link
              to="/u-support-ticket"
              className="p-2 rounded hover:bg-gray-100 flex items-center gap-2"
            >
              <TiSupport className="text-lg text-gray-500" />
              Support Ticket
            </Link>
            <button className="p-2 w-full rounded hover:bg-gray-100 flex items-center gap-2">
              {" "}
              <TiInfoLargeOutline className="text-lg text-error-500" />
              Logout
            </button>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
