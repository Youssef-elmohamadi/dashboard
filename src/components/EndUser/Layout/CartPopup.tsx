import React, { useRef } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeItem } from "../Redux/cartSlice/CartSlice";
import { RiDeleteBin4Fill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import useClickOutside from "../context/useClickOutside";

interface CartItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  images: { image: string }[];
}

interface CartPopupProps {
  isCartOpen: boolean;
  toggleCartPopup: () => void;
  lang: string | undefined;
}

const CartPopup: React.FC<CartPopupProps> = ({
  isCartOpen,
  toggleCartPopup,
  lang,
}) => {
  const items: CartItem[] = useSelector((state: any) => state.cart.items);
  const totalPrice: number = useSelector((state: any) => state.cart.totalPrice);
  const totalQuantity: number = useSelector(
    (state: any) => state.cart.totalQuantity
  );
  const { dir } = useDirectionAndLanguage();
  const dispatch = useDispatch();
  const { t } = useTranslation(["EndUserNavBar"]);

  const isOpenCartRef = useRef<HTMLDivElement>(null);

  useClickOutside(isOpenCartRef, toggleCartPopup, isCartOpen);

  return (
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
              items.map((item: CartItem) => (
                <li
                  key={item.id}
                  className="py-2 flex items-center justify-between gap-2 border-b border-gray-200"
                >
                  <img
                    src={
                      item.images[0]?.image ||
                      "https://placehold.co/60x60/E0E0E0/FFFFFF?text=No+Image"
                    }
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
                    {t("navbar.priceWithCurrency", {
                      price: item.price * item.quantity,
                    })}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(removeItem(item.id));
                    }}
                    className="ml-2"
                  >
                    <RiDeleteBin4Fill className="text-xl text-red-500" />
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
                  {t("navbar.priceWithCurrency", {
                    price: totalPrice.toFixed(2),
                  })}
                </span>
              </div>
              <Link
                to={`/${lang}/cart`}
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
  );
};

export default CartPopup;
