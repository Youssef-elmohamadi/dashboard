import React, { useState, useRef, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { getAllCategories } from "../../../api/EndUserApi/endUserCategories/_requests";
import { useSelector, useDispatch } from "react-redux";
import { removeItem } from "../Redux/cartSlice/CartSlice";
import { RiDeleteBin4Fill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import { useQuery } from "@tanstack/react-query";
const NavBar = React.memo(() => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  //const [Categories, setCategories] = useState<any>();
  const items = useSelector((state) => state.cart.items);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const { dir } = useDirectionAndLanguage();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const isOpenCartRef = useRef(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { t } = useTranslation(["EndUserNavBar"]);
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

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await getAllCategories();
  //       console.log(response.cached);
  //       setCategories(response.data.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchCategories();
  // }, []);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getAllCategories();
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

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
            {t("navbar.categories")}
            <IoIosArrowDown
              className={`transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`absolute top-full ${
              dir === "ltr" ? "left-0" : "right-0"
            } bg-white z-50 text-black max-h-[74vh] rounded-md mt-1 w-full transition-all duration-300 transform ${
              isDropdownOpen
                ? "opacity-100 scale-y-100 visible"
                : "opacity-0 scale-y-0 invisible"
            }`}
          >
            <ul className="flex flex-col overflow-y-auto max-h-[74vh] scroll-bar-hide relative z-30">
              {categories?.length > 0 ? (
                categories.map((category, index) => (
                  <li
                    onClick={toggleDropdown}
                    key={index}
                    className="group relative px-4 py-2 hover:bg-[#8826bd35] cursor-pointer"
                  >
                    <Link
                      to={`/category/${category.id}`}
                      className="flex justify-between items-center w-full"
                    >
                      <div className="">{category.name}</div>
                      {category.childs && category.childs.length > 0 && (
                        <IoIosArrowDown
                          className={`transform ${
                            dir === "ltr" ? "rotate-[-90deg]" : "rotate-[90deg]"
                          } group-hover:rotate-0 transition duration-300 ml-2`}
                        />
                      )}
                    </Link>
                    {category.childs && category.childs.length > 0 && (
                      <ul
                        className={`fixed top-0 z-[99999] ${
                          dir === "ltr" ? "left-full" : "right-full"
                        } w-[200%] h-[calc(100vh-11em)] bg-white  invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-y-auto py-2 px-4`}
                      >
                        {category.childs.map((sub, subIndex) => (
                          <li key={subIndex} className="p-2">
                            {sub.childs && sub.childs.length > 0 ? (
                              <div>
                                <div className="font-bold mb-1">{sub.name}</div>
                                <ul className="pl-4 space-y-1">
                                  {sub.childs.map((nested, nestedIndex) => (
                                    <li key={nestedIndex}>
                                      <Link
                                        to={`/category/${nested.id}`}
                                        className="hover:bg-gray-100 block p-1 rounded"
                                      >
                                        {nested.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <Link
                                to={`/category/${sub.id}`}
                                className="hover:bg-gray-100 block p-2 rounded"
                              >
                                {sub.name}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">
                  {t("navbar.noCategoryFound")}
                </div>
              )}
            </ul>
          </div>
        </div>

        {/* Static Links */}
        <ul className="flex justify-center lg:justify-start flex-[2] gap-5">
          {categories?.map((category, i) =>
            i < 4 ? (
              <li key={i} className="text-white py-3">
                <Link
                  to={`/category/${category.id}`}
                  className="py-3 font-semibold"
                >
                  {category.name}
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
            <div className="text-white">
              {t("navbar.items", { count: totalQuantity })}
            </div>
            <div className="text-white">
              {t("navbar.priceWithCurrency", { price: totalPrice.toFixed(2) })}
            </div>
          </div>
          {isCartOpen && (
            <div
              className={`absolute top-10 ${
                dir === "ltr" ? "right-0" : "left-0"
              } min-w-[350px] bg-white shadow-lg rounded-lg p-4 z-[99999]`}
              ref={isOpenCartRef}
            >
              <h3 className="text-lg font-bold mb-2">{t("navbar.yourCart")}</h3>
              <ul className="divide-y max-h-[300px] overflow-y-auto">
                {items.length > 0 ? (
                  items?.map((item) => (
                    <li
                      key={item.id}
                      className="py-2 flex items-center justify-between gap-2 border-b border-gray-200"
                    >
                      <img
                        src={item.images[0]?.image || ""}
                        alt={item.title}
                        className="w-14 h-14 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-sm text-gray-500">
                          {t("navbar.qty")} {item.quantity}
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {t("navbar.priceWithCurrency", { price: totalPrice })}
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
                    {t("navbar.cartIsEmpty")}
                  </li>
                )}
              </ul>
              {items.length > 0 && (
                <>
                  <div className="mt-4 flex justify-between font-semibold">
                    <span>{t("navbar.total")}:</span>
                    <span>
                      {t("navbar.priceWithCurrency", { price: totalPrice })}
                    </span>
                  </div>
                  <Link
                    to="/cart"
                    onClick={toggleCartPopup}
                    className="mt-4 w-full inline-block px-2 text-center bg-primary text-white py-2 rounded hover:bg-opacity-90 transition"
                  >
                    {t("navbar.goToShoppingCart")}
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
