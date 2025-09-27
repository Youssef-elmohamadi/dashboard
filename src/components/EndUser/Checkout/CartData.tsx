import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeItem } from "../Redux/cartSlice/CartSlice";
import { useTranslation } from "react-i18next";
import { RootState } from "../Redux/Store";
import DeleteIcon from "../../../icons/DeleteIcon";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

const CartData: React.FC = () => {
  const { t } = useTranslation(["EndUserCheckout"]);

  const items = useSelector((state: RootState) => state.cart.items);
  const discount = useSelector((state: RootState) => state.cart.discount);
  const subtotal = useSelector((state: RootState) => state.cart.totalPrice);
  const dispatch = useDispatch();
  const finalPrice = subtotal - discount;
  const {lang}=useDirectionAndLanguage();
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-6 sticky top-4 w-full">
      <h3 className="text-2xl font-extrabold mb-6 text-gray-900 text-center tracking-wide">
        {t("cartData.summary")}
      </h3>

      {items.length === 0 ? (
        <p className="text-center text-gray-400 italic text-lg py-12">
          {t("cartData.empty")}
        </p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 max-h-[320px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-gray-100">
            {items.map((item: any) => (
              <li
                key={item.id}
                className="py-4 flex items-start justify-between gap-4 transition-colors"
              >
                <img
                  src={item.images[0]?.image}
                  alt={item[`name_${lang}`]}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                />
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <h4 className="font-semibold text-gray-900 text-base truncate">
                    {item[`name_${lang}`]}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {t("cartData.quantity")}: {item.quantity}
                  </p>
                  <div className="flex flex-col text-sm font-medium mt-1">
                    {item.discount_price ? (
                      <>
                        <span className="line-through text-gray-400">
                          {t("cartData.price_label", {
                            price: (item.price * Number(item.quantity)).toFixed(
                              2
                            ),
                          })}
                        </span>
                        <span className="end-user-text-base font-bold">
                          {t("cartData.price_label", {
                            price: (
                              item.discount_price * Number(item.quantity)
                            ).toFixed(2),
                          })}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-800 font-bold">
                        {t("cartData.price_label", {
                          price: (
                            Number(item.price) * Number(item.quantity)
                          ).toFixed(2),
                        })}
                      </span>
                    )}
                  </div>
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
                  <DeleteIcon className="text-red-600 text-xl hover:text-red-800" />
                </button>
              </li>
            ))}
          </ul>

          {/* Cart Summary Table */}
          <div className="mt-6 pt-5 border-gray-300 space-y-3">
            {/* <div className="flex justify-between text-lg text-gray-700">
              <span>{t("cartData.subtotal")}:</span>
              <span className="font-semibold">
                {subtotal.toFixed(2)} {t("cartData.currency")}
              </span>
            </div> */}

            {discount > 0 && (
              <div className="flex justify-between text-lg text-red-600 font-semibold">
                <span>{t("cartData.discount")}:</span>
                <span>
                  -{discount.toFixed(2)} {t("cartData.currency")}
                </span>
              </div>
            )}

            {/* <div className="flex justify-between text-lg text-gray-700">
              <span>{t("cartData.shipping")}:</span>
              <span className="font-semibold">{t("cartData.free")}</span>
            </div> */}
          </div>
        </>
      )}

      {items.length > 0 && (
        <div className="mt-6 border-t border-gray-300 pt-5 flex justify-between items-center text-xl font-bold text-gray-900">
          <span>{t("cartData.total")}:</span>
          <span>
            {finalPrice.toFixed(2)} {t("cartData.currency")}
          </span>
        </div>
      )}
    </div>
  );
};

export default CartData;
