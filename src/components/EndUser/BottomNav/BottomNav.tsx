import { useLocation } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { FiShoppingCart, FiUser, FiBell } from "react-icons/fi";

const BottomNav = () => {
  const location = useLocation();
  const hiddenRoutes = ["/signin", "/signup"];

  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <div className="flex justify-center items-center">
      <div className="lg:hidden flex h-20 w-[600px] max-w-full fixed bottom-5 rounded-4xl justify-between items-center px-5 py-2 bg-[rgba(255,255,255,0.9)] border z-10 shadow-md">
        {/* Home */}
        <div className="w-1/5 flex flex-col items-center justify-center text-gray-700">
          <IoHomeOutline size={24} />
          <span className="text-xs mt-1">Home</span>
        </div>

        {/* Categories */}
        <div className="w-1/5 flex flex-col items-center justify-center text-gray-700">
          <BiCategory size={24} />
          <span className="text-xs mt-1">Categories</span>
        </div>

        {/* Cart */}
        <div className="w-1/5 flex flex-col items-center justify-center text-gray-700">
          <FiShoppingCart size={24} />
          <span className="text-xs mt-1">Cart</span>
        </div>

        {/* Profile */}
        <div className="w-1/5 flex flex-col items-center justify-center text-gray-700">
          <FiUser size={24} />
          <span className="text-xs mt-1">Profile</span>
        </div>

        {/* Notifications */}
        <div className="w-1/5 flex flex-col items-center justify-center text-gray-700">
          <FiBell size={24} />
          <span className="text-xs mt-1">Notifications</span>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
