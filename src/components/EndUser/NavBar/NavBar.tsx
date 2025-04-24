import React, { useState, useRef, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { getAllCategories } from "../../../api/EndUserApi/endUserCategories/_requests";
import { useSelector, useDispatch } from "react-redux";
import { removeItem } from "../Redux/cartSlice/CartSlice";
import { RiDashboard2Fill, RiDeleteBin4Fill } from "react-icons/ri";
import { CiShoppingCart } from "react-icons/ci";

const NavBar = React.memo(() => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [Categories, setCategories] = useState<any>();
  const items = useSelector((state) => state.cart.items);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const isOpenCartRef = useRef(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCartPopup = () => {
    setIsCartOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpenCartRef.current &&
        !event.target.closest(".cart") &&
        !isOpenCartRef.current.contains(event.target)
      ) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <nav className="bg-primary w-full md:block hidden">
      <div className="flex enduser_container w-full justify-center lg:justify-baseline items-center relative">
        {/* Categories Dropdown */}
        <div
          className="Categories flex-[1] lg:block hidden relative"
          ref={dropdownRef}
        >
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 text-white font-semibold py-4"
          >
            Categories
            <IoIosArrowDown
              className={`transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`absolute top-full left-0 bg-white z-50 text-black shadow-lg rounded-md mt-1 w-48 transition-all duration-300 origin-top transform ${
              isDropdownOpen
                ? "opacity-100 scale-y-100 visible"
                : "opacity-0 scale-y-0 invisible"
            }`}
          >
            <ul className="flex flex-col">
              {Categories?.length > 0 ? (
                Categories.map((category, index) => (
                  <li
                    key={index}
                    className="group relative px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <Link to="">{category.name}</Link>
                      {category.childs && category.childs.length > 0 && (
                        <IoIosArrowDown className="transform rotate-[-90deg] group-hover:rotate-0 transition duration-300 ml-2" />
                      )}
                    </div>
                    {category.childs && category.childs.length > 0 && (
                      <ul className="fixed top-0 left-full w-[400%] h-[calc(100vh-11em)] bg-white z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-y-auto py-8 px-12">
                        <div className="grid grid-cols-4 gap-6">
                          {category.childs.map((sub, subIndex) => (
                            <li
                              key={subIndex}
                              className="hover:bg-gray-100 p-2 rounded cursor-pointer whitespace-nowrap"
                            >
                              <Link to="">{sub.name}</Link>
                            </li>
                          ))}
                        </div>
                      </ul>
                    )}
                  </li>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No Category Found</div>
              )}
            </ul>
          </div>
        </div>

        {/* Static Links */}
        <ul className="flex justify-center lg:justify-start flex-[2] gap-5">
          {Categories?.map((Category, i) =>
            i < 4 ? (
              <li key={i} className="text-white py-3">
                <Link to="" className="py-3 font-semibold">
                  {Category.name}
                </Link>
              </li>
            ) : null
          )}
        </ul>

        {/* Cart */}
        <div className="relative">
          <div
            className="lg:flex flex-[1] cart relative gap-3 cursor-pointer hidden items-center justify-end"
            onClick={toggleCartPopup}
          >
            <FaShoppingCart className="text-white text-2xl" />
            <div className="text-white">{totalPrice} EGP</div>
            <div className="text-white">({totalQuantity}) Items</div>
          </div>
          {isCartOpen && (
            <div
              className="absolute top-10 right-0 min-w-[350px] bg-white shadow-lg rounded-lg p-4 z-50"
              ref={isOpenCartRef}
            >
              <h3 className="text-lg font-bold mb-2">Your Cart</h3>
              <ul className="divide-y max-h-[300px] overflow-y-auto">
                {items.length > 0 ? (
                  items?.map((item) => (
                    <li
                      key={item.id}
                      className="py-2 flex items-center justify-between gap-2"
                    >
                      <img
                        src={item.images[0]?.image||""}
                        alt={item.title}
                        className="w-14 h-14 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {(item.price * item.quantity).toFixed(2)} EGP
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(removeItem(item.id));
                        }}
                        className=" ml-2"
                      >
                        <RiDeleteBin4Fill className="text-xl text-error-500" />
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="text-center text-gray-500 py-4">
                    Cart is empty
                  </li>
                )}
              </ul>
              {items.length > 0 && (
                <>
                  <div className="mt-4 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>
                      {items
                        .reduce(
                          (total, item) => total + item.price * item.quantity,
                          0
                        )
                        .toFixed(2)}{" "}
                      EGP
                    </span>
                  </div>
                  <Link
                    to="/cart"
                    onClick={toggleCartPopup}
                    className="mt-4 w-full inline-block px-2 text-center bg-primary text-white py-2 rounded hover:bg-opacity-90 transition"
                  >
                    Go To Shoping Cart
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
});

export default NavBar;
