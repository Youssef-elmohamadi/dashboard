import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeItem } from "../Redux/cartSlice/CartSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useTranslation } from "react-i18next";

const CartData: React.FC = () => {
  const { t } = useTranslation(["EndUserCheckout"]);

  const items = useSelector((state: any) => state.cart.items);
  const discount = useSelector((state: any) => state.cart.discount);
  const totalPrice = useSelector((state: any) => state.cart.totalPrice);
  const dispatch = useDispatch();

  const finalPrice = totalPrice - discount;

  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6 sticky top-4 w-full">
      <h3 className="text-xl font-extrabold mb-6 text-gray-900 text-center tracking-wide">
        {t("cartData.summary")}
      </h3>

      {items.length === 0 ? (
        <p className="text-center text-gray-400 italic text-lg py-12">
          {t("cartData.empty")}
        </p>
      ) : (
        <ul className="divide-y divide-gray-200 max-h-[320px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-gray-100">
          {items.map((item: any) => (
            <li
              key={item.id}
              className="py-4 flex items-center justify-between gap-5 hover:bg-purple-50 rounded-lg px-2 transition-colors cursor-pointer select-none"
            >
              <img
                src={item.images[0]?.image}
                alt={item.title || item.name}
                className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-lg truncate">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-500 truncate">
                  {item.description}
                </p>
                <p className="mt-1 text-sm font-medium text-purple-700">
                  {t("cartData.quantity")}: {item.quantity}
                </p>
              </div>
              <div className="text-md font-semibold text-gray-800 whitespace-nowrap min-w-[90px] text-right">
                {(item.price * item.quantity).toFixed(2)}{" "}
                {t("cartData.currency")}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(removeItem(item.id));
                }}
                aria-label={t("cartData.removeItem", { name: item.name })}
                className="p-2 rounded-full hover:bg-red-100 transition-colors"
                title={t("cartData.remove")}
              >
                <RiDeleteBin6Line className="text-red-600 text-2xl hover:text-red-800" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {items.length > 0 && (
        <div className="mt-6 border-t border-gray-300 pt-5 flex justify-between items-center text-xl font-bold text-gray-900">
          <span>{t("cartData.total")}:</span>
          {discount > 0 ? (
            <div className="flex flex-col items-end text-sm">
              <span className="line-through text-gray-400 text-base">
                {totalPrice.toFixed(2)} {t("cartData.currency")}
              </span>
              <span className="text-green-600 font-extrabold text-lg">
                {finalPrice.toFixed(2)} {t("cartData.currency")}
              </span>
            </div>
          ) : (
            <span>
              {totalPrice.toFixed(2)} {t("cartData.currency")}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default CartData;
